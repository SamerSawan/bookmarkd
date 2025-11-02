"use client";
import axiosInstance from '@/utils/axiosInstance';
import { IconSearch, IconStar, IconStarFilled } from '@tabler/icons-react';
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ShelfDropdownCircular from '@/components/ShelfDropdownCircular';
import { toast, ToastContainer } from 'react-toastify';
import {useUser} from '../context/UserContext';
import { auth } from '../../../firebase';
import TooManyFavourites from '@/components/TooManyFavourites';
import Navbar from '@/components/util/Navbar';
import { useRouter } from 'next/navigation'
import { BookItem, Book, IndustryIdentifier } from '@/utils/models';
import BookCardSkeleton from '@/components/util/BookCardSkeleton';
import shelfService from '@/services/shelfService';

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const { shelves, favourites, refreshShelves } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [bookShelfMapping, setBookShelfMapping] = useState<Record<string, string[]>>({});

  const router = useRouter()

  const handleSearch = async () => {
    const processedQuery = query.replace(/\s+/g, "+").toLowerCase();
    setLoading(true);
    setError("");
    setBooks([]);

    try {
        const res = await axiosInstance.get(`/books/search?q=${encodeURIComponent(processedQuery)}`);

        const transformedBooks = res.data.items
            .map((item: BookItem) => {
                const volumeInfo = item.VolumeInfo;
                return {
                    title: volumeInfo.title,
                    authors: volumeInfo.authors || ["Unknown Author"],
                    publisher: volumeInfo.publisher,
                    publishedDate: volumeInfo.publishedDate,
                    description: volumeInfo.description || "No description available.",
                    isbn: volumeInfo.industryIdentifiers?.find((id: IndustryIdentifier) => id.type === "ISBN_13")?.identifier || null,
                    cover: volumeInfo.imageLinks?.thumbnail || "",
                    industryIdentifiers: volumeInfo.industryIdentifiers,
                    pageCount: volumeInfo.pageCount,
                    categories: volumeInfo.categories,
                    imageLinks: volumeInfo.imageLinks,
                    language: volumeInfo.language
                };
            })
            .filter((book: Book) => book.isbn !== null);

        setBooks(transformedBooks);
    } catch (error) {
        console.error(error);
        setError("Failed to fetch search results.");
    } finally {
        setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search if query is empty
    if (query.trim() === "") {
      setBooks([]);
      return;
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms delay

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const fetchShelvesForBooks = async () => {
      const mapping: Record<string, string[]> = {};

      for (const book of books) {
        if (book.isbn) {
          try {
            const shelfIDs = await shelfService.getShelvesContainingBook(book.isbn);
            mapping[book.isbn] = shelfIDs;
          } catch (error) {
            console.error(`Error fetching shelves for book ${book.isbn}:`, error);
            mapping[book.isbn] = [];
          }
        }
      }

      setBookShelfMapping(mapping);
    };

    if (books.length > 0) {
      fetchShelvesForBooks();
    }
  }, [books, shelves]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // Clear debounce timer and search immediately on submit
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      handleSearch();
    }
  };

  const handleFavourite = async (isbn: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in to manage favorites.");
      return;
    }
    const idToken = await user.getIdToken();

    const isFavourite = favourites?.some(fav => fav.isbn === isbn);

    try {
      if (isFavourite) {
        // Remove from favourites
        await axiosInstance.delete("/users/me/favourites", {
          data: { isbn },
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        toast.success("Removed from favourites.");
      } else {
        // Add to favourites
        if (favourites && favourites.length >= 4) {
          setShowModal(true);
          return;
        }

        await axiosInstance.post("/users/me/favourites", { isbn }, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        toast.success("Added to favourites.");
      }

      // Refresh shelves after update
      refreshShelves();

    } catch (error) {
      console.error(error);
      toast.error("Failed to update favourites.");
    }
  };

  const addToShelf = async (book: Book, shelfId: string, shelfName: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You need to be logged in to add books.");
        return;
      }
      const idToken = await user.getIdToken();
      const checkBookExists = await axiosInstance.get(`/books/exists?isbn=${book.isbn}`);

      const bookExists = checkBookExists.data.exists;
      if (!bookExists) {
        await axiosInstance.post("/books", {
          title: book.title,
          authors: book.authors,
          publisher: book.publisher,
          publishedDate: book.publishedDate,
          description: book.description,
          industryIdentifiers: book.industryIdentifiers,
          pageCount: book.pageCount,
          categories: book.categories,
          imageLinks: book.imageLinks,
          language: book.language
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        console.log(`${book.title} created successfully`);
      }

      const checkBookExistsInShelf = await axiosInstance.get(`/shelves/${shelfId}/exists?isbn=${book.isbn}`)

      const bookIsInShelf = checkBookExistsInShelf.data.exists;
      if (bookIsInShelf) {
        console.log(`${book.title} already exists in target shelf!`)
        toast.error(`${book.title} is already in ${shelfName}`)
        return;
      }

      await axiosInstance.post(`/shelves/${shelfId}`, {
        isbn: book.isbn,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      refreshShelves();
      
      toast.success(`Successfully added "${book.title}" to ${shelfName}!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add "${book.title}" to ${shelfName}`);
    }
    
  };

  const handleClickOnBook = async (book: Book) => {

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You need to be logged in to add books.");
        return;
      }
      const idToken = await user.getIdToken();
      const checkBookExists = await axiosInstance.get(`/books/exists?isbn=${book.isbn}`);

      const bookExists = checkBookExists.data.exists;
      if (!bookExists) {
        await axiosInstance.post("/books", {
          title: book.title,
          authors: book.authors,
          publisher: book.publisher,
          publishedDate: book.publishedDate,
          description: book.description,
          industryIdentifiers: book.industryIdentifiers,
          pageCount: book.pageCount,
          categories: book.categories,
          imageLinks: book.imageLinks,
          language: book.language
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
      });}
    } catch (error) {
      console.log("Failed to create book")
      console.log(error)
      toast.error("Failed to create book in database!")
      return;
    }
    router.push(`/book/${book.isbn}`)
}

  return (
    <div className="flex flex-col bg-back-base min-h-screen px-20 py-10">
      <Navbar/>
    <motion.div
      className="flex flex-col items-center justify-center bg-back-base text-secondary-weak px-20 py-10"
      layout
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="relative w-full">
          <input
            placeholder="Search by book title, author, isbn"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-back-overlay rounded-full py-4 pl-12 focus:ring-primary focus:ring-2 outline-none placeholder-secondary-weak"
          />
          <IconSearch
            stroke={2}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-secondary-weak"
          />
        </div>
      </motion.form>

      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mt-4 text-danger">{error}</motion.p>}

      <motion.div className="mt-8 grid grid-cols-1 gap-6 w-full" layout>
        {loading && (
          <>
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
          </>
        )}
        {!loading && books.map((book, index) => (
          <motion.div
            key={index}
            className="relative flex text-left bg-back-raised border border-stroke-weak/50 px-6 pt-6 pb-4
                       rounded-lg shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleClickOnBook(book)}
            >
              <img
                src={book.cover || "https://via.placeholder.com/100x150"}
                alt={book.title}
                className="w-32 h-48 rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="ml-6 flex flex-col justify-between w-full pr-32">
              <div onClick={() => handleClickOnBook(book)} className="cursor-pointer">
                <h3 className="text-xl font-bold text-primary-light hover:text-primary transition-colors">{book.title}</h3>
                <p className="text-sm text-secondary italic mt-1">{book.authors.join(", ")}</p>
                <p className="text-sm text-secondary-weak mt-4 line-clamp-4 leading-relaxed">{book.description}</p>
                <div className="text-xs text-secondary mt-4 flex flex-row gap-4">
                  <span className="bg-back-overlay px-3 py-1 rounded-full">{book.pageCount} Pages</span>
                  <span className="bg-back-overlay px-3 py-1 rounded-full">ISBN {book.isbn}</span>
                </div>
              </div>
            </div>

            {/* Action buttons in top-right corner */}
            <div className="absolute top-4 right-4 flex flex-row gap-2 items-center z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavourite(book.isbn);
                }}
                className="text-yellow-400 hover:scale-110 transition-transform duration-200 bg-back-base/80 backdrop-blur-sm rounded-full p-2"
                title={favourites?.some(fav => fav.isbn === book.isbn) ? "Remove from favorites" : "Add to favorites"}
              >
                {favourites?.some(fav => fav.isbn === book.isbn) ? <IconStarFilled size={24}/> : <IconStar size={24}/>}
              </button>

              <div onClick={(e) => e.stopPropagation()}>
                <ShelfDropdownCircular
                  shelves={shelves}
                  onSelect={(shelfID: string, shelfName: string) => addToShelf(book, shelfID, shelfName)}
                  shelfIDsContainingBook={bookShelfMapping[book.isbn] || []}
                />
              </div>
            </div>
          </motion.div>
        ))}
        <ToastContainer theme="colored" />
      </motion.div>
      {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-secondary-strong">
            <div className="bg-back-overlay p-6 rounded-lg shadow-lg">
              <TooManyFavourites onClose={() => setShowModal(false)}/>
            </div>
          </div>
        )}
    </motion.div>
    </div>
  );
};

export default Search;
