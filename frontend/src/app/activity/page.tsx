"use client";
import Link from "next/link";
import React from "react";

const Activity: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak">
      {/* Navbar */}
      <div className="flex self-start justify-between w-full px-20 pt-10">
        <div>
          <Link href="/" className="font-bold text-3xl text-primary hover:underline">BOOKMARKD</Link>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
          <Link href="/shelves" className="hover:underline">Shelves</Link>
          <Link href="/activity" className="hover:underline">Activity</Link>
          <Link href="/search" className="hover:underline">Search</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-center text-secondary-strong text-3xl">
          This feature is coming soon
        </h1>
      </div>
    </div>
  );
};

export default Activity;
