"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/util/Navbar";
import axiosInstance from "@/utils/axiosInstance";
import { CurrentlyReadingBook, FetchedBook, ProgressUpdates } from "@/utils/models";
import { Review } from "@/types/review"
import reviewService from "@/services/reviewService";
import shelfService from "@/services/shelfService";
import ShelfDropdownButton from "@/components/ShelfDropdownButton";
import { useUser } from "@/app/context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "../../../../firebase";
import UpdateProgressButton from "@/components/util/UpdateProgressButton";
import MarkAsFinishedButton from "@/components/util/MarkAsFinishedButton";
import ReviewCard from "@/components/util/ReviewCard";
import { getErrorMessage } from "@/utils/errorHandler";


export default function BookPage() {
    const params = useParams();
    const isbn = params.isbn as string;
    const { shelves, refreshShelves, currentlyReading, favourites } = useUser();

    const [book, setBook] = useState<FetchedBook | null>(null);
    const [reviews, setReviews] = useState<Review[] | null>(null);
    const [progressUpdates, setProgressUpdates] = useState<ProgressUpdates[]>([]);

    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const [userBook, setUserBook] = useState<CurrentlyReadingBook | null>(null);
    const [shelfIDsContainingBook, setShelfIDsContainingBook] = useState<string[]>([]);

    useEffect(() => {
        const foundBook = currentlyReading?.find(
            (currentBook) => currentBook.isbn === isbn
        );
        setUserBook(foundBook ?? null);
    }, [isbn, currentlyReading, shelves])

    useEffect(() => {
        const fetchShelvesContainingBook = async () => {
            try {
                const shelfIDs = await shelfService.getShelvesContainingBook(isbn);
                setShelfIDsContainingBook(shelfIDs);
            } catch (error) {
                console.error("Error fetching shelves containing book:", error);
                setShelfIDsContainingBook([]);
            }
        };
        fetchShelvesContainingBook();
    }, [isbn, shelves]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axiosInstance.get(`/books?isbn=${isbn}`);
                setBook(res.data);
                const reviews = await reviewService.getBookReviews(isbn)
                setReviews(reviews)
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

                const reviews = await reviewService.getBookReviews(isbn);
                setReviews(reviews);
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

    const isFavourite = favourites?.some((fav) => fav.isbn === isbn) || false;

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
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    }

    const [activeTab, setActiveTab] = useState<'updates' | 'reviews'>('reviews');

    // Calculate average rating
    const avgRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
        : null;

    const hasProgressUpdates = progressUpdates && progressUpdates.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak">
            {book && shelves && progressUpdates ? (
                <>
                    {/* Hero Section with Navbar and Blurred Background */}
                    <div className="relative w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110"
                            style={{ backgroundImage: `url(${getHighResImage(book.coverImageUrl)})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-back-base/80 via-back-base/60 to-back-base" />

                        <div className="relative z-10">
                            {/* Navbar */}
                            <div className="max-w-[1400px] mx-auto px-20 py-10">
                                <Navbar />
                            </div>

                            {/* Hero Content */}
                            <div className="max-w-[1400px] mx-auto px-20 pb-16 pt-8">
                                <h1 className="text-5xl font-bold text-white mb-3">{book.title}</h1>
                                <p className="text-2xl text-secondary mb-8">by {book.author}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Two Column Layout */}
                    <div className="w-full max-w-[1400px] mx-auto px-20 pb-16">
                        <div className="flex gap-8">
                            {/* Left Sidebar - Sticky */}
                            <div className="w-80 flex-shrink-0">
                                <div className="sticky top-8 flex flex-col gap-6">
                                    {/* Book Cover */}
                                    <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={getHighResImage(book.coverImageUrl)}
                                            alt="Book cover"
                                        />
                                    </div>

                                    {/* Stats Card */}
                                    <div className="bg-back-raised border border-stroke-weak/50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">
                                                    {avgRating || '—'}
                                                </div>
                                                <div className="text-xs text-secondary-weak">Avg Rating</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">
                                                    {reviews?.length || 0}
                                                </div>
                                                <div className="text-xs text-secondary-weak">Reviews</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">{book.pages}</div>
                                                <div className="text-xs text-secondary-weak">Pages</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">
                                                    {book.publishDate
                                                        ? new Date(book.publishDate).getUTCFullYear()
                                                        : '—'}
                                                </div>
                                                <div className="text-xs text-secondary-weak">Published</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress (if reading) */}
                                    {userBook && (
                                        <div className="bg-back-raised border border-stroke-weak/50 rounded-lg p-4">
                                            <div className="flex justify-between text-sm text-secondary-weak mb-2">
                                                <span>Your Progress</span>
                                                <span className="font-semibold text-primary">
                                                    {Math.round((userBook.progress / userBook.pages) * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-back-overlay rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-gradient-to-r from-[#4C7BD9] to-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${(userBook.progress / userBook.pages) * 100}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-secondary-weak text-center">
                                                {userBook.progress} of {userBook.pages} pages
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2">
                                        {userBook ? (
                                            <>
                                                <UpdateProgressButton
                                                    CoverImageURL={userBook.coverImageUrl}
                                                    isbn={book.isbn}
                                                    pages={book.pages}
                                                    onProgressUpdate={() => setRefreshTrigger(prev => prev + 1)}
                                                />
                                                <MarkAsFinishedButton
                                                    CoverImageURL={userBook.coverImageUrl}
                                                    isbn={book.isbn}
                                                    shelves={shelves}
                                                    triggerRefresh={TriggerRefresh}
                                                    isCurrentlyReading={true}
                                                    reviews={reviews || []}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <ShelfDropdownButton shelves={shelves} onSelect={addToShelf} shelfIDsContainingBook={shelfIDsContainingBook}/>
                                                <MarkAsFinishedButton
                                                    CoverImageURL={book.coverImageUrl}
                                                    isbn={book.isbn}
                                                    shelves={shelves}
                                                    triggerRefresh={TriggerRefresh}
                                                    isCurrentlyReading={false}
                                                    reviews={reviews || []}
                                                />
                                            </>
                                        )}
                                        <button
                                            onClick={toggleFavourite}
                                            className={`w-full py-2 px-4 rounded transition font-medium ${
                                                isFavourite
                                                    ? 'bg-amber-500 text-secondary-dark hover:bg-amber-600'
                                                    : 'bg-back-overlay border border-stroke-weak text-secondary hover:border-primary'
                                            }`}
                                        >
                                            {isFavourite ? '★ Remove from Favourites' : '☆ Add to Favourites'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content Area */}
                            <div className="flex-1 flex flex-col gap-8">
                                {/* Description Section */}
                                <div className="bg-back-raised border border-stroke-weak/50 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                                    <p className="text-secondary leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>

                                {/* Progress Updates & Reviews */}
                                <div className="bg-back-raised border border-stroke-weak/50 rounded-lg overflow-hidden">
                                    {/* Tab Headers */}
                                    <div className="flex border-b border-stroke-weak/30">
                                        <button
                                            onClick={() => hasProgressUpdates && setActiveTab('reviews')}
                                            disabled={!hasProgressUpdates}
                                            className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                                                activeTab === 'reviews'
                                                    ? 'bg-back-overlay text-primary border-b-2 border-primary'
                                                    : 'text-secondary-weak hover:text-secondary'
                                            } ${!hasProgressUpdates ? 'cursor-default' : 'cursor-pointer'}`}
                                        >
                                            Reviews ({reviews?.length || 0})
                                        </button>
                                        {hasProgressUpdates && (
                                            <button
                                                onClick={() => setActiveTab('updates')}
                                                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                                                    activeTab === 'updates'
                                                        ? 'bg-back-overlay text-primary border-b-2 border-primary'
                                                        : 'text-secondary-weak hover:text-secondary'
                                                }`}
                                            >
                                                Progress Updates ({progressUpdates.length})
                                            </button>
                                        )}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="p-6">
                                        {activeTab === 'reviews' && (
                                            <div>
                                                {reviews && reviews.length > 0 ? (
                                                    <div className="flex flex-col gap-4">
                                                        {reviews.map((review, index) => (
                                                            <ReviewCard key={index} review={review} inBook={true} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center py-12">
                                                        <p className="text-secondary-weak">No reviews yet. Be the first to review!</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'updates' && (
                                            <div className="flex flex-col gap-4">
                                                {progressUpdates.map((update, index) => (
                                                    <div key={index} className="bg-back-overlay border border-stroke-weak/30 rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                                    <span className="text-primary font-bold">
                                                                        {((update.progress / book.pages) * 100).toFixed(0)}%
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-white font-medium">
                                                                        Page {update.progress} of {book.pages}
                                                                    </h4>
                                                                    <span className="text-xs text-secondary-weak">
                                                                        {new Date(update.created_at).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {update.comment && (
                                                            <p className="text-secondary mt-3 pl-15">
                                                                &ldquo;{update.comment}&rdquo;
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ToastContainer theme="colored" />
                </>
            ) : (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-xl text-secondary-weak">Loading...</p>
                </div>
            )}
        </div>
    );
}