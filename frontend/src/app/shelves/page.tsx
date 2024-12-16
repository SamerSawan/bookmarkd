"use client";
import QuickShelf from "@/components/QuickShelf";
import ShelfCard from "@/components/ShelfCard";
import Button from "@/components/util/Button";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";

const dummyShelves = [
    {
      id: 1,
      title: 'Currently Reading',
      bookCount: 5,
      books: [
        { id: 1, image: 'https://books.google.com/books/content?id=y5GIDwAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api' },
        { id: 2, image: 'https://books.google.com/books/content?id=bgjGAgAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api' },
        { id: 3, image: 'https://books.google.com/books/content?id=2PO1MtB7E_0C&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api' },
      ],
    },
    {
      id: 2,
      title: 'To Be Read',
      bookCount: 12,
      description: 'Books I plan to read soon.',
      books: [
        { id: 4, image: 'https://via.placeholder.com/100x150' },
        { id: 5, image: 'https://via.placeholder.com/100x150' },
        { id: 6, image: 'https://via.placeholder.com/100x150' },
      ],
    },
    {
      id: 3,
      title: 'Read',
      bookCount: 25,
      description: 'Books I have already finished.',
      books: [
        { id: 7, image: 'https://via.placeholder.com/100x150' },
        { id: 8, image: 'https://via.placeholder.com/100x150' },
        { id: 9, image: 'https://via.placeholder.com/100x150' },
      ],
    },
  ];

const dummyQuickShelves = [
    {
        id: 1,
        title: 'Classics',
        books: [
          { id: 1, image: 'https://books.google.com/books/content?id=y5GIDwAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api' },
          { id: 2, image: 'https://books.google.com/books/content?id=bgjGAgAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api' },
          { id: 3, image: 'https://books.google.com/books/content?id=2PO1MtB7E_0C&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api' },
          { id: 4, image: 'https://via.placeholder.com/100x150'},
          { id: 5, image: 'https://via.placeholder.com/100x150'},
        ],
      },
      {
        id: 2,
        title: 'Fantasy',
        books: [
          { id: 6, image: 'https://via.placeholder.com/100x150' },
          { id: 7, image: 'https://via.placeholder.com/100x150' },
          { id: 8, image: 'https://via.placeholder.com/100x150' },
        ],
      },
      {
        id: 3,
        title: 'Non-Fiction',
        books: [
          { id: 9, image: 'https://via.placeholder.com/100x150' },
          { id: 10, image: 'https://via.placeholder.com/100x150' },
          { id: 11, image: 'https://via.placeholder.com/100x150' },
        ],
      },
]
  

const Shelves: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen items-center bg-back-base text-secondary-weak px-20 py-10">
            <div className="flex justify-between w-[80%]">
                <div>
                    <Link href="/" className="font-bold text-3xl text-primary hover:underline">BOOKMARKD</Link>
                </div>
                <div className="flex flex-row gap-16 text-2xl text-primary">
                    <Link href="/shelves" className="hover:underline">
                        Shelves
                    </Link>
                    <p>Activity</p>
                    <Link href="/search" className="hover:underline">Search</Link>
                </div>
            </div>
            <div className="grid grid-cols-12">
                <div className="flex flex-col col-start-3 col-span-5 w-full mt-16">
                    {dummyShelves.map((shelf, index) => (
                    <div key={shelf.id} className="flex flex-col">
                        {index == 0 && <hr className="my-4 border-slate-600" />}
                        <ShelfCard
                        title={shelf.title}
                        bookCount={shelf.bookCount}
                        books={shelf.books}
                        description={shelf.description}
                        />
                        {index < dummyShelves.length - 1 && <hr className="my-4 border-slate-600" />}
                    </div>
                
                    ))}
                </div>
                <div className="flex flex-row justify-center border-l border-slate-600 col-start-9 px-32 col-span-4 gap-24 mt-16">
                    <div className="flex flex-col justify-between">
                        <Button Text={"Create New Shelf"} onPress={function (): void {
                            throw new Error("Function not implemented.");
                        } }/>
                        <div className="">
                            <h4 className="text-secondary-strong font-bold">Quick Lists</h4>
                            <p>Lists composed of books from "To Be Read" as well as "Read" with a common theme.</p>
                            <div>
                                {dummyQuickShelves.map((shelf) => (
                                    <div key={shelf.id} className="flex flex-col">
                                        <QuickShelf 
                                        title={shelf.title}
                                        books={shelf.books}
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>
                        
                    </div>
                    
                    
                </div>
                
            </div>
            
        </div>
    )
}

export default Shelves;
