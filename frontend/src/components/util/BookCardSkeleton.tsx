import React from 'react';

const BookCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex text-left bg-back-raised px-6 pt-6 pb-4 rounded-lg shadow-card animate-pulse">
      {/* Book cover skeleton */}
      <div className="w-32 h-48 bg-back-overlay rounded-lg" />

      <div className="ml-6 flex flex-col justify-between w-full">
        <div className="space-y-3">
          {/* Title skeleton */}
          <div className="h-6 bg-back-overlay rounded w-3/4" />

          {/* Author skeleton */}
          <div className="h-4 bg-back-overlay rounded w-1/2" />

          {/* Description skeleton */}
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-back-overlay rounded w-full" />
            <div className="h-3 bg-back-overlay rounded w-full" />
            <div className="h-3 bg-back-overlay rounded w-5/6" />
          </div>

          {/* Metadata skeleton */}
          <div className="flex gap-4 mt-4">
            <div className="h-4 bg-back-overlay rounded w-20" />
            <div className="h-4 bg-back-overlay rounded w-24" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <div className="h-10 bg-back-overlay rounded w-32" />
        </div>
      </div>

      {/* Star skeleton */}
      <div className="absolute top-4 right-4 w-6 h-6 bg-back-overlay rounded" />
    </div>
  );
};

export default BookCardSkeleton;
