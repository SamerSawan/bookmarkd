import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <div className="flex justify-between self-center w-full">
        <div>
            <Link href="/" className="font-bold text-3xl text-primary hover:underline">
            BOOKMARKD
            </Link>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
            <Link href="/shelves" className="hover:underline">Shelves</Link>
            <Link href="/activity" className="hover:underline">Activity</Link>
            <Link href="/search" className="hover:underline">Search</Link>
        </div>
    </div>
    )
}

export default Navbar;