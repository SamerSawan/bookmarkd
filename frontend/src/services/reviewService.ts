import axiosInstance from "@/utils/axiosInstance";
import { auth } from "../../firebase";
import { Review } from "@/types/review";

class ReviewService {
    private async getAuthHeaders() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Not authenticated")
        }

        const idToken = await user.getIdToken()
        return { Authorization: `Bearer ${idToken}` }
    }

    /**
     * Create a new review for a book
     * @param isbn - Book ISBN
     * @param review - Review text content (optional)
     * @param stars - Star rating (1-5)
     * @param recommended - Whether the book is recommended (optional, null if not specified)
     */
    async createReview(isbn: string, review: string | null, stars: number, recommended: boolean | null): Promise<Review> {
        try {
            const headers = await this.getAuthHeaders()
            const res = await axiosInstance.post('/reviews', {
                isbn,
                review,
                stars,
                recommended
            }, { headers })
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create review')
        }
    }

    /**
     * Get recent reviews from all users
     * @param limit - Number of reviews to fetch (default 20)
     * @param offset - Offset for pagination (default 0)
     */
    async getRecentReviews(limit: number = 20, offset: number = 0): Promise<Review[]> {
        try {
            const res = await axiosInstance.get(`/reviews/recent?limit=${limit}&offset=${offset}`)
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error("Failed to fetch recent reviews")
        }
    }

    /**
     * Get all reviews for a specific book
     * @param isbn - Book ISBN
     */
    async getBookReviews(isbn: string): Promise<Review[]> {
        try {
            const res = await axiosInstance.get(`/reviews?isbn=${isbn}`)
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to fetch reviews for book: ${isbn}`)
        }
    }

}

export default new ReviewService()