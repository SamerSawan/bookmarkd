"use client";

import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TBRList = () => {
  const { shelves } = useUser();
  const router = useRouter()

  const toReadShelf = shelves.find((shelf) => shelf.name === "To Be Read");
  
    const handleClickOnBook = async (isbn: string) => {
      router.push(`/book/${isbn}`)
  }
  
  const getHighResImage = (url: string) => {
    if (!url) return "https://via.placeholder.com/100x150";

    return url
      .replace(/^http:/, "https:")
      .replace(/zoom=\d+/, "zoom=3");
  };

  if (!toReadShelf || toReadShelf.books.length === 0) {
    return (
      <div className="mt-8 bg-back-raised rounded-lg p-4 flex flex-col items-center">
        <h2 className="text-xl font-bold text-secondary-strong mb-4">To Be Read</h2>
        <p className="text-secondary-weak mb-4">Your To Be Read shelf is empty.</p>
        <Link
          href="/search"
          className="px-4 py-2 bg-primary text-secondary-strong rounded-md hover:opacity-80"
        >
          Search for Books
        </Link>
      </div>
    );
  }
  

  return (
    <div className="mb-12">
          <h2 className="text-primary text-2xl font-bold mb-4">To Be Read</h2>
          <div className="flex justify-center items-center">
          <div className="grid grid-cols-4 gap-4 2xl:w-[80%] mx-auto">
            {toReadShelf.books.map((book) => (
              <div
                key={book.isbn}
                className="relative group bg-back-raised p-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:cursor-pointer"
                onClick={() => handleClickOnBook(book.isbn)}
              >
                <img
                  src={getHighResImage(book.coverImageUrl)}
                  alt={book.title}
                  className="rounded-md object-cover w-48 h-72"
                />
                <div className="absolute inset-0 bg-back-overlay bg-opacity-50 opacity-0 rounded-md group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-white text-sm font-bold">{book.title}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
  );
};

export default TBRList;
