"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';

interface Shelf {
  id: string;
  name: string;
}

interface UserContextType {
  shelves: Shelf[];
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          const response = await axiosInstance.get(`/users/${idToken}/shelves`);
          setShelves(response.data.shelves);
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
    <UserContext.Provider value={{ shelves, loading }}>
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
