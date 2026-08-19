import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
            },
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },
        ],
    },
};

export default nextConfig;
