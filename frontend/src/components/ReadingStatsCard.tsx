import React from "react";

interface ReadingStatsCardProps {
  streak: number;
  booksReadThisMonth: number; 
  booksReadThisYear: number;
  pagesReadToday: number;
  yearlyGoal: number;
}

const ReadingStatsCard: React.FC<ReadingStatsCardProps> = ({
  streak,
  booksReadThisMonth,
  booksReadThisYear,
  pagesReadToday,
  yearlyGoal,
}) => {
  // Calculate yearly progress as a percentage
  const yearlyProgress = Math.min(
    Math.round((booksReadThisYear / yearlyGoal) * 100),
    100
  );

  return (
    <div className="bg-back-raised rounded-lg shadow-lg p-6 flex flex-col justify-between w-[100%] h-[100%]">
      {/* Card Header */}
      <h3 className="text-xl font-bold mb-4 self-center text-secondary-strong">Reading Stats</h3>

      {/* Stats */}
      <ul className="space-y-2 text-sm text-secondary-weak">
        <li>📅 Streak: {streak} days</li>
        <li>📘 Books Read This Month: {booksReadThisMonth}</li>
        <li>📚 Books Read This Year: {booksReadThisYear}</li>
        <li>📖 Pages Read Today: {pagesReadToday}</li>
      </ul>
    </div>
  );
};

export default ReadingStatsCard;
