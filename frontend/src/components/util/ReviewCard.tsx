import { Review } from '@/utils/models';
import { IconStar, IconStarFilled, IconStarHalfFilled, IconThumbDownFilled, IconThumbUpFilled } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IconStarFilled key={`full-${i}`} className="text-yellow-400" />);
    }
  
    if (hasHalfStar) {
      stars.push(<IconStarHalfFilled key="half" className="text-yellow-400" />);
    }
  
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IconStar key={`empty-${i}`} className="text-gray-400" />);
    }
  
    return <div className="flex flex-row gap-1">{stars}</div>;
};

interface ReviewProps {
    review: Review,
    inBook?: boolean
}

const ReviewCard: React.FC<ReviewProps> = ({ review, inBook = false }) => {
    return (
        <div className="mb-6 p-5 bg-fill rounded-xl shadow-md border border-stroke-weak w-full">
            <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-row justify-between items-center">
                        {inBook ? 
                        (<h4 className="text-xl font-semibold text-secondary-strong">{review.Username}</h4>) 
                        : (<h4 className="text-xl font-semibold text-secondary-strong"><Link href={`/${review.Username}`} className="text-primary hover:cursor-pointer hover:underline">{review.Username}</Link> reviewed &quot;<Link href={`/book/${review.Isbn}`} className="italic text-primary hover:cursor-pointer hover:underline">{review.Title}</Link>&quot;</h4>)}
                        
                        {review.Recommended.Bool ? (
                            <div className="flex flex-row items-center bg-green-100 px-3 py-1 rounded-full gap-2">
                                <IconThumbUpFilled className="text-green-600" stroke={2} />
                                <span className="text-green-800 font-medium text-sm">Recommended</span>
                            </div>
                            ) : (
                            <div className="flex flex-row items-center bg-red-100 px-3 py-1 rounded-full gap-2">
                                <IconThumbDownFilled className="text-red-600" stroke={2} />
                                <span className="text-red-800 font-medium text-sm">Not Recommended</span>
                            </div>
                            )}
                    </div>
                                    
                    {renderStars(review.Stars.Float64)}
            </div>    
                        <p className="text-base text-secondary-strong mb-4">
                            “{review.Review.String}”
                        </p>            
                        <p className="text-xs text-secondary-weak text-right">
                            {new Date(review.CreatedAt.Time).toLocaleDateString('en-CA')}
                        </p>
            </div>
    )
}

export default ReviewCard;