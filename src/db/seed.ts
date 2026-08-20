import ImageKit from "@imagekit/nodejs";
import dummyBooks from "../../dummybooks.json";
import { books } from "./schema";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { InferInsertModel } from "drizzle-orm";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
    url: string,
    fileName: string,
    folder: string,
): Promise<string> => {
    try {
        const response = await imagekit.files.upload({
            file: url,
            fileName,
            folder,
        });

        if (!response.url) {
            throw new Error(`ImageKit upload for ${fileName} returned no URL`);
        }

        console.log(`Uploaded: ${response.url}`);

        return response.url;
    } catch (error) {
        console.error(`Error uploading ${fileName} to ImageKit:`, error);
        throw error;
    }
};

type NewBook = InferInsertModel<typeof books>;

const seed = async () => {
    console.log("Seeding Data...");

    try {
        for (const book of dummyBooks) {
            console.log(`Uploading assets for: ${book.title}`);

            const coverUrl = await uploadToImageKit(
                book.coverUrl,
                `${book.title}.jpg`,
                "/books/covers",
            );

            const videoUrl = await uploadToImageKit(
                book.videoUrl,
                `${book.title}.mp4`,
                "/books/videos",
            );

            const newBook: NewBook = {
                ...book,
                coverUrl,
                videoUrl,
            };

            await db.insert(books).values(newBook);

            console.log(`Seeded: ${book.title}`);
        }

        console.log("Data Seeded Successfully!");
    } catch (error) {
        console.error("Error Seeding Data:", error);
    }
};

seed();
