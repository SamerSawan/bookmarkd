import React, { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
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
      const progress = Number(book.progress) || 0;
      setNewProgress(progress);
    }
  }, [currentIndex, book]);

  if (loading) {
    return (
      <div className="flex flex-col bg-back-raised border border-stroke-weak/50 rounded-xl shadow-card p-8 text-center">
        <h4 className="text-xl font-semibold text-secondary-strong">Loading...</h4>
      </div>
    );
  }

  if (!currentlyReading || currentlyReading.length === 0 || !book) {
    return (
      <div className="flex flex-col bg-back-raised border border-stroke-weak/50 rounded-xl shadow-card p-8 text-center h-full w-full items-center justify-center">
        <h4 className="text-xl font-semibold text-secondary-strong">
          No books are currently being read!
        </h4>
        <p className="text-md text-secondary mt-2">
          Add a book to your &quot;Currently Reading&quot; shelf to see it here.
        </p>
      </div>
    );
  }

  const pages = Number(book.pages) || 0;
  const progressPercentage = Math.min(100, Math.round((newProgress / pages) * 100));
  const isFinished = newProgress >= pages;

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const bookISBN = book.isbn;

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

  const bookCover = getHighResImage(book.coverImageUrl);

  return (
    <div className="flex flex-col md:flex-row bg-back-raised border border-stroke-weak/50 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden">
      {/* Book Cover - Left Side */}
      <div
        className="relative w-full md:w-40 h-56 md:h-auto flex-shrink-0 hover:cursor-pointer group"
        onClick={() => {router.push(`/book/${book.isbn}`)}}
      >
        <img
          src={bookCover}
          alt={book.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-back-base/80 via-transparent to-transparent" />
      </div>

      {/* Content - Right Side */}
      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <h3
            className="text-2xl font-bold text-primary-light hover:cursor-pointer hover:text-primary transition-colors"
            onClick={() => {router.push(`/book/${book.isbn}`)}}
          >
            {book.title}
          </h3>
          <p className="text-sm text-secondary mt-1">By {book.author}</p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-secondary-weak mb-2">
              <span>{newProgress} / {pages} pages</span>
              <span className="font-semibold text-primary">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-back-overlay rounded-full h-3 overflow-hidden border border-stroke-weak/30">
              <div
                className="bg-gradient-to-r from-[#4C7BD9] to-primary h-full rounded-full transition-all duration-300 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {/* Progress Update - Inline Edit Mode */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="bg-back-overlay text-secondary-strong border border-primary/50 p-2 rounded-lg w-20
                               focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-center"
                    max={pages}
                    autoFocus
                  />
                  <span className="text-secondary-weak text-sm">/ {pages} pages</span>
                </div>
                <button
                  onClick={handleUpdate}
                  className="bg-primary text-secondary-dark font-semibold py-2 px-4 rounded-lg
                             hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                             active:scale-95 transition-all duration-200 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-back-overlay text-secondary font-semibold py-2 px-4 rounded-lg border border-stroke-weak/30
                             hover:bg-back-base hover:border-stroke-strong/30
                             active:scale-95 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-secondary-dark font-semibold py-2.5 px-6 rounded-lg w-full
                           hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                           active:scale-95 transition-all duration-200"
              >
                Update Progress
              </button>
            )}
          </div>

          {/* Mark as Finished Button */}
          {isFinished && !isEditing && (
            <MarkAsFinishedButton CoverImageURL={book.coverImageUrl} isbn={book.isbn} shelves={shelves} triggerRefresh={refreshShelves} isCurrentlyReading={true} reviews={[]}/>
          )}

          {/* Navigation for multiple books */}
          {currentlyReading.length > 1 && (
            <div className="flex justify-between items-center pt-3 border-t border-stroke-weak/30">
              <button
                onClick={handlePrev}
                className="text-primary hover:text-primary-light text-xl hover:scale-110 transition-all duration-200 p-2"
              >
                ◀
              </button>
              <span className="text-secondary text-sm">
                Book {currentIndex + 1} of {currentlyReading.length}
              </span>
              <button
                onClick={handleNext}
                className="text-primary hover:text-primary-light text-xl hover:scale-110 transition-all duration-200 p-2"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReadingCard;
