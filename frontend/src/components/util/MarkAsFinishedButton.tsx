import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react';
import Image from 'next/image';
import Button from './Button';
import RedButton from './RedButton';
import StarRating from './Rating';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { auth } from '../../../firebase';
import { Shelf } from '@/utils/models';
import { getShelfIdByName } from '@/utils/helpers';
import reviewService from '@/services/reviewService';
import { Review } from '@/types/review';
import { useUser } from '@/app/context/UserContext';

interface ModalProps {
    CoverImageURL: string
    isbn: string
    shelves: Shelf[];
    triggerRefresh: () => void;
    isCurrentlyReading: boolean;
    reviews: Review[];
}


const MarkAsFinishedButton: React.FC<ModalProps> = ({ CoverImageURL, isbn, shelves, triggerRefresh, isCurrentlyReading, reviews }) => {
    const { user } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const [review, setReview] = useState<string>("");
    const [recommended, setRecommended] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [existingReview, setExistingReview] = useState<Review | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Check if user has an existing review
    useEffect(() => {
        if (user && reviews) {
            const userReview = reviews.find(r => r.userId === user.id);
            if (userReview) {
                setExistingReview(userReview);
                setIsUpdating(true);
            } else {
                setExistingReview(null);
                setIsUpdating(false);
            }
        }
    }, [user, reviews]);

    useEffect(() => {
        if (isOpen && existingReview) {
            setReview(existingReview.content || "");
            setRating(existingReview.stars);
            setRecommended(existingReview.recommended ? "Yes" : "No");
        } else if (!isOpen) {
            
            if (!existingReview) {
                setReview("");
                setRecommended("");
                setRating(0);
            }
        }
    }, [isOpen, existingReview]);

    const onRatingChange = (value: number) => {
        setRating(value)
    }

    const handleReview = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          return;
        }

        try {
          const idToken = await currentUser.getIdToken();
          let isRecommended = false;

          if (recommended == "Yes") {
              isRecommended = true;
          } else if (recommended == "No") {
              isRecommended = false;
          }

          if (isUpdating && existingReview) {
            // Update existing review
            await reviewService.updateReview(isbn, review, rating, isRecommended);
            toast.success("Review updated!");
          } else {
            // Create new review and move to read shelf
            const readShelf = getShelfIdByName(shelves, "Read");
            await axiosInstance.post(`/shelves/${readShelf}`, {
                isbn: isbn,
            },
            {
                headers: {
                Authorization: `Bearer ${idToken}`,
                },
            });
            toast.success("Moved book to read shelf");

            await reviewService.createReview(isbn, review || null, rating, isRecommended);
            toast.success("Review logged!");
          }

          triggerRefresh();
          setIsOpen(false);
        } catch (err) {
          console.error("Failed to save review:", err);
          toast.error("Failed to save review.");
        }
      };

      const handleDeleteReview = async () => {
        try {
          await reviewService.deleteReview(isbn);
          toast.success("Review deleted!");
          triggerRefresh();
          setIsOpen(false);
        } catch (err) {
          console.error("Failed to delete review:", err);
          toast.error("Failed to delete review.");
        }
      };

    return (
        <div className="flex items-center justify-center w-full">
            <button
            onClick={() => {setIsOpen(true)}}
            className="bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:bg-primary hover:opacity-80 transition w-full"
            >
                {isUpdating ? (
                    <span>Update Review</span>
                ) : isCurrentlyReading ? (
                    <span>Mark as Finished</span>
                ) : (
                    <span>Review Book</span>
                )}
            </button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-3xl w-full rounded-xl bg-back-raised border border-stroke-weak/50 shadow-2xl">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-stroke-weak/30">
                        <DialogTitle className="text-2xl font-semibold text-secondary-strong">
                            {isUpdating ? "Update Review" : isCurrentlyReading ? "Mark as Finished" : "Review Book"}
                        </DialogTitle>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                        {/* Book Cover */}
                        <div className="flex-shrink-0">
                            <div className="w-40 h-60 relative rounded-md overflow-hidden shadow-lg">
                                <Image src={CoverImageURL} alt={"Book Cover"} layout="fill" objectFit="cover" quality={100} />
                            </div>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col flex-1 gap-4">
                            {/* Recommendation */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-strong">
                                    Do you recommend this book?
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setRecommended(recommended === "Yes" ? "" : "Yes")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                                            recommended === "Yes"
                                                ? "bg-green-600 text-white shadow-lg"
                                                : "bg-back-overlay border border-stroke-weak text-secondary hover:border-primary"
                                        }`}
                                    >
                                        <IconThumbUp stroke={2} size={20}/>
                                        <span className="font-medium">Yes</span>
                                    </button>
                                    <button
                                        onClick={() => setRecommended(recommended === "No" ? "" : "No")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                                            recommended === "No"
                                                ? "bg-red-600 text-white shadow-lg"
                                                : "bg-back-overlay border border-stroke-weak text-secondary hover:border-primary"
                                        }`}
                                    >
                                        <IconThumbDown stroke={2} size={20}/>
                                        <span className="font-medium">No</span>
                                    </button>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-strong">
                                    Rating
                                </label>
                                <StarRating onRatingChange={onRatingChange} initialRating={rating}/>
                            </div>

                            {/* Review Text */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-strong">
                                    Your Review (optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-back-overlay border border-stroke-weak/50 rounded-lg
                                               text-secondary-strong placeholder-secondary-weak
                                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                               transition-all resize-none"
                                    placeholder="Share your thoughts about this book..."
                                    rows={6}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-back-overlay/50 border-t border-stroke-weak/30 flex gap-3 justify-between rounded-b-xl">
                        <div>
                            {isUpdating && (
                                <button
                                    onClick={handleDeleteReview}
                                    className="px-4 py-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                                >
                                    Delete Review
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-secondary hover:text-secondary-strong hover:bg-back-raised rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReview}
                                className="px-6 py-2 bg-primary text-secondary-dark font-semibold rounded-lg
                                         hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                                         active:scale-95 transition-all duration-200"
                            >
                                {isUpdating ? "Update Review" : "Submit Review"}
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
            </Dialog>
        </div>
    );
};

export default MarkAsFinishedButton;
