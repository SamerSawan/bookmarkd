import React from "react";

interface DailyQuestCardProps {
  quest: string;
  progress: number;
  onComplete: () => void;
}

const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
  quest,
  progress,
  onComplete,
}) => {
  return (
    <div className="bg-back-raised rounded-lg shadow-lg p-6 flex flex-col justify-center items-center w-[100%] h-[100%]">
      {/* Card Header */}
      <h3 className="text-xl font-bold mb-4 text-secondary-strong">Daily Quest</h3>
      
      {/* Quest Text */}
      <p className="text-md font-semibold mb-4 text-secondary-strong">{quest}</p>
      
      {/* Coming Soon Message */}
      <div className="flex items-center justify-center w-full h-32 bg-back-overlay rounded-lg text-secondary-strong font-bold text-lg">
        Feature Coming Soon
      </div>
    </div>
  );
};


// const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
//   quest,
//   progress,
//   onComplete,
// }) => {
//   return (
//     <div className="bg-back-raised rounded-lg shadow-lg p-6 flex flex-col justify-between w-[100%] h-[100%]">
//       {/* Card Header */}
//       <h3 className="text-xl font-bold mb-4 self-center text-secondary-strong">Daily Quest</h3>
      
//       {/* Quest Text */}
//       <p className="text-md font-semibold self-center mb-4 text-secondary-strong">{quest}</p>
      
//       {/* Progress Bar */}
//       <div className="w-full bg-stroke-weak rounded-full h-4 mb-4">
//         <div
//           className="bg-gradient-to-r from-[#4C7BD9] to-primary h-4 rounded-full"
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>

//       {/* Progress Feedback */}
//       <div className="flex justify-between text-sm text-stroke-strong mb-4">
//         <span>Progress: {progress}%</span>
//         <span>{progress === 100 ? "Completed!" : "Keep Going!"}</span>
//       </div>

//       {/* Complete Button */}
//       <button
//         onClick={onComplete}
//         className="bg-primary text-secondary-dark py-2 px-4 rounded hover:bg-blue-600 transition"
//       >
//         Complete Quest
//       </button>
//     </div>
//   );
// };

export default DailyQuestCard;
