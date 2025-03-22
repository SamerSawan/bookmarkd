import React, { useState } from 'react';
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

interface ModalProps {
    CoverImageURL: string
    isbn: string
    shelves: Shelf[];
    triggerRefresh: () => void;
}


const MarkAsFinishedButton: React.FC<ModalProps> = ({CoverImageURL, isbn, shelves, triggerRefresh }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [review, setReview] = useState<string>("");
    const [recommended, setRecommended] = useState<string>("");
    const [rating, setRating] = useState<number>(0);

    const onRatingChange = (value: number) => {
        setRating(value)
    }

    const handleReview = async () => {
        const user = auth.currentUser;
        if (!user) {
          return;
        }
    
        try {
          const idToken = await user.getIdToken();
          let nullChecker = true
          let isRecommended = null

          if (recommended == "Yes") {
              nullChecker = false
              isRecommended = true
          } else if (recommended == "No") {
              nullChecker = false
              isRecommended = false
          }

          console.log("Sending review data:", {
            isbn,
            review,
            stars: rating,
            recommended: !nullChecker ? isRecommended : null
        });
        const readShelf = getShelfIdByName(shelves, "Read");
        await axiosInstance.post(`/shelves/${readShelf}`, {
            isbn: isbn,
        },
        {
            headers: {
            Authorization: `Bearer ${idToken}`,
            },
        });
        toast.success("Moved book to read shelf")

    
        await axiosInstance.post(
            `/reviews`,
            { 
                isbn: isbn,
                review: review ? review : null,
                stars: rating,
                recommended: !nullChecker ? isRecommended : null
            },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          toast.success("Review logged!");
          triggerRefresh();
          setIsOpen(false);
        } catch (err) {
          console.error("Failed to update progress:", err);
          toast.error("Failed to update progress.");
        }
      };

    return (
        <div className="flex items-center justify-center">
            <button
            onClick={() => {setIsOpen(true)}}
            className="bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:bg-primary hover:opacity-80 transition"
            >
                Mark as Finished
            </button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/80" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-4xl space-y-4 rounded-lg bg-back-overlay p-12 w-1/3">
                    <DialogTitle className="font-bold text-xl">Mark as Finished</DialogTitle>
                    <div className="flex flex-row gap-4">
                        <div className="h-72 w-72 relative">
                            <Image src={CoverImageURL} alt={"Book Cover"} layout="fill" objectFit="cover" quality={100} className="rounded-lg" />
                        </div>
                        <div className="flex flex-col w-full">
                            <div>
                                <span>Do you recommend this book?</span>
                                <div className="flex flex-row gap-2 justify-center mt-2">
                                    <button className={`flex flex-row bg-primary text-secondary-dark rounded-lg p-2 hover:opacity-100 ${(recommended != "") ? (recommended == "Yes" ? "opacity-100" : "opacity-80") : ("opacity-80") }`}
                                    onClick={() => {
                                        if (recommended == "Yes") {
                                            setRecommended("")
                                        } else {
                                            setRecommended("Yes")
                                        }
                                    }}
                                    >
                                        <IconThumbUp stroke={2}/>
                                        Yes
                                    </button>
                                    <button className={`flex flex-row bg-primary text-secondary-dark rounded-lg p-2 hover:opacity-100 ${(recommended != "") ? (recommended == "No" ? "opacity-100" : "opacity-80") : ("opacity-80") }`}
                                    onClick={() => {
                                        if (recommended == "No") {
                                            setRecommended("")
                                        } else {
                                            setRecommended("No")
                                        }
                                    }}>
                                        <IconThumbDown stroke={2}/>
                                        No
                                    </button>
                                </div>
                            </div>
                            <div className="my-2">
                                <span className="">Rating</span>
                                <StarRating onRatingChange={onRatingChange}/>
                            </div>
                            <textarea
                            className="w-full text-start px-4 py-2 mb-4 text-secondary-weak bg-fill rounded-md outline-none w-full h-64 focus:ring-2 focus:ring-primary transition-all"
                            placeholder="Leave a review (optional)"
                            onChange={(e) => setReview(e.target.value)}
                            />
                            <div className="flex gap-4 justify-end">
                                <RedButton Text="Cancel" onPress={() => {
                                    setReview("")
                                    setIsOpen(false)
                                    }}/>
                                <Button Text="Done" onPress={handleReview}/>
                            </div>
                        </div>
                    </div>
                    
                </DialogPanel>
            </div>
            </Dialog>
        </div>
    );
};

export default MarkAsFinishedButton;
