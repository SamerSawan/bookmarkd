"use client";

import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { IconBookmark, IconBookmarkFilled, IconPlus } from '@tabler/icons-react';

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

  if (!toReadShelf || !toReadShelf.books || toReadShelf.books.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <IconBookmark className="text-warning" size={28} stroke={2} />
            <h2 className="text-2xl font-semibold text-secondary-strong">To Be Read</h2>
          </div>
        </div>

        <div className="bg-back-raised border border-stroke-weak/50 rounded-xl p-12 text-center">
          <IconBookmark className="text-secondary-weak mx-auto mb-4" size={48} stroke={1.5} />
          <h3 className="text-lg font-semibold text-secondary-strong mb-2">No Books in To Be Read Yet</h3>
          <p className="text-secondary-weak mb-6">Start adding books you want to read</p>
          <button
            onClick={() => router.push('/search')}
            className="bg-primary text-secondary-dark font-semibold py-3 px-6 rounded-lg
                       hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                       active:scale-95 transition-all duration-200"
          >
            Find Books to Read
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="mb-12">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <IconBookmarkFilled className="text-warning" size={28} stroke={2} />
          <h2 className="text-2xl font-semibold text-secondary-strong">To Be Read</h2>
        </div>
        <button
          className="text-primary hover:text-primary-light font-medium text-sm hover:underline transition-colors flex items-center gap-2"
          onClick={() => router.push(`/shelves/${toReadShelf.id}`)}
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
        {toReadShelf.books.slice(0, 4).map((book) => (
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/100x150";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-back-base via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-secondary-strong font-semibold text-xs line-clamp-2">{book.title}</p>
              <p className="text-secondary text-xs mt-0.5">{book.author}</p>
            </div>
            <div className="absolute top-2 right-2 bg-warning/90 backdrop-blur-sm rounded-full p-1">
              <IconBookmarkFilled className="text-secondary-dark" size={14} />
            </div>
          </div>
        ))}

        {/* Add more books placeholder (if less than 4) */}
        {toReadShelf.books.length < 4 && (
          <div
            className="relative group bg-back-overlay border-2 border-dashed border-stroke-weak/50 rounded-lg
                       hover:border-primary/50 transition-all hover:cursor-pointer aspect-[2/3]
                       flex flex-col items-center justify-center gap-2"
            onClick={() => router.push('/search')}
          >
            <div className="bg-primary/20 p-3 rounded-full group-hover:scale-110 transition-transform">
              <IconPlus className="text-primary" size={24} stroke={2} />
            </div>
            <p className="text-secondary text-xs font-medium">Add Book</p>
            <p className="text-secondary-weak text-xs">{4 - toReadShelf.books.length} slot{4 - toReadShelf.books.length !== 1 ? 's' : ''} left</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TBRList;
