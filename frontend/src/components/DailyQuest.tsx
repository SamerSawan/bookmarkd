import React from "react";

interface DailyQuestCardProps {
  quest: string;
  progress: number; // Current progress as a percentage (0 to 100)
  onComplete: () => void;
}

const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
  quest,
  progress,
  onComplete,
}) => {
  return (
    <div className="bg-[#F7F5FA] rounded-lg shadow-lg p-6 flex flex-col justify-between w-[100%] h-[100%]">
      {/* Card Header */}
      <h3 className="text-xl font-bold mb-4 self-center">Daily Quest</h3>
      
      {/* Quest Text */}
      <p className="text-md font-semibold self-center mb-4">{quest}</p>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
        <div
          className="bg-gradient-to-r from-[#ea544b] to-[#8E13FF] h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Feedback */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>Progress: {progress}%</span>
        <span>{progress === 100 ? "Completed!" : "Keep Going!"}</span>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        className="bg-[#8E13FF] text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Complete Quest
      </button>
    </div>
  );
};

export default DailyQuestCard;
