"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { ZodType } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { FileUpload } from "./FileUpload";
import { toast } from "sonner";

interface Props<T extends FieldValues> {
    schema: ZodType<T, any>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

export const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {
    const router = useRouter();

    const isSignIn = type === "SIGN_IN";

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);

        if (result.success) {
            toast.success(
                isSignIn ? "Login Successful" : "Registration Successful",
            );

            router.push("/");
        } else {
            toast.error(`Error ${isSignIn ? "Signing In" : "Signing Up"}`);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn
                    ? "Welcome Back To BookWise"
                    : "Create Your Library Account"}
            </h1>
            <p className="text-light-100">
                {isSignIn
                    ? "Access The Vast Collection Of Resources, And Stay Updated"
                    : "Please Complete All Fields And Upload a Valid University ID To Gain Access To The Library"}
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full space-y-6"
                >
                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">
                                        {
                                            FIELD_NAMES[
                                                field.name as keyof typeof FIELD_NAMES
                                            ]
                                        }
                                    </FormLabel>
                                    <FormControl>
                                        {field.name === "universityCard" ? (
                                            <FormControl>
                                                <FileUpload
                                                    type="image"
                                                    accept="image/*"
                                                    placeholder="Upload Your ID"
                                                    folder="ids"
                                                    variant="dark"
                                                    onFileChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        ) : (
                                            <FormControl>
                                                <Input
                                                    required
                                                    type={
                                                        FIELD_TYPES[
                                                            field.name as keyof typeof FIELD_TYPES
                                                        ]
                                                    }
                                                    {...field}
                                                    className="form-input"
                                                />
                                            </FormControl>
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button type="submit" className="form-btn">
                        {isSignIn ? "Sign In" : "Sign Up"}
                    </Button>
                </form>
            </Form>
            <p className="text-center text-base font-medium">
                {isSignIn ? "New To BookWise? " : "Already Have An Account? "}

                <Link
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className="font-bold text-primary"
                >
                    {isSignIn ? "Create An account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};
