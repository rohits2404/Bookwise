"use client";

import { borrowBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility: {
        isEligible: boolean;
        message: string;
    };
}

export const BorrowBook = ({
    userId,
    bookId,
    borrowingEligibility: { isEligible, message },
}: Props) => {
    const router = useRouter();
    const [borrowing, setBorrowing] = useState(false);

    const handleBorrowBook = async () => {
        if (!isEligible) {
            toast.error(message);
        }

        setBorrowing(true);

        try {
            const result = await borrowBook({ bookId, userId });

            if (result.success) {
                toast.success("Book Borrowed Successfully");

                router.push("/");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("An Error Occurred While Borrowing The Book");
        } finally {
            setBorrowing(false);
        }
    };

    return (
        <Button
            className="book-overview_btn"
            onClick={handleBorrowBook}
            disabled={borrowing}
        >
            <Image src="/icons/book.svg" alt="book" width={20} height={20} />
            <p className="font-bebas-neue text-xl text-dark-100">
                {borrowing ? "Borrowing ..." : "Borrow Book"}
            </p>
        </Button>
    );
};
