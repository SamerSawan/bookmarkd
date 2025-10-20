export type User = {
    id: string;
    username: string;
    email: string;
    bio?: string;
    profileImageUrl?: string;
}


// TODO: Replace any types with Review type and Favourite type
export type UserWithStats = User & {
    numberOfBooksRead: number;
    avgRating: number;
    numberOfReviewsWritten: number;
    reviews: any[];
    favourites: any[];
}