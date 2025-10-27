import React, { useState, useEffect } from "react";
import { IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react';


interface StarRatingProps {
  onRatingChange: (rating: number) => void;
  initialRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ onRatingChange, initialRating = 0 }) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(initialRating);

  useEffect(() => {
    setRating(initialRating);
    setHover(initialRating);
  }, [initialRating]);

  const handleClick = (value: number) => {
    setRating(value);
    onRatingChange(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const newHover = x < width / 2 ? index + 0.5 : index + 1;
    setHover(newHover);
  };

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <button
            key={starIndex}
            type="button"
            onClick={() => handleClick(hover)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => setHover(rating)}
            className="focus:outline-none"
          >
            {hover >= starIndex ? (
                <IconStarFilled
                    stroke={2}
                    className="cursor-pointer transition-colors text-yellow-400"
                />
            ) : hover >= starIndex - 0.5 ? (
                <IconStarHalfFilled
                stroke={2}
                className="cursor-pointer transition-colors text-yellow-400"
                />
            ) : (
                <IconStarFilled 
                stroke={2}
                className="cursor-pointer transition-colors text-gray-400"
                />
            )
        }
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
