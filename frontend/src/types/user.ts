import { Review } from "@/types/review"
import { Favourite } from "@/types/book";

export type User = {
    id: string;
    username: string;
    email: string;
    bio?: string;
    profileImageUrl?: string;
}


export type UserWithStats = User & {
    numberOfBooksRead: number;
    avgRating: number;
    numberOfReviewsWritten: number;
    reviews: Review[];
    favourites: Favourite[];
}