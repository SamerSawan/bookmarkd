import React, { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import Button from "./util/Button";
import { auth } from "../../firebase";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MarkAsFinishedButton from "./util/MarkAsFinishedButton";


const CurrentlyReadingCard: React.FC = () => {
  const { currentlyReading, fetchCurrentlyReading, refreshShelves, shelves, loading } = useUser();

  const [newProgress, setNewProgress] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter()
  const book =
    currentlyReading && currentlyReading.length > 0
      ? currentlyReading[currentIndex]
      : null;

  useEffect(() => {
    if (book) {
      const progress = Number(book.Progress) || 0;
      setNewProgress(progress);
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
      <div className="flex flex-col bg-back-raised rounded-lg shadow-lg p-4 text-center h-full w-full items-center justify-center">
        <h4 className="text-xl font-semibold text-secondary-strong">
          No books are currently being read!
        </h4>
        <p className="text-md text-secondary-weak mt-2">
          Add a book to your &quot;Currently Reading&ldquo; shelf to see it here.
        </p>
      </div>
    );
  }

  const pages = Number(book.Pages) || 0;
  const progressPercentage = Math.min(100, Math.round((newProgress / pages) * 100));
  const isFinished = newProgress >= pages;

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

      await fetchCurrentlyReading();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update progress:", err);
      toast.error("Failed to update progress.");
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
      <div className="relative h-60 w-full hover:cursor-pointer" onClick={() => {router.push(`/book/${book.Isbn}`)}}>
        <img
          src={bookCover}
          alt={book.Title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col items-center p-4">
        <h4 className="text-xl font-semibold text-secondary-strong text-center hover:cursor-pointer hover:text-primary" onClick={() => {router.push(`/book/${book.Isbn}`)}}>
          {book.Title}
        </h4>
        <p className="text-md text-secondary-weak text-center">By {book.Author}</p>

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
          <div className="mt-4 flex flex-col gap-2 items-center">
            <div className="flex flex-row gap-2">
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
            {!isFinished && <MarkAsFinishedButton CoverImageURL={book.CoverImageUrl} isbn={book.Isbn} shelves={shelves} triggerRefresh={refreshShelves}/>}
          </div>
        ) : (
          <div className="mt-4">
            <Button onPress={() => setIsEditing(true)} Text="Update Progress" />
          </div>
        )}

        {isFinished && (
          <MarkAsFinishedButton CoverImageURL={book.CoverImageUrl} isbn={book.Isbn} shelves={shelves} triggerRefresh={refreshShelves}/>
        )}

        <div className="flex justify-between w-full mt-4">
          <button onClick={handlePrev} className="text-primary hover:underline">◀</button>
          <button onClick={handleNext} className="text-primary hover:underline">▶</button>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReadingCard;
