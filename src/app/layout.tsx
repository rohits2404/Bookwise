import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body
                className={`${ibmPlexSans.variable} ${bebasNeue.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
