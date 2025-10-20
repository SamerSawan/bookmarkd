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


export default function BookPage() {
    const params = useParams();
    const isbn = params.isbn as string;
    const { shelves, refreshShelves, currentlyReading, favourites } = useUser();

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

    const isFavourite = favourites?.some((fav) => fav.Isbn === isbn) || false;

    const toggleFavourite = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("You need to be logged in to add favourites.");
                return;
            }
            const idToken = await user.getIdToken();

            if (isFavourite) {
                // Remove from favourites
                await axiosInstance.delete(`/users/me/favourites`, {
                    headers: { Authorization: `Bearer ${idToken}` },
                    data: { isbn }
                });
                toast.success("Removed from favourites!");
            } else {
                // Add to favourites
                await axiosInstance.post(`/users/me/favourites`,
                    { isbn },
                    { headers: { Authorization: `Bearer ${idToken}` } }
                );
                toast.success("Added to favourites!");
            }
            refreshShelves();
        } catch (error: any) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(isFavourite ? "Failed to remove from favourites" : "Failed to add to favourites");
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak">
            <div className="px-20 py-10">
                <Navbar />
            </div>

            {/* Main Content - Centered, Max Width */}
            <div className="w-full max-w-[1400px] mx-auto px-20 pb-16">
                {book && shelves && progressUpdates ? (
                    <div className="flex flex-col gap-12">
                        {/* Book Header Section */}
                        <div className="flex gap-8">
                            {/* Book Cover & Actions */}
                            <div className="flex-shrink-0">
                                <img
                                    className="w-[200px] h-[300px] rounded-md shadow-lg object-cover"
                                    src={getHighResImage(book.cover_image_url)}
                                    alt="Book cover"
                                />
                                <div className="mt-4 flex flex-col gap-2">
                                    {userBook ? (
                                        <>
                                            <UpdateProgressButton
                                                CoverImageURL={userBook.CoverImageUrl}
                                                isbn={book.isbn}
                                                pages={book.pages}
                                                onProgressUpdate={() => setRefreshTrigger(prev => prev + 1)}
                                            />
                                            <MarkAsFinishedButton
                                                CoverImageURL={userBook.CoverImageUrl}
                                                isbn={book.isbn}
                                                shelves={shelves}
                                                triggerRefresh={TriggerRefresh}
                                                isCurrentlyReading={true}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Dropdown shelves={shelves} onSelect={addToShelf}/>
                                            <MarkAsFinishedButton
                                                CoverImageURL={book.cover_image_url}
                                                isbn={book.isbn}
                                                shelves={shelves}
                                                triggerRefresh={TriggerRefresh}
                                                isCurrentlyReading={false}
                                            />
                                        </>
                                    )}
                                    {/* Add to Favourites Button */}
                                    <button
                                        onClick={toggleFavourite}
                                        className={`w-full py-2 px-4 rounded my-2 transition ${
                                            isFavourite
                                                ? 'bg-amber-500 text-secondary-dark hover:opacity-80'
                                                : 'bg-slate-700 text-secondary hover:bg-slate-600'
                                        }`}
                                    >
                                        {isFavourite ? '★ Remove from Favourites' : '☆ Add to Favourites'}
                                    </button>
                                </div>
                            </div>

                            {/* Book Info */}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    {book.title}
                                </h1>
                                <p className="text-xl text-secondary-weak mb-6">
                                    by <span className="text-secondary italic">{book.author}</span>
                                </p>

                                {/* Book Meta */}
                                <div className="flex gap-4 text-sm text-secondary-weak mb-6">
                                    <span>{book.pages} pages</span>
                                    <span>
                                        Published {book.publish_date
                                            ? new Date(book.publish_date).getUTCFullYear()
                                            : "Unknown"}
                                    </span>
                                </div>

                                {/* Progress Bar (if currently reading) */}
                                {userBook && (
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-secondary-weak mb-2">
                                            <span>Your Progress</span>
                                            <span>{Math.round((userBook.Progress / userBook.Pages) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-[#4C7BD9] to-primary h-2 rounded-full transition-all"
                                                style={{ width: `${(userBook.Progress / userBook.Pages) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-secondary leading-relaxed">
                                    {book.description}
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-700/30"></div>

                        {/* Progress Updates Section */}
                        {progressUpdates && progressUpdates.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-6">Progress Updates</h2>
                                <div className="flex flex-col gap-4">
                                    {progressUpdates.map((update, index) => (
                                        <div key={index} className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-white font-medium">
                                                    {((update.progress / book.pages) * 100).toFixed(0)}% complete
                                                </h4>
                                                <span className="text-xs text-secondary-weak">
                                                    {new Date(update.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            {update.comment && (
                                                <p className="text-secondary">
                                                    {update.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6">Reviews</h2>
                            {reviews && reviews.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {reviews.map((review, index) => (
                                        <ReviewCard key={index} review={review} inBook={true} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-12 bg-slate-800/20 rounded-lg border border-slate-700/30">
                                    <p className="text-secondary-weak">No reviews yet.</p>
                                </div>
                            )}
                        </div>

                        <ToastContainer theme="colored" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <p className="text-xl text-secondary-weak">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
}