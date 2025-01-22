"use client";
import React from "react";
import Navbar from "@/components/util/Navbar";

const Activity: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak px-20 py-10">
      <Navbar/>

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
