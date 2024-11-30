import React from "react";

const BookshelvesCard: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#334155] rounded-lg shadow-lg p-6 w-[100%] h-[100%]">
      <h3 className="text-xl font-bold mb-4 self-center">Your Bookshelves</h3>
      <div className="flex flex-col">
        
        <div className="mb-2">
          <h4 className="font-semibold">Currently Reading</h4>
          <div className="flex gap-2">
            2 books
          </div>
        </div>

        
        <div className="mb-2">
          <h4 className="font-semibold">To Be Read</h4>
          <div className="flex gap-2">
            15 books
          </div>
        </div>

        
        <div className="mb-2">
          <h4 className="font-semibold">Read</h4>
          <div className="flex gap-2">
            25 books
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookshelvesCard;
