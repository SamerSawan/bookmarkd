import React from 'react';
import { useUser } from "@/app/context/UserContext";
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

interface TooManyFavouritesProps {
    onClose: () => void;
}

const TooManyFavourites: React.FC<TooManyFavouritesProps> = ({ onClose }) => {
    const { favourites, refreshShelves } = useUser();

    const handleRemoveFavourite = async (isbn: string) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("You need to be logged in to remove favourites.");
                return;
            }
            const idToken = await user.getIdToken();

            await axiosInstance.delete("/users/me/favourites", {
                data: { isbn },
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            refreshShelves();
            toast.success("Favourite removed successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove favourite.");
        }
    };

    const getHighResImage = (url: string) => {
        if (!url) return "https://via.placeholder.com/100x150";
    
        return url
          .replace(/^http:/, "https:")
          .replace(/zoom=\d+/, "zoom=3");
      };

    return (
        <div className="mt-2">
            <h2 className="text-primary text-center text-3xl font-bold mb-4">
                Edit Favourites
            </h2>
            <div className="flex justify-center items-center">
                <div className="grid grid-cols-4 gap-4 2xl:w-[80%] mx-auto">
                    {favourites?.map((book) => {
                        return (
                        <div
                            key={book.isbn}
                            className="relative group bg-back-raised p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            <img
                                src={getHighResImage(book.coverImageUrl)}
                                alt={book.title}
                                className="rounded-md object-cover w-48 h-72"
                            />
                            <div className="absolute inset-0 bg-back-overlay bg-opacity-50 opacity-0 rounded-md group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white text-sm font-bold">{book.title}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveFavourite(book.isbn)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                                X
                            </button>
                        </div>
                        )
                    }
                    )
                }
                </div>
            </div>
            <div className="flex justify-center items-center self-center gap-4 mt-4">
                <button className="px-4 py-2 bg-primary hover:opacity-[60%] text-secondary-dark w-32 rounded" onClick={onClose}>Done</button>
            </div>
        </div>
    );
};

export default TooManyFavourites;
