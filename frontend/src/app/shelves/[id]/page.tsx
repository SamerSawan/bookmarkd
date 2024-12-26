"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Import useParams
import { useUser } from "@/app/context/UserContext";

export default function ShelfPage() {
  const { shelves } = useUser(); // Access shelves from context
  const params = useParams(); // Get params directly using useParams()
  const shelfId = params.id as string; // Extract the shelf ID

  // Find the shelf by ID
  const shelf = shelves.find((shelf) => shelf.id === shelfId);

  // Handle invalid shelf ID
  if (!shelf) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Shelf not found.</p>
      </div>
    );
  }

  // Empty shelf placeholder
  const EmptyShelfPlaceholder = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-back-overlay rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-primary">{shelf.name} is Empty</h3>
      <p className="text-secondary mt-4">Start building your collection by adding books to this shelf.</p>
      <Link href="/search" className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:opacity-80">
        Search for Books
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen items-center bg-back-base text-secondary-weak px-20 py-10">
      {/* Navbar */}
      <div className="flex justify-between w-[80%]">
        <div>
          <Link href="/" className="font-bold text-3xl text-primary hover:underline">
            BOOKMARKD
          </Link>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
          <Link href="/shelves" className="hover:underline">Shelves</Link>
          <p>Activity</p>
          <Link href="/search" className="hover:underline">Search</Link>
        </div>
      </div>

      {/* Shelf Header */}
      <div className="w-full max-w-4xl mt-16">
        <h1 className="text-3xl font-bold text-primary">{shelf.name}</h1>
        <p className="text-secondary mt-2">{shelf.bookCount} books</p>
      </div>

      {/* Books Section */}
      <div className="w-full max-w-4xl mt-8">
        {shelf.books.length === 0 ? (
          <EmptyShelfPlaceholder />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {shelf.books.map((book) => (
              <div key={book.isbn} className="flex flex-col items-center">
                {/* Book Cover */}
                <img
                  src={book.coverImageUrl || "https://via.placeholder.com/100x150"}
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-lg"
                />
                {/* Book Title */}
                <h3 className="text-sm font-bold mt-2 text-primary text-center">{book.title}</h3>
                {/* Book Author */}
                <p className="text-xs text-secondary">{book.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
