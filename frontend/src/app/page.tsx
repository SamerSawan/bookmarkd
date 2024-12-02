"use client"
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
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
  const handleCompleteQuest = () => {
    alert("Quest completed! 🎉");
  };
  

  // NOTE: Most of the text here is place holder until I set up users and logging in to the website with either home built auth or firebase auth
  return (
    <div className="flex flex-col  min-h-screen items-center bg-back text-secondary-weak px-20 py-10">
      {/* Nav */}
      <div className="flex justify-between w-[80%]">
        <div>
          <p className="font-bold text-3xl text-primary">BOOKMARKD</p>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
          <p>Shelves</p>
          <p>Stats</p>
          <p>Profile</p>
        </div>
      </div>
      {/* Welcome Text */}
      <div className="grid grid-cols-5 grid-rows-2 w-full items-start pt-10 text-lg">
        <p className="col-start-2 text-2xl text-secondary-strong">
          Welcome back, Samer!
        </p>
        <p className="col-start-2 row-start-2">
          You've read 4 books this month.
        </p>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-4 w-[60%] pt-10 gap-4">
        <div className="w-[100%] h-[100%] col-start-2 row-span-2">
        <CurrentlyReadingCard
          title="Gardens of the Moon"
          author="Steven Erikson"
          coverImage="http://books.google.com/books/content?id=Jgth_BYe7V8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          currentProgress={20}
          totalPages={600}
          onUpdateProgress={handleCompleteQuest} // this is a placeholder
        />
        </div>
        <div>
          <DailyQuestCard
          quest="Read 20 pages today!"
          progress={75}
          onComplete={() => alert("Quest completed! 🎉")}
          />
        </div>
        <div className="col-start-3 row-start-2">
          <ReadingStatsCard streak={0} booksReadThisMonth={0} booksReadThisYear={0} pagesReadToday={0} yearlyGoal={0}/>
        </div>
      </div>
      
      
    </div>
  );
};

export default Home;