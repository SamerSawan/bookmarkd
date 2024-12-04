import React, { useState } from "react";
import Button from "./util/Button";

interface CurrentlyReadingCardProps {
  title: string;
  author: string;
  coverImage: string;
  currentProgress: number;
  totalPages: number;
  onUpdateProgress: (newProgress: number) => void;
}

const CurrentlyReadingCard: React.FC<CurrentlyReadingCardProps> = ({
  title,
  author,
  coverImage,
  currentProgress,
  totalPages,
  onUpdateProgress,
}) => {
  const [newProgress, setNewProgress] = useState(currentProgress);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    if (newProgress > totalPages || newProgress < 0) {
      alert("Progress must be between 0 and total pages.");
      return;
    }
    onUpdateProgress(newProgress);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col bg-back-raised rounded-lg shadow-lg overflow-hidden max-w-full">
      {/* Top Section: Book Cover */}
      <div className="relative h-60 w-full">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom Section: Book Info */}
      <div className="flex flex-col items-center p-4">
        <h4 className="text-xl font-semibold text-secondary-strong text-center">{title}</h4>
        <p className="text-md text-secondary-weak text-center">By {author}</p>
        <div className="w-full bg-stroke-weak rounded-full h-4 mb-4 mt-6">
          <div
            className="bg-gradient-to-r from-[#4C7BD9] to-primary h-4 rounded-full"
            style={{ width: `${75}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-secondary-weak">
        <span>Progress: {75}%</span>
      </div>
        {/* Update Progress Button/Input */}
        {isEditing ? (
          <div className="mt-4 flex gap-2 items-center">
            <input
              type="number"
              value={newProgress}
              onChange={(e) => setNewProgress(Number(e.target.value))}
              className="bg-[#475569] text-white p-2 rounded w-20"
              min="0"
              max={totalPages}
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
      </div>
    </div>
  );
};

export default CurrentlyReadingCard;
