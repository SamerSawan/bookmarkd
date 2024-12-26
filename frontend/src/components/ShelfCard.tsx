import React from 'react';

type ShelfCardProps = {
  title: string;
  bookCount: number;
  books: { id: number; image: string }[];
  description?: string;
};

const ShelfCard: React.FC<ShelfCardProps> = ({ title, bookCount, books, description }) => {
  return (
    <div className="flex flex-col col-span-2 w-full p-4 py-6 rounded-lg">
      <div className='flex flex-row gap-6'>
        <div className="flex -space-x-3 overflow-hidden">
            {books?.map((book) => (
            <img
                key={book.id}
                src={book.image}
                alt={`Book ${book.id}`}
                className="w-24 h-36 object-cover rounded-md shadow-lg"
            />
            ))}
        </div>

        {/* Bottom Section: Book Count and Description */}
        <div className='flex flex-col'>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            {books.length == 1 ? <p className="text-md text-secondary-weak">{bookCount} book</p> : <p className="text-md text-secondary-weak">{bookCount} books</p>}
            {description && <p className="text-secondary-weak text-sm">{description}</p>}
        </div>
        
      </div>
    </div>
  );
};

export default ShelfCard;
