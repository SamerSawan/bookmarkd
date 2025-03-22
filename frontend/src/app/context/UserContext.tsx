"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';

interface RawBook {
  isbn: string;
  title: string;
  author: string;
  cover_image_url?: string;
  publish_date: string;
  pages: number;
  description?: string;
}

interface RawShelf {
  id: string;
  name: string;
  books?: RawBook[]; 
}

interface RawFav {
  Isbn: string;
  Title: string;
  Author: string;
  CoverImageUrl: string;
  PublishDate: string;
  Pages: number;
  Description?: string;
}

interface Book {
  isbn: string;
  title: string;
  author: string;
  coverImageUrl: string;
  publishDate: string;
  pages: number;
  description: string;
}

interface CurrentlyReadingBook {
  Isbn: string;
  Title: string;
  Author: string;
  CoverImageUrl: string;
  PublishDate: string;
  Pages: number;
  Description: string;
  Progress: number;
}

interface Shelf {
  id: string;
  name: string;
  bookCount: number;
  books: Book[];
}

interface UserContextType {
  shelves: Shelf[];
  currentlyReading: CurrentlyReadingBook[] | null;
  loading: boolean;
  refreshShelves: () => void;
  fetchCurrentlyReading: () => void;
  updateProgress: ( isbn: string, progress: number ) => Promise<void>;
  favourites: Book[] | null;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentlyReading, setCurrentlyReading] = useState<CurrentlyReadingBook[] | null>(null);
  const [favourites, setFavourites] = useState<Book[] | null>(null);
  

  const fetchShelves = useCallback(async () => {
    const normalizeBooks = (books: RawBook[]): Book[] => {
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

    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();

        const response = await axiosInstance.get(`/users/${idToken}/shelves`);

        const normalizedShelves = response.data.shelves.map((shelf: RawShelf) => ({
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
  }, [setShelves, setLoading]);

  const refreshShelves = useCallback(() => {
    setLoading(true); 
    fetchShelves();
    fetchCurrentlyReading();
    fetchFavourites();
  }, [fetchShelves]);

  const fetchCurrentlyReading = async () => {
    setCurrentlyReading((prev) => prev || []); // Preserve current data until new data is fetched
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await axiosInstance.get("/users/me/currently-reading", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
  
      setCurrentlyReading(res.data); // Update state
      console.log(res.data)
    } catch (error) {
      console.error("Failed to fetch currently reading book:", error);
    }
  };

  const updateProgress = async (isbn: string, progress: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
  
      await axiosInstance.put(
        `/books/${isbn}/progress`,
        { progress },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
  
      await fetchCurrentlyReading();
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };


  const fetchFavourites = async () => {
    setFavourites((prev) => prev || [])
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await axiosInstance.get("/users/me/favourites", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!res.data || res.data === null) {
        setFavourites(null);
        return;
      }

      const normalizeFavs = (books: RawFav[]): Book[] => {
        return books.map((book) => ({
          isbn: book.Isbn,
          title: book.Title,
          author: book.Author,
          coverImageUrl: book.CoverImageUrl || "https://via.placeholder.com/100x150", // Default if missing
          publishDate: book.PublishDate,
          pages: book.Pages,
          description: book.Description || "No description available.", // Default description
        }));
      };

      const normalizedFavs = normalizeFavs(res.data);
  
      setFavourites(normalizedFavs); // Update state
    } catch (error) {
      console.error("Failed to fetch favourites:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchShelves();
        fetchCurrentlyReading();
        fetchFavourites();
      } else {
        setShelves([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchShelves]);

  return (
    <UserContext.Provider value={{ shelves, currentlyReading, loading, refreshShelves, fetchCurrentlyReading, updateProgress, favourites }}>
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
