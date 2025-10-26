/**
 * Book type returned from backend /users/me/favourites endpoint
 * Represents the full book data structure
 */
export interface Book {
    isbn: string;
    title: string;
    author: string;
    coverImageUrl: string;
    publishDate: string;
    pages: number;
    description: string;
}

/**
 * Favourite book - same as Book for now
 * The backend returns Book[] for the favourites endpoint
 */
export type Favourite = Book;
