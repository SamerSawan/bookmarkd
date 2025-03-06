import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import Image from 'next/image';
import Button from './Button';
import RedButton from './RedButton';

interface ModalProps {
    CoverImageURL: string
}


const UpdateProgressButton: React.FC<ModalProps> = ({CoverImageURL}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex items-center justify-center">
            <button
            onClick={() => {setIsOpen(true)}}
            className="bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:bg-primary hover:opacity-80 transition"
            >
                Update Progress
            </button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/80" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-4xl space-y-4 rounded-lg bg-back-overlay p-12 w-1/3">
                    <DialogTitle className="font-bold text-xl">Update Your Reading Progress</DialogTitle>
                    <div className="flex flex-row gap-4">
                        <div className="h-72 w-72 relative">
                            <Image src={CoverImageURL} alt={"Book Cover"} layout="fill" objectFit="cover" quality={100} className="rounded-lg" />
                        </div>
                        <div className="flex flex-col w-full">
                            <div>
                                <span className="text-secondary-weak mr-2">Page #</span>
                                <input className="outline-none appearance-none rounded-md bg-fill mb-2 w-20 focus:ring-2 focus:ring-primary text-secondary-strong" name="progress" inputMode="numeric" pattern="[0-9]*"/>
                            </div>
                            <textarea
                            className="w-full text-start px-4 py-2 mb-4 text-secondary-weak bg-fill rounded-md outline-none w-full h-64 focus:ring-2 focus:ring-primary transition-all"
                            placeholder="Leave a note"
                            />
                            <div className="flex gap-4 justify-end">
                                <RedButton Text="Cancel" onPress={() => {console.log("Not implemented yet")}}/>
                                <Button Text="Update" onPress={() => {console.log("Not implemented yet")}}/>
                            </div>
                        </div>
                    </div>
                    
                </DialogPanel>
            </div>
            </Dialog>
        </div>
    );
};

export default UpdateProgressButton;
