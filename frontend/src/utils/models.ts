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

export interface FetchedBook {
    author: string;
    cover_image_url: string;
    description: string;
    isbn: string;
    pages: number;
    publish_date: Date;
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

export interface CurrentlyReadingBook {
    Isbn: string;
    Title: string;
    Author: string;
    CoverImageUrl: string;
    PublishDate: string;
    Pages: number;
    Description: string;
    Progress: number;
}

