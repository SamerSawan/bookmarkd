"use client"
import React, { useEffect, useState } from "react";
import DailyQuestCard from "@/components/DailyQuest";
import ReadingStatsCard from "@/components/ReadingStatsCard";
import CurrentlyReadingCard from "@/components/CurrentlyReadingCard";
import FavouriteBooks from "@/components/FavouriteBooks";
import TBRList from "@/components/ToBeRead";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { IconLogout } from '@tabler/icons-react';
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

type User = {
  id: string;
  email: string;
  username: string;
};

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const id = currentUser.uid;
        try {
          const res = await axiosInstance.get(`/users/${id}`);
          const { id: email, username } = res.data;

          setUser({
            id: id,
            email: email,
            username: username,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);
  
  // const handleCompleteQuest = () => {
  //   alert("Quest completed! 🎉");
  // };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen items-center bg-back-base text-secondary-weak px-20 py-10">
      {/* Nav */}
      <div className="flex justify-between w-[80%]">
        <div>
          <p className="font-bold text-3xl text-primary">BOOKMARKD</p>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
          <Link href="/shelves" className="hover:underline">
            Shelves
          </Link>
          <Link href="/activity" className="hover:underline">Activity</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <button
          onClick={handleSignOut}
          className="bg-primary text-secondary-dark px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          <IconLogout stroke={2}/>
        </button>
        </div>
      </div>
      {/* Welcome Text */}
      <div className="grid grid-cols-5 grid-rows-2 w-full items-start pt-10 text-lg">
        <p className="col-start-2 col-span-2 text-2xl text-secondary-strong">
          Welcome back, {user.username}!
        </p>
        <p className="col-start-2 row-start-2">
          Keep reading to log your first book of the month!
        </p>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-2 md:w-[60%] 2xl:w-[40%] pt-10 gap-4">
        <div className="2xl:w-full row-span-2">
          <CurrentlyReadingCard
          />
        </div>
        <div className="2xl:w-full">
          <DailyQuestCard
          quest="Read 20 pages today!"
          progress={75}
          onComplete={() => alert("Quest completed! 🎉")}
          />
        </div>
        <div className="col-start-2 row-start-2 2xl:w-full">
          <ReadingStatsCard />
        </div>
      </div>
      <div className="mt-12 w-[60%] flex flex-col gap-8">
        <FavouriteBooks />
        <TBRList />
      </div>
      <Footer/>
      <ToastContainer theme="colored" />
      
    </div>
  );
};

export default Home;