import { useUser } from "@/app/context/UserContext";
import { useState } from "react";
import TooManyFavourites from "./TooManyFavourites";
import { useRouter } from 'next/navigation'
import { IconStar, IconStarFilled, IconPlus } from '@tabler/icons-react';

const FavouriteBooks = () => {
    const [ showModal, setShowModal ] = useState(false)
    const { favourites } = useUser();
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
        <div className="mb-12">
          <div className="flex flex-row justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <IconStarFilled className="text-yellow-400" size={28} stroke={2} />
              <h2 className="text-2xl font-semibold text-secondary-strong">Favourite Books</h2>
            </div>
            <button
              className="text-primary hover:text-primary-light font-medium text-sm hover:underline transition-colors flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              Edit Favorites
            </button>
          </div>

          {favourites && favourites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              {favourites.map((book) => (
                <div
                  key={book.isbn}
                  className="relative group bg-back-raised border border-stroke-weak/50 rounded-lg overflow-hidden
                             shadow-card hover:shadow-card-hover transition-all hover:cursor-pointer"
                  onClick={() => handleClickOnBook(book.isbn)}
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={getHighResImage(book.coverImageUrl)}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-back-base via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-secondary-strong font-semibold text-xs line-clamp-2">{book.title}</p>
                    <p className="text-secondary text-xs mt-0.5">{book.author}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-400/90 backdrop-blur-sm rounded-full p-1">
                    <IconStarFilled className="text-secondary-dark" size={14} />
                  </div>
                </div>
              ))}

              {/* Add more favorites placeholder (if less than 4) */}
              {favourites.length < 4 && (
                <div
                  className="relative group bg-back-overlay border-2 border-dashed border-stroke-weak/50 rounded-lg
                             hover:border-primary/50 transition-all hover:cursor-pointer aspect-[2/3]
                             flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push('/search')}
                >
                  <div className="bg-primary/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <IconPlus className="text-primary" size={24} stroke={2} />
                  </div>
                  <p className="text-secondary text-xs font-medium">Add Favorite</p>
                  <p className="text-secondary-weak text-xs">{4 - favourites.length} slot{4 - favourites.length !== 1 ? 's' : ''} left</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-back-raised border border-stroke-weak/50 rounded-xl p-12 text-center">
              <IconStar className="text-secondary-weak mx-auto mb-4" size={48} stroke={1.5} />
              <h3 className="text-lg font-semibold text-secondary-strong mb-2">No Favorite Books Yet</h3>
              <p className="text-secondary-weak mb-6">Add up to 4 books to showcase your favorites</p>
              <button
                onClick={() => router.push('/search')}
                className="bg-primary text-secondary-dark font-semibold py-3 px-6 rounded-lg
                           hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                           active:scale-95 transition-all duration-200"
              >
                Find Books to Love
              </button>
            </div>
          )}

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

  export default FavouriteBooks;
  