"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/util/Navbar";
import { Review } from "@/types/review";
import reviewService from "@/services/reviewService";
import ReviewCardWithImage from "@/components/util/ReviewCardWithImage";

const Activity: React.FC = () => {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  
  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const reviewsData = await reviewService.getRecentReviews();
            setReviews(reviewsData);
        } catch (error) {
            console.error(error);
        }
    };
    fetchReviews();
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-back-base text-secondary-weak px-20 py-10">
      <Navbar/>

      {/* Main Content */}
      <div className="w-2/3 self-center">
        <h1 className="text-2xl text-secondary-strong mt-28 mb-10">
          Recent reviews in the community
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-2/3 self-center">
      {reviews ? (
        reviews.map((review, index) => (
          <ReviewCardWithImage key={index} review={review} />
          ))
          ) : (
           <p>This is awkward... No one has reviewed a book in the community yet.</p>
          )}
      </div>
    </div>
  );
};

export default Activity;
