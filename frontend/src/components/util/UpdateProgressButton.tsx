import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import Image from 'next/image';
import axiosInstance from '@/utils/axiosInstance';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';
import { useUser } from '@/app/context/UserContext';

interface ModalProps {
    CoverImageURL: string
    isbn: string;
    onProgressUpdate: () => void;
    pages: number;
}


const UpdateProgressButton: React.FC<ModalProps> = ({CoverImageURL, isbn, onProgressUpdate, pages}) => {
    const { fetchCurrentlyReading } = useUser();

    const [isOpen, setIsOpen] = useState(false)
    const [newProgress, setNewProgress] = useState<number>(0);
    const [comment, setComment] = useState<string>("")

    const handleUpdate = async () => {
        const user = auth.currentUser;
        if (!user) {
          return;
        }
    
        try {
          const idToken = await user.getIdToken();
          const bookISBN = isbn;
    
          await axiosInstance.put(
            `/users/${user.uid}/books/${bookISBN}/progress`,
            { progress: newProgress,
              comment: comment 
            },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          setIsOpen(false);
          await fetchCurrentlyReading();
          onProgressUpdate();
        } catch (err) {
          console.error("Failed to update progress:", err);
          toast.error("Failed to update progress.");
        }
      };

    return (
        <div className="flex items-center justify-center w-full">
            <button
            onClick={() => {setIsOpen(true)}}
            className="bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:bg-primary hover:opacity-80 transition w-full"
            >
                Update Progress
            </button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-2xl w-full rounded-xl bg-back-raised border border-stroke-weak/50 shadow-2xl">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-stroke-weak/30">
                        <DialogTitle className="text-2xl font-semibold text-secondary-strong">
                            Update Reading Progress
                        </DialogTitle>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                        {/* Book Cover */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-48 relative rounded-md overflow-hidden shadow-lg">
                                <Image
                                    src={CoverImageURL}
                                    alt="Book Cover"
                                    layout="fill"
                                    objectFit="cover"
                                    quality={100}
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col flex-1 gap-4">
                            {/* Progress Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-strong">
                                    Current Page
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        className="w-24 px-3 py-2 bg-back-overlay border border-stroke-weak/50 rounded-lg
                                                   text-secondary-strong text-center
                                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                                   transition-all"
                                        type="number"
                                        max={pages}
                                        min={0}
                                        placeholder="0"
                                        onChange={(e) => setNewProgress(Number(e.target.value))}
                                        name="progress"
                                        inputMode="numeric"
                                    />
                                    <span className="text-secondary-weak">of {pages}</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-back-overlay rounded-full h-2 overflow-hidden border border-stroke-weak/30">
                                <div
                                    className="bg-gradient-to-r from-[#4C7BD9] to-primary h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, (newProgress / pages) * 100)}%` }}
                                />
                            </div>

                            {/* Comment */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-strong">
                                    Add a note (optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-back-overlay border border-stroke-weak/50 rounded-lg
                                               text-secondary-strong placeholder-secondary-weak
                                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                               transition-all resize-none"
                                    placeholder="How are you enjoying the book so far?"
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-back-overlay/50 border-t border-stroke-weak/30 flex gap-3 justify-end rounded-b-xl">
                        <button
                            onClick={() => {
                                setComment("");
                                setNewProgress(0);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-secondary hover:text-secondary-strong
                                     hover:bg-back-raised rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-6 py-2 bg-primary text-secondary-dark font-semibold rounded-lg
                                     hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                                     active:scale-95 transition-all duration-200"
                        >
                            Update Progress
                        </button>
                    </div>
                </DialogPanel>
            </div>
            </Dialog>
        </div>
    );
};

export default UpdateProgressButton;
