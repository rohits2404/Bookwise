"use client";

import { ImageKitProvider, Video } from "@imagekit/next";
import config from "@/lib/config";

export const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
            <Video src={videoUrl} controls className="w-full rounded-xl" />
        </ImageKitProvider>
    );
};
