import Link from 'next/link';
import React from 'react';

const EmptyShelfCard: React.FC<{ shelfName: string }> = ({ shelfName }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary">{shelfName} is Empty</h3>
            <p className="text-secondary mt-4">Start building your collection by adding books to this shelf.</p>
            <Link href="/search" className="mt-4 px-4 py-2 bg-primary text-secondary-dark rounded-md hover:opacity-80">
                Search for Books
            </Link>
        </div>
    );
};

export default EmptyShelfCard;