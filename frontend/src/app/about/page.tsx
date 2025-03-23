"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";


const Activity: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak px-20 py-10">
      <div className="flex justify-between self-center w-full">
        <div>
            <Link href="/" className="font-bold text-3xl text-primary hover:underline">
            BOOKMARKD
            </Link>
        </div>
        <div className="flex flex-row gap-16 text-2xl text-primary">
            <Link href="/login" className="hover:underline">Login</Link>
        </div>
    </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 bg-back-base text-secondary-strong">
      <Image
        src="/book_splash.png"
        alt="Decorative book splash"
        fill
        sizes="100vw"
        priority
        className="object-contain opacity-10 pointer-events-none z-0"
      />
        <div className="max-w-[1024px] w-full flex flex-row justify-between gap-12">
            {[
            {
                title: "Looking to log your reads?",
                text: "Bookmarkd is a reading tracker right at your fingertips. Keep track of every book you've ever read, even the one you still haven't finished from 4 years ago.",
            },
            {
                title: "Enjoy tracking your reading goals?",
                text: "Create your very own personalized reading goal. Whether it’s yearly or monthly, Bookmarkd makes sure to help you reach that goal.",
            },
            {
                title: "Share your love for literature",
                text: "Write reviews and broaden your friend’s horizons with all your favourite picks. Make sure your voice is heard and pick out your favourites today!",
            },
            ].map((item, index) => (
            <div key={index} className="flex flex-col items-start max-w-[280px]">
                <h2 className="text-xl font-bold mb-3 leading-snug max-w-[320px]">
                {item.title}
                </h2>
                <p className="text-secondary-weak leading-relaxed max-w-[250px]">
                {item.text}
                </p>
            </div>
            ))}
        </div>
        <Link href="/register" className="text-2xl mt-20 text-primary hover:underline hover:cursor-pointer">
            Join other readers on Bookmarkd now!
        </Link>
      </div>

    </div>
  );
};

export default Activity;
