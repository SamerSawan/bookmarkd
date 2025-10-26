export type Review = {
    id: string;
    isbn: string;
    userId: string;
    username: string;
    bookTitle: string;
    coverImageUrl: string;
    stars: number;
    recommended: boolean;
    content: string;
    createdAt: string;
}