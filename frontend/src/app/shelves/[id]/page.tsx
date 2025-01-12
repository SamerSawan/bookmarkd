"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase";
import axiosInstance from "@/utils/axiosInstance";
import TooManyFavourites from "@/components/TooManyFavourites";
import Footer from "@/components/Footer";

export default function ShelfPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { shelves, favourites, refreshShelves } = useUser();
  const params = useParams();
  const shelfId = params.id as string;

  const shelf = shelves.find((shelf) => shelf.id === shelfId);

  if (!shelf) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Shelf not found.</p>
      </div>
    );
  }

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const handleRemoveBook = async (isbn: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in to manage favorites.");
      return;
    }
    const idToken = await user.getIdToken();

    try {
      await axiosInstance.delete(`/shelves/${shelfId}/books`, { data: { isbn }, headers: {
        Authorization: `Bearer ${idToken}`,
      }, });
      toast.success("Book removed from shelf.");
      refreshShelves();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove book from shelf.");
    }
  };

  const handleFavourite = async (isbn: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in to manage favorites.");
      return;
    }
    const idToken = await user.getIdToken();

    const isFavourite = favourites?.some((fav) => fav.isbn === isbn);

    try {
      if (isFavourite) {
        // Remove from favourites
        await axiosInstance.delete("/users/me/favourites", {
          data: { isbn },
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        toast.success("Removed from favourites.");
      } else {
        // Add to favourites
        if (favourites && favourites.length >= 4) {
          setShowModal(true);
          return;
        }

        await axiosInstance.post(
          "/users/me/favourites",
          { isbn },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        toast.success("Added to favourites.");
      }

      refreshShelves();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favourites.");
    }
  };

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
    <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak px-20 py-10">
      {/* Navbar */}
      <div className="flex justify-between w-[80%]">
        <div>
          <Link href="/" className="font-bold text-3xl text-primary hover:underline">
            BOOKMARKD
          </Link>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
          <Link href="/shelves" className="hover:underline">Shelves</Link>
          <Link href="/activity" className="hover:underline">Activity</Link>
          <Link href="/search" className="hover:underline">Search</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center mt-10">
        {/* Shelf Header */}
        <div className="w-full max-w-4xl mt-16 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">{shelf.name}</h1>
            <p className="text-secondary mt-2">{shelf.bookCount} books</p>
          </div>
          {/* Edit Button */}
          <button 
            onClick={toggleEditMode} 
            className="px-4 py-2 bg-primary text-secondary-dark rounded-md hover:opacity-80"
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>

        {/* Books Section */}
        <div className="w-full max-w-4xl mt-8">
          {shelf.books.length === 0 ? (
            <EmptyShelfPlaceholder />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
              {shelf.books.map((book) => (
                <div key={book.isbn} className="relative flex flex-col items-center">
                  {/* Book Cover */}
                  <img
                    src={book.coverImageUrl || "https://via.placeholder.com/100x150"}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-lg"
                  />
                  {/* Conditional Icon */}
                  {isEditing ? (
                    <button
                      onClick={() => handleRemoveBook(book.isbn)}
                      className="absolute -top-2 right-2 text-red-500 hover:opacity-80"
                    >
                      <IconTrash size={24} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFavourite(book.isbn)}
                      className="absolute -top-2 right-2 text-yellow-400"
                    >
                      {favourites?.some((fav) => fav.isbn === book.isbn) ? <IconStarFilled size={24} /> : <IconStar size={24} />}
                    </button>
                  )}
                  {/* Book Title */}
                  <h3 className="text-sm font-bold mt-2 text-primary text-center">{book.title}</h3>
                  {/* Book Author */}
                  <p className="text-xs text-secondary">{book.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-secondary-strong">
            <div className="bg-back-overlay p-6 rounded-lg shadow-lg">
              <TooManyFavourites onClose={() => setShowModal(false)} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
