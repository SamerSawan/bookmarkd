import { useState } from "react";
import TooManyFavourites from "./TooManyFavourites";
import { useRouter } from 'next/navigation'
import { FavBook } from "@/utils/models";

interface Props {
    username: string;
    favourites: FavBook[];
}

const ProfileFavouriteBooks: React.FC<Props> = ({favourites, username}) => {
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

        <div className="mb-12">
          <div className="flex flex-row justify-between">
          <h2 className="text-secondary-strong text-2xl font-semibold mb-4">{username}&apos;s favourite books</h2>
          {/*<button className="text-primary text-xl font-bold mb-4 hover:underline" onClick={() => setShowModal(true)}>Edit</button>*/}
          </div>
          
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-4 gap-4 2xl:w-[80%] mx-auto">
              {favourites?.map((book) => (
                <div
                  key={book.ID}
                  className="relative group bg-back-raised p-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:cursor-pointer"
                  onClick={() => handleClickOnBook(book.Isbn)}
                >
                  <img
                    src={getHighResImage(book.CoverImageUrl)}
                    alt={book.Title}
                    className="rounded-md object-cover w-48 h-72"
                  />
                  <div className="absolute inset-0 bg-back-overlay bg-opacity-50 opacity-0 rounded-md group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white text-sm font-bold">{book.Title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-secondary-strong">
            <div className="bg-back-overlay p-6 rounded-lg shadow-lg">
              <TooManyFavourites onClose={() => setShowModal(false)}/>
            </div>
          </div>
        )}
        </div>
    );
  };
  
  export default ProfileFavouriteBooks;
  