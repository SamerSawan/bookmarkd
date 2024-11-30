import React from "react";

interface ReadingStatsCardProps {
  streak: number; // Streak in days
  booksReadThisMonth: number; // Books read this month
  booksReadThisYear: number; // Books read this year
  pagesReadToday: number; // Pages read today
  yearlyGoal: number; // Yearly reading goal
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
    <div className="bg-[#334155] rounded-lg shadow-lg p-6 flex flex-col justify-between w-[100%] h-[100%]">
      {/* Card Header */}
      <h3 className="text-xl font-bold mb-4">Reading Stats</h3>

      {/* Stats */}
      <ul className="space-y-2 text-sm">
        <li>📅 Streak: {streak} days</li>
        <li>📘 Books Read This Month: {booksReadThisMonth}</li>
        <li>📚 Books Read This Year: {booksReadThisYear}</li>
        <li>📖 Pages Read Today: {pagesReadToday}</li>
      </ul>

      {/* Yearly Goal Progress */}
      <div className="mt-4">
        <p className="text-sm mb-2">Yearly Goal Progress: {yearlyProgress}%</p>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-teal-500 h-4 rounded-full"
            style={{ width: `${yearlyProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ReadingStatsCard;
