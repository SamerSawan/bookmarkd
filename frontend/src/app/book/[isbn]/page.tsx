"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/util/Navbar";
import axiosInstance from "@/utils/axiosInstance";
import { FetchedBook } from "@/utils/models";
import Dropdown from "@/app/search/Dropdown";
import { useUser } from "@/app/context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "../../../../firebase";

export default function BookPage() {
    const params = useParams();
    const isbn = params.isbn as string;
    const { shelves, refreshShelves } = useUser()

    const [book, setBook] = useState<FetchedBook | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axiosInstance.get(`/books?isbn=${isbn}`);
                setBook(res.data); // Set the book data
            } catch (error) {
                console.error(error);
            }
        };

        fetchBook();
    }, [isbn]);

    const getHighResImage = (url: string) => {
        if (!url) return "https://via.placeholder.com/100x150";
        return url.replace(/^http:/, "https:").replace(/zoom=\d+/, "zoom=3");
    };

    const addToShelf = async (shelfId: string, shelfName: string) => {
        if (!book) {
            return
        }
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("You need to be logged in to add books.");
                return;
            }
            const idToken = await user.getIdToken();

            const checkBookExistsInShelf = await axiosInstance.get(`/shelves/${shelfId}/exists?isbn=${book.isbn}`)

            const bookIsInShelf = checkBookExistsInShelf.data.exists;
            if (bookIsInShelf) {
                console.log(`${book.title} already exists in target shelf!`)
                toast.error(`${book.title} is already in ${shelfName}`)
                return;
            }

            await axiosInstance.post(`/shelves/${shelfId}`, {
                isbn: book.isbn,
            },
            {
                headers: {
                Authorization: `Bearer ${idToken}`,
                },
            });

            refreshShelves();
      
            toast.success(`Successfully added "${book.title}" to ${shelfName}!`);
        } catch (error) {
            console.log(error)
            toast.error(`Failed to add "${book.title}" to ${shelfName}`)
            return
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak px-20 py-10">
            <Navbar />
            <div className="flex-grow flex justify-center items-center">
                {book ? (
                    <div className="flex flex-row gap-4">
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <img
                                className="w-48 h-72 rounded-lg"
                                src={getHighResImage(book.cover_image_url)}
                                alt="Book cover"
                            />
                            <div className="mt-8">
                                <Dropdown shelves={shelves} onSelect={addToShelf} />
                            </div>
                            
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-2">
                                    <h1 className="text-3xl font-bold text-secondary-strong">
                                        {book.title}
                                    </h1>
                                    <h1 className="text-secondary-weak font-bold text-3xl">
                                        by
                                    </h1>
                                    <h1 className="text-secondary-strong font-bold italic text-3xl">
                                        {book.author}
                                    </h1>
                                </div>
                                <h1 className="text-secondary-weak text-2xl self-end justify-self-end">
                                    {book.publish_date
                                        ? (() => {
                                            const date = new Date(book.publish_date);
                                            const year = date.getUTCFullYear();
                                            const month = (date.getUTCMonth() + 1)
                                                .toString()
                                                .padStart(2, "0");
                                            const day = date
                                                .getUTCDate()
                                                .toString()
                                                .padStart(2, "0");

                                            if (year && month && day) {
                                                return `${year}/${month}/${day}`;
                                            } else if (year && month) {
                                                return `${year}/${month}`;
                                            } else {
                                                return `${year}`;
                                            }
                                        })()
                                        : "Unknown Publish Date"}
                                </h1>
                            </div>
                            <p className="text-lg text-secondary-strong mt-8">
                                {book.description}
                            </p>
                        </div>
                        <ToastContainer theme="colored" />
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>

    );
}