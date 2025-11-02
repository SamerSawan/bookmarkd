import axiosInstance from "@/utils/axiosInstance";
import { auth } from "../../firebase";

class ShelfService {

    private async getAuthHeaders() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Not authenticated")
        }

        const idToken = await user.getIdToken()
        return { Authorization: `Bearer ${idToken}` }
    }

    /**
     * Get all shelf IDs that contain a specific book for the current user
     * @param isbn - Book ISBN
     * @returns Array of shelf IDs
     */
    async getShelvesContainingBook(isbn: string): Promise<string[]> {
        try {
            const headers = await this.getAuthHeaders();
            const res = await axiosInstance.get(`/shelves/containing-book?isbn=${isbn}`, { headers });
            return res.data.shelf_ids || [];
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch shelves containing book: ${isbn}`);
        }
    }

}

export default new ShelfService();
