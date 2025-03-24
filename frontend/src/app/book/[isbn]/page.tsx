"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/util/Navbar";
import axiosInstance from "@/utils/axiosInstance";
import { CurrentlyReadingBook, FetchedBook, ProgressUpdates, Review } from "@/utils/models";
import Dropdown from "@/app/search/Dropdown";
import { useUser } from "@/app/context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "../../../../firebase";
import UpdateProgressButton from "@/components/util/UpdateProgressButton";
import MarkAsFinishedButton from "@/components/util/MarkAsFinishedButton";
import ReviewCard from "@/components/util/ReviewCard";

// TODO: basic information such as pages and whatnot
// TODO: find a place to put the ISBN
// TODO: if book is currently being read, change add to shelf to update progress which shows a modal

export default function BookPage() {
    const params = useParams();
    const isbn = params.isbn as string;
    const { shelves, refreshShelves, currentlyReading } = useUser();

    const [book, setBook] = useState<FetchedBook | null>(null);
    const [reviews, setReviews] = useState<Review[] | null>(null);
    const [progressUpdates, setProgressUpdates] = useState<ProgressUpdates[]>([]);
    
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const [userBook, setUserBook] = useState<CurrentlyReadingBook | null>(null);

    useEffect(() => {
        const foundBook = currentlyReading?.find(
            (currentBook) => currentBook.Isbn === isbn
        );
        setUserBook(foundBook ?? null);
    }, [isbn, currentlyReading, shelves])

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axiosInstance.get(`/books?isbn=${isbn}`);
                setBook(res.data);
                const reviewsRes = await axiosInstance.get(`/reviews?isbn=${isbn}`);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBook();
        
    }, [isbn]);

    useEffect(() => {   
        const fetchUpdates = async () => {
    
            try {
    
                let user = auth.currentUser;
                let attempts = 0;
                while (!user && attempts < 10) {
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    user = auth.currentUser;
                    attempts++;
                }
    
                if (!user) {
                    console.error("User is not authenticated. Cannot fetch progress updates.");
                    return;
                }
                const idToken = await user.getIdToken();
    
                const res = await axiosInstance.get(`/users/me/books/${isbn}/progress`, {
                    headers: { Authorization: `Bearer ${idToken}` },
                });

                const reviewsRes = await axiosInstance.get(`/reviews?isbn=${isbn}`);
                setReviews(reviewsRes.data);
                if (res.data) {
                    setProgressUpdates([...res.data])
                }
            } catch (error) {
                console.error("Error fetching progress updates:", error);
            }
        };
    
        fetchUpdates();
    }, [isbn, refreshTrigger]); 

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

    const TriggerRefresh = () => {
        refreshShelves()
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak px-20 py-10">
            <Navbar />
            <div className="flex-grow flex justify-center items-center mt-10">
                {book && shelves && progressUpdates ? (
                    <div className="flex flex-row gap-4">
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <img
                                className="w-48 h-72 rounded-lg"
                                src={getHighResImage(book.cover_image_url)}
                                alt="Book cover"
                            />
                            <div className="mt-8">
                                {userBook ?
                                <div className="flex flex-col">
                                    <UpdateProgressButton CoverImageURL={userBook.CoverImageUrl} isbn={book.isbn} onProgressUpdate={() => setRefreshTrigger(prev => prev + 1)}/>
                                    <MarkAsFinishedButton CoverImageURL={userBook.CoverImageUrl} isbn={book.isbn} shelves={shelves} triggerRefresh={TriggerRefresh}/>
                                </div> 
                                : <Dropdown shelves={shelves} onSelect={addToShelf} />}
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
                                <h1 className="text-secondary-strong text-2xl self-end justify-self-end">
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
                                                return `Published ${year}/${month}/${day}`;
                                            } else if (year && month) {
                                                return `Published ${year}/${month}`;
                                            } else {
                                                return `Published ${year}`;
                                            }
                                        })()
                                        : "Unknown Publish Date"}
                                </h1>
                            </div>
                            <p className="text-lg text-secondary-strong mt-8">
                                {book.description}
                            </p>
                            {userBook ? <div className="w-full bg-stroke-weak rounded-full h-4 mb-4 mt-6">
                                    <div
                                        className="bg-gradient-to-r from-[#4C7BD9] to-primary h-4 rounded-full"
                                        style={{ width: `${(userBook.Progress / userBook.Pages) * 100}%` }}
                                    ></div>
                                    <div className="flex flex-row justify-between w-full mt-2">
                                        <span>0%</span>
                                        <span>100%</span>
                                    </div>
                            </div> : <></>}
                            <div className="mt-10 p-4">
                                <h2 className="text-lg font-bold mb-2">Progress Updates</h2>
                                {progressUpdates ? (
                                progressUpdates.map((update, index) => {
                                    return (
                                    <div key={index} className="mb-4 p-3 bg-fill rounded-md shadow">
                                        <h4 className="text-secondary-strong">You finished {((update.progress / book.pages) * 100).toFixed(2)}% of the book!</h4>
                                    <p className="text-secondary-strong">
                                        {update.comment}
                                    </p>
                                    <p className="text-xs text-secondary-weak">
                                        {new Date(update.created_at).toLocaleDateString('en-CA')}
                                    </p>
                                    </div>
                                )})
                                ) : (
                                <p className="text-secondary-weak">No progress updates yet.</p>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-bold mb-2">Reviews</h2>
                                {reviews ? (
                                    reviews.map((review, index) => (
                                        <ReviewCard key={index} review={review} inBook={true} />
                                    ))
                                    
                                ) : (
                                    <p>No reviews yet.</p>
                                )}
                            </div>
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