"use client";
import EmptyShelfCard from "@/components/EmptyShelfCard";
import Footer from "@/components/Footer";
import QuickShelf from "@/components/QuickShelf";
import ShelfCard from "@/components/ShelfCard";
import Button from "@/components/util/Button";
import Link from "next/link";
import React from "react";
import { useUser } from "../context/UserContext";

const dummyQuickShelves = [
    {
        id: 1,
        title: 'Classics',
        books: [
          { id: 1, image: 'http://books.google.com/books/content?id=SQoNCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
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
  const { shelves } = useUser();


  if (!shelves || shelves.length === 0) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <p className="text-xl">Loading shelves...</p>
          </div>
      );
  }

  return (
      <div className="flex flex-col min-h-screen items-center bg-back-base text-secondary-weak px-20 py-10">
          {/* Top Navbar */}
          <div className="flex justify-between w-[80%]">
              <div>
                  <Link href="/" className="font-bold text-3xl text-primary hover:underline">BOOKMARKD</Link>
              </div>
              <div className="flex flex-row gap-16 text-2xl text-primary">
                  <Link href="/shelves" className="hover:underline">
                      Shelves
                  </Link>
                  <Link href="/activity" className="hover:underline">
                      Activity
                  </Link>
                  <Link href="/search" className="hover:underline">Search</Link>
              </div>
          </div>

          {/* Shelves */}
          <div className="grid grid-cols-12">
              <div className="flex flex-col col-start-3 col-span-5 w-full mt-16">
                  {shelves.map((shelf, index) => (
                      <div key={shelf.id} className="flex flex-col">
                          {index == 0 && <hr className="my-4 border-slate-600" />}

                          {shelf.books.length === 0 ? (
                              
                              <EmptyShelfCard shelfName={shelf.name} />
                          ) : (
                              
                              <ShelfCard
                                  id={shelf.id}
                                  title={shelf.name}
                                  bookCount={shelf.bookCount || 0}
                                  books={shelf.books.map((book, index) => (
                                      {
                                          id: index,
                                          image: book.coverImageUrl || "https://via.placeholder.com/100x150", // Fallback for empty cover
                                      }
                                  ))}
                              />
                          )}

                          {index < shelves.length - 1 && <hr className="my-4 border-slate-600" />}
                      </div>
                  ))}
              </div>

              {/* Sidebar */}
              <div className="flex flex-row justify-center border-l border-slate-600 col-start-9 px-16 col-span-4 gap-24 mt-16">
                  <div className="flex flex-col justify-between">
                      <Button Text={"Create New Shelf"} onPress={() => console.log("Create New Shelf")} />
                      <div className="w-full">
                          <h4 className="text-secondary-strong font-bold">Quick Lists</h4>
                          <p>Lists composed of books from &quot;To Be Read&ldquo; as well as &quot;Read&quot; with a common theme. <span className="font-bold text-primary">This feature is coming soon</span></p>
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
          <div className="mt-10">
            <Footer/>
          </div>
          
      </div>
  );
};

export default Shelves;
