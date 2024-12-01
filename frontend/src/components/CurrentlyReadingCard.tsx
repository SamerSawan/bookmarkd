import React, { useState } from "react";

interface CurrentlyReadingCardProps {
  title: string;
  author: string;
  coverImage: string;
  currentProgress: number; // Current progress in pages
  totalPages: number; // Total number of pages
  onUpdateProgress: (newProgress: number) => void; // Callback to update progress
}

const CurrentlyReadingCard: React.FC<CurrentlyReadingCardProps> = ({
  title,
  author,
  coverImage,
  currentProgress,
  totalPages,
  onUpdateProgress,
}) => {
  const [newProgress, setNewProgress] = useState(currentProgress); // Input state
  const [isEditing, setIsEditing] = useState(false); // Toggle input field

  const handleUpdate = () => {
    if (newProgress > totalPages || newProgress < 0) {
      alert("Progress must be between 0 and total pages.");
      return;
    }
    onUpdateProgress(newProgress);
    setIsEditing(false); // Close the input field after updating
  };

  return (
    <div className="flex flex-col bg-[#F7F5FA] rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 self-center">Currently Reading</h3>
      <div className="flex items-center justify-evenly px-8">
        {/* Book Cover */}
        <img
          src={coverImage}
          alt={title}
          className="w-30 h-48 object-cover rounded"
        />
        {/* Book Info */}
        <div className="flex flex-col items-center">
          <div className="text-center">
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm text-gray-400">By {author}</p>
            <p className="text-sm mt-2">
              Progress: {currentProgress}%
            </p>
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
              <div className="flex items-center justify-center">
                  <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#8E13FF] text-white py-2 px-4 rounded mt-4 hover:bg-[#475569] transition"
                  >
                  Update Progress
                  </button>
              </div>
            )}
        </div>
        
      </div>
    </div>
  );
};

export default CurrentlyReadingCard;
