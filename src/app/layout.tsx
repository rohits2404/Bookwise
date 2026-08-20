import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const ibmPlexSans = localFont({
    src: [
        {
            path: "./fonts/IBMPlexSans-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/IBMPlexSans-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/IBMPlexSans-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/IBMPlexSans-Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--ibm-plex-sans",
});

const bebasNeue = localFont({
    src: "./fonts/BebasNeue-Regular.ttf",
    variable: "--bebas-neue",
    weight: "400",
});

export const metadata: Metadata = {
    title: "BookWise",
    description:
        "BookWise is a book borrowing university library management solution.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const session = await auth();

    return (
        <html lang="en">
            <SessionProvider session={session}>
                <body
                    className={`${ibmPlexSans.variable} ${bebasNeue.variable} antialiased`}
                >
                    {children}
                    <Toaster />
                </body>
            </SessionProvider>
        </html>
    );
}
