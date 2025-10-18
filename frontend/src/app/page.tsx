"use client"
import React, { useEffect, useState } from "react";
import CurrentlyReadingCard from "@/components/CurrentlyReadingCard";
import FavouriteBooks from "@/components/FavouriteBooks";
import TBRList from "@/components/ToBeRead";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { IconBook, IconBookmark, IconCircleCheck, IconStar } from '@tabler/icons-react';
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { useUser } from "./context/UserContext";
import LoadingSpinner from "@/components/util/LoadingSpinner";
import Navbar from "@/components/util/Navbar";

type User = {
  id: string;
  email: string;
  username: string;
};

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { shelves, currentlyReading, loading } = useUser();

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
        router.push("/about");
      }
    });
    return () => unsubscribe();
  }, [router]);
  
  // const handleCompleteQuest = () => {
  //   alert("Quest completed! 🎉");
  // };

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //     setUser(null);
  //     router.push("/login");
  //   } catch (error) {
  //     console.error("Error signing out:", error);
  //   }
  // };



  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-secondary">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak">
      {/* Top Navigation */}
      <div className="px-6 md:px-12 lg:px-20 py-6 md:py-10">
        <div className="mb-8">
          <Navbar />
        </div>

        {/* Hero Section */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-strong mb-2 md:mb-3">
            Welcome back, {user.username}!
          </h1>
          <p className="text-secondary text-base md:text-lg">
            Continue your reading journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-back-raised border border-stroke-weak/50 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <IconBook className="text-primary" size={28} stroke={2} />
              </div>
              <div>
                <p className="text-secondary-weak text-sm">Currently Reading</p>
                <p className="text-2xl font-bold text-secondary-strong">{currentlyReading?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-back-raised border border-stroke-weak/50 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-success/20 p-3 rounded-lg">
                <IconCircleCheck className="text-success" size={28} stroke={2} />
              </div>
              <div>
                <p className="text-secondary-weak text-sm">Books Read</p>
                <p className="text-2xl font-bold text-secondary-strong">
                  {shelves?.find(s => s.name === "Read")?.books?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-back-raised border border-stroke-weak/50 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-warning/20 p-3 rounded-lg">
                <IconBookmark className="text-warning" size={28} stroke={2} />
              </div>
              <div>
                <p className="text-secondary-weak text-sm">To Be Read</p>
                <p className="text-2xl font-bold text-secondary-strong">
                  {shelves?.find(s => s.name === "To Be Read")?.books?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content - Single Column with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Column - Currently Reading (Featured) */}
          <div className="lg:col-span-8">
            <CurrentlyReadingCard />
          </div>

          {/* Sidebar - Quick Actions & Reading Tip */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-back-raised border border-stroke-weak/50 rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-secondary-strong mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/search"
                  className="flex items-center gap-3 p-3 rounded-lg bg-back-overlay hover:bg-primary/10
                             hover:border-primary/30 border border-transparent transition-all group"
                >
                  <IconBook className="text-primary group-hover:scale-110 transition-transform" size={20} stroke={2} />
                  <span className="text-secondary-weak group-hover:text-primary transition-colors text-sm">Add a new book</span>
                </Link>
                <Link
                  href="/shelves"
                  className="flex items-center gap-3 p-3 rounded-lg bg-back-overlay hover:bg-primary/10
                             hover:border-primary/30 border border-transparent transition-all group"
                >
                  <IconBookmark className="text-primary group-hover:scale-110 transition-transform" size={20} stroke={2} />
                  <span className="text-secondary-weak group-hover:text-primary transition-colors text-sm">View all shelves</span>
                </Link>
                <Link
                  href="/activity"
                  className="flex items-center gap-3 p-3 rounded-lg bg-back-overlay hover:bg-primary/10
                             hover:border-primary/30 border border-transparent transition-all group"
                >
                  <IconStar className="text-primary group-hover:scale-110 transition-transform" size={20} stroke={2} />
                  <span className="text-secondary-weak group-hover:text-primary transition-colors text-sm">See community activity</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites and TBR Grid */}
        <div className="space-y-8">
          <FavouriteBooks />
          <TBRList />
        </div>
      </div>

      <Footer/>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default Home;