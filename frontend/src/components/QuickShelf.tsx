import React from 'react';

type QuickShelfProps = {
  title: string;
  books: { id: number; image: string }[];
};

const QuickShelf: React.FC<QuickShelfProps> = ({ title, books }) => {
  return (
    <div className="flex flex-col col-span-2 w-full p-4 py-6 rounded-lg">
      <div className='flex flex-col'>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <div className="flex justify-between">
        <div className="flex -space-x-12 overflow-hidden">
            {books.map((book) => (
            <img
                key={book.id}
                src={book.image}
                alt={`Book ${book.id}`}
                className="w-16 h-24 object-cover rounded-md shadow-lg"
            />
            ))}
        </div>
        <div className='self-center'>
            <p className="text-secondary-weak">Add +</p>
        </div>
      </div>
        
        
      </div>
    </div>
  );
};

export default QuickShelf;
