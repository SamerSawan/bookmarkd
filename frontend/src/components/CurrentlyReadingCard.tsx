import React, { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import Button from "./util/Button";
import { auth } from "../../firebase";
import axiosInstance from "@/utils/axiosInstance";


const CurrentlyReadingCard: React.FC = () => {
  
  const { currentlyReading, fetchCurrentlyReading, shelves, loading } = useUser();
  
  
  const [newProgress, setNewProgress] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false); 

  
  const book =
    currentlyReading && currentlyReading.length > 0
      ? currentlyReading[currentIndex]
      : null;

  
  const readShelf = shelves.find((shelf) => shelf.name === "Read");

  
  useEffect(() => {
    if (book) {
      const progress = Number(book.Progress) || 0;
      setNewProgress(progress);
      setIsFinished(progress >= Number(book.Pages)); 
    }
  }, [currentIndex, book]);

  
  if (loading) {
    return (
      <div className="flex flex-col bg-back-raised rounded-lg shadow-lg p-4 text-center">
        <h4 className="text-xl font-semibold text-secondary-strong">Loading...</h4>
      </div>
    );
  }

  if (!currentlyReading || currentlyReading.length === 0 || !book) {
    return (
      <div className="flex flex-col bg-back-raised rounded-lg shadow-lg p-4 text-center">
        <h4 className="text-xl font-semibold text-secondary-strong">
          No books are currently being read!
        </h4>
        <p className="text-md text-secondary-weak mt-2">
          Add a book to your "Currently Reading" shelf to see it here.
        </p>
      </div>
    );
  }

  
  const progress = Math.min(book.Progress || 0, Number(book.Pages)); 
  const pages = Number(book.Pages) || 0;
  const progressPercentage = Math.min(100, Math.round((progress / pages) * 100)); 

  
  const moveToReadShelf = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    if (!readShelf) {
      return;
    }

    try {
      const idToken = await user.getIdToken();

      
      await axiosInstance.post(
        `/shelves/${readShelf.id}`, 
        { isbn: book.Isbn },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      
      await fetchCurrentlyReading();
      
    } catch (err) {
      console.error("Failed to move book:", err);
      
    }
  };

  
  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const bookISBN = book.Isbn;

      
      await axiosInstance.put(
        `/users/${user.uid}/books/${bookISBN}/progress`,
        { progress: newProgress },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      
      if (newProgress >= pages) {
        setIsFinished(true);
        await moveToReadShelf(); 
      }

      
      await fetchCurrentlyReading();
      
      setIsEditing(false); 
    } catch (err) {
      console.error("Failed to update progress:", err);
      
    }
  };

  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentlyReading.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + currentlyReading.length) % currentlyReading.length
    );
  };

  
  const getHighResImage = (url: string) => {
    if (!url) return "https://via.placeholder.com/100x150";

    return url.replace(/^http:/, "https:").replace(/zoom=\d+/, "zoom=3");
  };

  const bookCover = getHighResImage(book.CoverImageUrl);

  return (
    <div className="flex flex-col bg-back-raised rounded-lg shadow-lg overflow-hidden max-w-full">
      {/* Top Section: Book Cover */}
      <div className="relative h-60 w-full">
        <img
          src={bookCover}
          alt={book.Title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom Section: Book Info */}
      <div className="flex flex-col items-center p-4">
        <h4 className="text-xl font-semibold text-secondary-strong text-center">
          {book.Title}
        </h4>
        <p className="text-md text-secondary-weak text-center">
          By {book.Author}
        </p>

        {isFinished ? (
          <div className="text-green-500 text-xl font-bold mt-4">
            ✅ Congrats on finishing your book!
          </div>
        ) : (
          <>
            <div className="w-full bg-stroke-weak rounded-full h-4 mb-4 mt-6">
              <div
                className="bg-gradient-to-r from-[#4C7BD9] to-primary h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-secondary-weak">
              <span>Progress: {progressPercentage}%</span>
            </div>

            {isEditing ? (
              <div className="mt-4 flex gap-2 items-center">
                <input
                  placeholder={String(newProgress)}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="bg-[#475569] text-white p-2 rounded w-20"
                  max={pages}
                />
                <button
                  onClick={handleUpdate}
                  className="bg-[#64748b] text-white py-2 px-4 rounded hover:bg-[#475569] transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <Button onPress={() => setIsEditing(true)} Text="Update Progress" />
              </div>
            )}
          </>
        )}

        {/* Navigation Arrows */}
        <div className="flex justify-between w-full mt-4">
          <button onClick={handlePrev} className="text-primary hover:underline">◀</button>
          <button onClick={handleNext} className="text-primary hover:underline">▶</button>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReadingCard;
