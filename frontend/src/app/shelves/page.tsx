"use client";
import EmptyShelfCard from "@/components/EmptyShelfCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/util/Navbar";
import Link from "next/link";
import React from "react";
import { useUser } from "../context/UserContext";

const dummyQuickShelves = [
    {
        id: 1,
        title: 'Classics',
        books: [
          { id: 1, image: 'https://books.google.ca/books/publisher/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71PyWy2lcALKWxbJ74-dObZQ7iepETYyOLt828m_54LTBS_p1anor7WSFLMvg8mTJCLs_fAa1--WXvO7XiHfjWge9VYNTtvGxTKyEhLx-DPjojWrGl_XGBXNDICymtejuOQ8yzy' }, // To Kill a Mockingbird
          { id: 2, image: 'https://m.media-amazon.com/images/I/71wANojhEKL._UF1000,1000_QL80_.jpg' }, // 1984
          { id: 3, image: 'https://m.media-amazon.com/images/I/81NLDvyAHrL._UF1000,1000_QL80_.jpg' }, // Pride and Prejudice
          { id: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg' }, // The Great Gatsby
        ],
      },
      {
        id: 2,
        title: 'Fantasy',
        books: [
          { id: 6, image: 'https://books.google.com/books/content?id=aWZzLPhY4o0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' }, // The Hobbit
          { id: 7, image: 'https://books.google.com/books/content?id=5NomkK4EV68C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' }, // Harry Potter
          { id: 8, image: 'https://books.google.com/books/content?id=yl4dILkcqm4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' }, // A Game of Thrones
        ],
      },
      {
        id: 3,
        title: 'Science Fiction',
        books: [
          { id: 9, image: 'https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' }, // Dune
          { id: 10, image: 'https://upload.wikimedia.org/wikipedia/commons/7/71/The_Martian_%28Weir_novel%29.jpg' }, // The Martian
          { id: 11, image: 'https://dynamic.indigoimages.ca/v1/books/books/1250773024/1.jpg?width=810&maxHeight=810&quality=85' }, // Ender's Game
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
      <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak">
          <div className="px-20 py-10">
              <Navbar/>
          </div>

          {/* Main Content - Centered, Max Width */}
          <div className="w-full max-w-[1400px] mx-auto px-20 py-12">

              {/* Page Header */}
              <div className="mb-12">
                  <h1 className="text-4xl font-bold text-white mb-2">Your Shelves</h1>
                  <p className="text-secondary-weak">Organize your reading collection</p>
              </div>

              {/* Shelves */}
              <div className="flex flex-col gap-12">
                  {shelves.map((shelf, index) => (
                      <div key={shelf.id}>
                          <div className="flex flex-col gap-4">
                              {/* Shelf Header */}
                              <div className="flex items-center justify-between">
                                  <div>
                                      <h2 className="text-2xl font-semibold text-white">{shelf.name}</h2>
                                      <p className="text-sm text-secondary-weak">
                                          {shelf.bookCount || 0} {(shelf.bookCount || 0) === 1 ? 'book' : 'books'}
                                      </p>
                                  </div>
                                  <Link
                                      href={`/shelves/${shelf.id}`}
                                      className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
                                  >
                                      View all
                                  </Link>
                              </div>

                              {/* Books Grid/Scroll */}
                              {shelf.books.length === 0 ? (
                                  <EmptyShelfCard shelfName={shelf.name} />
                              ) : (
                                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                      {shelf.books.slice(0, 8).map((book, index) => (
                                          <div
                                              key={index}
                                              className="flex-shrink-0 group cursor-pointer"
                                          >
                                              <img
                                                  src={book.coverImageUrl || "https://via.placeholder.com/150x225"}
                                                  alt={book.title || "Book cover"}
                                                  className="w-[140px] h-[210px] object-cover rounded-md shadow-lg transition-transform group-hover:scale-105"
                                              />
                                          </div>
                                      ))}
                                      {shelf.books.length > 8 && (
                                          <Link
                                              href={`/shelves/${shelf.id}`}
                                              className="flex-shrink-0 w-[140px] h-[210px] bg-slate-800/50 rounded-md flex items-center justify-center hover:bg-slate-800/70 transition-colors"
                                          >
                                              <span className="text-secondary-weak text-sm">
                                                  +{shelf.books.length - 8} more
                                              </span>
                                          </Link>
                                      )}
                                  </div>
                              )}
                          </div>
                          {/* Divider between shelves */}
                          {index < shelves.length - 1 && (
                              <div className="border-t border-slate-700/30 mt-12"></div>
                          )}
                      </div>
                  ))}

                  {/* Create New Shelf */}
                  <div className="flex items-center justify-center py-8 border-t border-slate-700/30 mt-4">
                      <button
                          onClick={() => console.log("Create New Shelf")}
                          className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800/70 text-white rounded-md transition-colors text-sm font-medium border border-slate-600/50"
                      >
                          + Create New Shelf
                      </button>
                  </div>
              </div>
          </div>

          <Footer/>
      </div>
  );
};

export default Shelves;
