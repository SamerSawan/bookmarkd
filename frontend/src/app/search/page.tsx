"use client";
import axiosInstance from '@/utils/axiosInstance';
import { IconSearch } from '@tabler/icons-react';
import React, { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from './Dropdown';
import { toast, ToastContainer } from 'react-toastify';
import {useUser} from '../context/UserContext';
import Link from 'next/link';
import { auth } from '../../../firebase';

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<any[]>([]);
  const { shelves, refreshShelves } = useUser()
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    // replace spaces with plus sign
    const processedQuery = query.replace(/\s+/g, "+").toLowerCase();
    setLoading(true)
    setError("");
    setBooks([])

    try {
        const res = await axiosInstance.get(`/books/search?q=${encodeURIComponent(processedQuery)}`);

        const transformedBooks = res.data.map((item: any) => {
            const volumeInfo = item.VolumeInfo;
            return {
                title: volumeInfo.title,
                authors: volumeInfo.authors || ["Unknown Author"],
                publisher: volumeInfo.publisher,
                publishedDate: volumeInfo.publishedDate,
                description: volumeInfo.description || "No description available.",
                isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier || "Unknown ISBN",
                cover: volumeInfo.imageLinks?.thumbnail || "",
                industryIdentifiers: volumeInfo.industryIdentifiers,
                pageCount: volumeInfo.pageCount,
                categories: volumeInfo.categories,
                imageLinks: volumeInfo.imageLinks,
                language: volumeInfo.language
                
            };
        });

        

        setBooks(transformedBooks);
    } catch (error) {
        console.error(error);
        setError("Failed to fetch search results.");
    } finally {
        setLoading(false)
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== "") {
      handleSearch();
    }
  };

  const addToShelf = async (book: any, shelfId: string, shelfName: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You need to be logged in to add books.");
        return;
      }
      const idToken = await user.getIdToken();
    
      const checkBookExists = await axiosInstance.get(`/books/exists?isbn=${book.isbn}`)

      let bookExists = checkBookExists.data.exists;

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

  return (
    <div className="flex flex-col bg-back-base min-h-screen">
      <div className="flex self-start justify-between w-full px-20 py-10">
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

      {/* Loading and Error States */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm mt-4"
        >
          Loading...
        </motion.p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm mt-4 text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Book Results */}
      <motion.div
        className="mt-8 grid grid-cols-1 gap-8 w-full"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: books.length > 0 ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        {books.map((book, index) => (
          <motion.div
            key={book.isbn || index}
            className="flex bg-back-raised p-6 rounded-lg shadow-lg hover:shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {/* Book Cover */}
            <img
              src={book.cover}
              alt={book.title}
              className="w-32 h-48 rounded-lg object-cover"
            />
            {/* Book Info */}
            <div className="ml-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary">{book.title}</h3>
                <p className="text-sm text-secondary-weak italic">
                  {book.authors.join(", ")}
                </p>
                <p className="text-sm text-secondary mt-4 line-clamp-4">
                  {book.description}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <Dropdown shelves={shelves} onSelect={(shelfID: string, shelfName: string) => addToShelf(book, shelfID, shelfName)} />
              </div>
            </div>
          </motion.div>
        ))}
        <ToastContainer
        theme="colored"
        />
      </motion.div>
    </motion.div>
    </div>
  );
};

export default Search;
