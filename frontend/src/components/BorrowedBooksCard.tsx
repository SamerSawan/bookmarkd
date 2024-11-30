import React from "react";

export interface BorrowedBook {
  title: string;
  person: string; // Name of the person who borrowed or lent the book
  type: "lent" | "borrowed"; // Type of transaction
  dueDate?: string; // Optional due date
}

interface BorrowedBooksCardProps {
  books: BorrowedBook[];
}

const BorrowedBooksCard: React.FC<BorrowedBooksCardProps> = ({ books }) => {
  return (
    <div className="flex flex-col bg-[#334155] rounded-lg shadow-lg p-6 w-[100%] h-[100%]">
      <h3 className="text-xl font-bold mb-4 self-center">Borrowed Books</h3>
      {books.length > 0 ? (
        <ul className="space-y-3">
          {books.map((book, index) => (
            <li
              key={index}
              className="bg-[#475569] p-4 rounded text-sm flex flex-col"
            >
              <p>
                <span className="font-semibold">{book.title}</span> -{" "}
                {book.type === "lent"
                  ? `Lent to ${book.person}`
                  : `Borrowed from ${book.person}`}
              </p>
              {book.dueDate && (
                <p className="text-gray-400 text-xs">Due: {book.dueDate}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No books currently lent or borrowed.</p>
      )}
    </div>
  );
};

export default BorrowedBooksCard;
