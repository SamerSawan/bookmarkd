export interface Book {
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description: string;
    isbn: string;
    cover: string;
    industryIdentifiers?: IndustryIdentifier[];
    pageCount?: number;
    categories?: string[];
    imageLinks?: ImageLinks;
    language?: string;
}

export interface FavBook {
    ID: string;
    Isbn: string;
    Title: string;
    Author: string;
    CoverImageUrl: string;
    PublishDate: string;
    Pages: number;
    Description: string;
  }

export interface FetchedBook {
    author: string;
    coverImageUrl: string;
    description: string;
    isbn: string;
    pages: number;
    publishDate: string;
    title: string
}

export interface IndustryIdentifier {
    type: string;
    identifier: string;
}
  
export interface ImageLinks {
    thumbnail: string;
    smallThumbnail?: string;
}
  
export interface VolumeInfo {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: IndustryIdentifier[];
    pageCount?: number;
    categories?: string[];
    imageLinks?: ImageLinks;
    language?: string;
}
  
export interface BookItem {
    VolumeInfo: VolumeInfo;
}

export interface Shelf {
    id: string;
    name: string;
}

export interface CurrentlyReadingBook {
    isbn: string;
    title: string;
    author: string;
    coverImageUrl: string;
    publishDate: string;
    pages: number;
    description: string;
    progress: number;
}

export interface ProgressUpdates {
    progress: number;
    comment: string;
    created_at: string;
}

export interface Review {
    ID: string;
    Isbn: string;
    UserID: string;
    Username: string;
    Title: string;
    CreatedAt: {
        Time: string;
        Valid: boolean;
    };
    Recommended: {
        Bool: boolean;
        Valid: boolean;
    };
    Review: {
        String: string;
        Valid: boolean;
    };
    Stars: {
        Float64: number;
        Valid: boolean;
    };
    CoverImageUrl: string;
}

export interface UserWithStats {
    id: string;
    username: string;
    bio?: string;
    profileImageUrl?: string;

    numberOfBooksRead: number;
    avgRating: number | null;
    numberOfReviewsWritten: number;

    favourites: FavBook[];
    reviews: Review[];
}

