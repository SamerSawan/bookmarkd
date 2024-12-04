"use client"
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import DailyQuestCard from "@/components/DailyQuest";
import ReadingStatsCard from "@/components/ReadingStatsCard";
import CurrentlyReadingCard from "@/components/CurrentlyReadingCard";

const Home: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [status, setStatus] = useState<string>("Currently Reading");
  const [response, setResponse] = useState<string>("");
  

  // NOTE: Most of the text here is place holder until I set up users and logging in to the website with either home built auth or firebase auth
  return (
    <div className="flex flex-col  min-h-screen items-center bg-back text-secondary-weak px-20 py-10"> 
      
    </div>
  );
};

export default Home;