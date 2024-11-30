import React from "react";

interface YourNextBookCardProps {
  title: string;
  author: string;
  coverImage: string;
  onMarkAsCurrentlyReading: () => void; // Callback to handle the action
}

const YourNextBookCard: React.FC<YourNextBookCardProps> = ({
  title,
  author,
  coverImage,
  onMarkAsCurrentlyReading,
}) => {
  return (
    <div className="flex flex-col bg-[#334155] rounded-lg shadow-lg p-6 w-[100%] h-[100%]">
      <h3 className="text-xl font-bold mb-4 self-center">Your Next Book</h3>
      <div className="flex items-center gap-6">
        {/* Book Cover */}
        <img
          src={coverImage}
          alt={title}
          className="w-20 h-32 object-cover rounded"
        />
        {/* Book Info */}
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm text-gray-400">By {author}</p>
        </div>
      </div>

      {/* Mark as Currently Reading Button */}
      <div className="flex items-center justify-center">
        <button
            onClick={onMarkAsCurrentlyReading}
            className="bg-[#64748b] text-white py-2 px-4 rounded mt-4 hover:bg-[#475569] transition"
        >
            Mark as Currently Reading
        </button>
      </div>
    </div>
  );
};

export default YourNextBookCard;
