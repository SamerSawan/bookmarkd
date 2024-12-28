"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';

interface Book {
  isbn: string;
  title: string;
  author: string;
  coverImageUrl: string;
  publishDate: string;
  pages: number;
  description: string;
}

interface Shelf {
  id: string;
  name: string;
  bookCount: number;
  books: Book[];
}

interface UserContextType {
  shelves: Shelf[];
  loading: boolean;
  refreshShelves: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const normalizeBooks = (books: any[]): Book[] => {
    return books.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      coverImageUrl: book.cover_image_url || "https://via.placeholder.com/100x150", // Default if missing
      publishDate: book.publish_date,
      pages: book.pages,
      description: book.description || "No description available.", // Default description
    }));
  };

  const fetchShelves = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();

        const response = await axiosInstance.get(`/users/${idToken}/shelves`);

        const normalizedShelves = response.data.shelves.map((shelf: any) => ({
          id: shelf.id,
          name: shelf.name,
          bookCount: shelf.books?.length,
          books: normalizeBooks(shelf.books || []), // Normalize books array
        }));

        setShelves(normalizedShelves);
      } else {
        toast.error("User not authenticated");
      }
    } catch (error) {
      console.error("Failed to fetch user shelves:", error);
      toast.error("Failed to load shelves");
    } finally {
      setLoading(false); 
    }
  };
  const refreshShelves = useCallback(() => {
    setLoading(true); 
    fetchShelves();  
  }, [fetchShelves]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchShelves();
      } else {
        setShelves([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ shelves, loading, refreshShelves }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
