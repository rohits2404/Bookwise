import { BookList } from "@/components/BookList";
import { BookOverview } from "@/components/BookOverview";
import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
    return (
        <div>
            <BookOverview />
            <BookList />
        </div>
    );
};

export default Home;
