"use client"
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Home: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [status, setStatus] = useState<string>("Currently Reading");
  const [response, setResponse] = useState<string>("");

  const handleSearch = async () => {
    // replace spaces with underscore
    const processedQuery = query.replace(/\s+/g, "_").toLowerCase();

    try {
        const res = await axiosInstance.get(`/books/search?q=${encodeURIComponent(processedQuery)}`);

        const transformedBooks = res.data.map((item: any) => {
            const volumeInfo = item.VolumeInfo;
            return {
                title: volumeInfo.title,
                authors: volumeInfo.authors || ["Unknown Author"],
                isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier || "Unknown ISBN",
                thumbnail: volumeInfo.imageLinks?.thumbnail || "",
                description: volumeInfo.description || "No description available.",
            };
        });

        setBooks(transformedBooks);
    } catch (error) {
        console.error(error);
        setBooks([]);
    }
  };
  // NOTE: Most of the text here is place holder until I set up users and logging in to the website with either home built auth or firebase auth
  return (
    <div className="flex flex-col  min-h-screen items-center bg-[#1e293b] text-[#f1f5f9] px-20 py-10">
      <div>
        <p className="font-bold text-3xl">Bookmarkd Dashboard</p>
      </div>
      <div className="grid grid-cols-5 grid-rows-2 w-full items-start pt-10 text-lg">
        <p className="col-start-2">
          Welcome back, Samer!
        </p>
        <p className="col-start-2 row-start-2">
          You've read 4 books this month.
        </p>
      </div>
      
    </div>
  );
};

export default Home;