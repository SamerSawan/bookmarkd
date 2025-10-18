import { useState } from "react";
import TooManyFavourites from "./TooManyFavourites";
import { useRouter } from 'next/navigation'
import { FavBook } from "@/utils/models";

interface Props {
    username: string;
    favourites: FavBook[];
}

const ProfileFavouriteBooks: React.FC<Props> = ({favourites}) => {
    const [ showModal, setShowModal ] = useState(false)
    const getHighResImage = (url: string) => {
      if (!url) return "https://via.placeholder.com/100x150";
  
      return url
        .replace(/^http:/, "https:")
        .replace(/zoom=\d+/, "zoom=3");
    };
    const router = useRouter()
    const handleClickOnBook = async (isbn: string) => {
      router.push(`/book/${isbn}`)
  }

    return (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favourites?.map((book) => (
              <div
                key={book.ID}
                className="relative group cursor-pointer"
                onClick={() => handleClickOnBook(book.Isbn)}
              >
                <img
                  src={getHighResImage(book.CoverImageUrl)}
                  alt={book.Title}
                  className="rounded-md object-cover w-full aspect-[2/3] shadow-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 rounded-md group-hover:opacity-100 flex items-center justify-center transition-opacity p-4">
                  <p className="text-white text-sm font-semibold text-center line-clamp-3">{book.Title}</p>
                </div>
              </div>
            ))}
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-secondary-strong z-50">
              <div className="bg-back-overlay p-6 rounded-lg shadow-lg">
                <TooManyFavourites onClose={() => setShowModal(false)}/>
              </div>
            </div>
          )}
        </div>
    );
  };
  
  export default ProfileFavouriteBooks;
  