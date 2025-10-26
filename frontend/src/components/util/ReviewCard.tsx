import { Review } from '@/types/review';
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
        <div className="mb-6 p-6 bg-back-raised border border-stroke-weak/50 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 w-full">
            <div className="flex flex-col gap-3 mb-4">
                    <div className="flex flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            {inBook ?
                            (<h4 className="text-lg font-semibold text-secondary-strong">{review.username}</h4>)
                            : (<h4 className="text-lg text-secondary-weak">
                                <Link href={`/${review.username}`} className="text-primary-light font-semibold hover:cursor-pointer hover:underline">
                                    {review.username}
                                </Link> reviewed &quot;<Link href={`/book/${review.isbn}`} className="italic text-primary-light font-semibold hover:cursor-pointer hover:underline">
                                    {review.bookTitle}
                                </Link>&quot;
                            </h4>)}
                        </div>

                        {review.recommended ? (
                            <div className="flex flex-row items-center bg-success/20 px-3 py-1.5 rounded-full gap-2 border border-success/30">
                                <IconThumbUpFilled className="text-success" stroke={2} size={18} />
                                <span className="text-success font-medium text-xs">Recommended</span>
                            </div>
                            ) : (
                            <div className="flex flex-row items-center bg-danger/20 px-3 py-1.5 rounded-full gap-2 border border-danger/30">
                                <IconThumbDownFilled className="text-danger" stroke={2} size={18} />
                                <span className="text-danger font-medium text-xs">Not Recommended</span>
                            </div>
                            )}
                    </div>

                    {renderStars(review.stars)}
            </div>
                        <p className="text-base text-secondary-strong leading-relaxed mb-4 italic">
                            &ldquo;{review.content}&rdquo;
                        </p>
                        <p className="text-xs text-secondary text-right">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
            </div>
    )
}

export default ReviewCard;