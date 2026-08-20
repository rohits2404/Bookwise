"use client";

import {
    Image as IKImage,
    ImageKitProvider,
    Video as IKVideo,
    upload,
} from "@imagekit/next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const {
    env: {
        imagekit: { publicKey, urlEndpoint },
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit");

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`,
            );
        }

        const data = await response.json();

        const { signature, expire, token } = data;

        return {
            token,
            expire,
            signature,
        };
    } catch (error) {
        throw new Error(
            `Authentication request failed: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
        );
    }
};

interface Props {
    type: "image" | "video";
    accept: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    onFileChange: (filePath: string) => void;
    value?: string;
}

export const FileUpload = ({
    type,
    accept,
    placeholder,
    folder,
    variant,
    onFileChange,
    value,
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });

    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const styles = {
        button:
            variant === "dark"
                ? "bg-dark-300"
                : "bg-light-600 border-gray-100 border",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-400",
    };

    const onValidate = (file: File) => {
        if (type === "image" && file.size > 20 * 1024 * 1024) {
            toast.error("File Size Too Large");

            return false;
        }

        if (type === "video" && file.size > 50 * 1024 * 1024) {
            toast.error("File Size Too Large");

            return false;
        }

        return true;
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        if (!onValidate(selectedFile)) {
            event.target.value = "";
            return;
        }

        try {
            setIsUploading(true);
            setProgress(0);

            const authParams = await authenticator();

            const response = await upload({
                file: selectedFile,
                fileName: selectedFile.name,

                publicKey,

                token: authParams.token,
                expire: authParams.expire,
                signature: authParams.signature,

                folder,
                useUniqueFileName: true,

                onProgress: (event) => {
                    if (event.total) {
                        const percent = Math.round(
                            (event.loaded / event.total) * 100,
                        );

                        setProgress(percent);
                    }
                },
            });

            if (!response.filePath) {
                throw new Error("ImageKit Did Not Return a File Path.");
            }

            const imageUrl = `${urlEndpoint}${response.filePath}`;

            setFile({ filePath: imageUrl });
            onFileChange(imageUrl);

            toast.success(`${type} Uploaded Successfully`);
        } catch (error) {
            console.error(error);

            toast.error(`${type} Upload Failed`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ImageKitProvider urlEndpoint={urlEndpoint}>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />

            <button
                type="button"
                disabled={isUploading}
                className={cn(
                    "upload-btn",
                    styles.button,
                    isUploading && "cursor-not-allowed opacity-60",
                )}
                onClick={() => {
                    fileInputRef.current?.click();
                }}
            >
                <Image
                    src="/icons/upload.svg"
                    alt="upload-icon"
                    width={20}
                    height={20}
                    className="object-contain"
                />

                <p className={cn("text-base", styles.placeholder)}>
                    {isUploading ? `Uploading... ${progress}%` : placeholder}
                </p>

                {file.filePath && (
                    <p className={cn("upload-filename", styles.text)}>
                        {file.filePath}
                    </p>
                )}
            </button>

            {progress > 0 && progress < 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}

            {file.filePath &&
                (type === "image" ? (
                    <IKImage
                        alt={file.filePath}
                        src={file.filePath}
                        width={500}
                        height={300}
                        className="rounded-xl object-cover"
                    />
                ) : (
                    <IKVideo
                        src={file.filePath}
                        controls
                        className="h-96 w-full rounded-xl"
                    />
                ))}
        </ImageKitProvider>
    );
};
