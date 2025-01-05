import React from "react";

const ReadingStatsCard: React.FC = () => {
  return (
    <div className="bg-back-raised rounded-lg shadow-lg p-6 flex flex-col justify-center items-center w-[100%] h-[100%]">
      {/* Card Header */}
      <h3 className="text-xl font-bold mb-4 text-secondary-strong">Reading Stats</h3>
      
      {/* Coming Soon Message */}
      <div className="flex items-center justify-center w-full h-32 bg-back-overlay rounded-lg text-secondary-strong font-bold text-lg">
        Feature Coming Soon
      </div>
    </div>
  );
};

export default ReadingStatsCard;


// import React from "react";
// import { IconFlame, IconBook, IconBooks, IconBook2 } from '@tabler/icons-react';

// interface ReadingStatsCardProps {
//   streak: number;
//   booksReadThisMonth: number; 
//   booksReadThisYear: number;
//   pagesReadToday: number;
//   yearlyGoal: number;
// }

// const ReadingStatsCard: React.FC<ReadingStatsCardProps> = ({
//   streak,
//   booksReadThisMonth,
//   booksReadThisYear,
//   pagesReadToday,
//   yearlyGoal,
// }) => {
//   // Calculate yearly progress as a percentage
//   const yearlyProgress = Math.min(
//     Math.round((booksReadThisYear / yearlyGoal) * 100),
//     100
//   );

//   return (
//     <div className="bg-back-raised rounded-lg shadow-lg p-6 flex flex-col justify-between w-[100%] h-[100%]">
//       {/* Card Header */}
//       <h3 className="text-xl font-bold mb-4 self-center text-secondary-strong">Reading Stats</h3>

//       {/* Stats */}
//       <ul className="space-y-2 text-sm text-secondary-weak">
//         <li className="flex flex-row items-center justify-center gap-1"><IconFlame/> Streak: {streak} days</li>
//         <li className="flex flex-row items-center justify-center gap-1"><IconBook2/> Books Read This Month: {booksReadThisMonth}</li>
//         <li className="flex flex-row items-center justify-center gap-1"><IconBooks/> Books Read This Year: {booksReadThisYear}</li>
//         <li className="flex flex-row items-center justify-center gap-1"><IconBook/> Pages Read Today: {pagesReadToday}</li>
//       </ul>
//     </div>
//   );
// };

// export default ReadingStatsCard;
