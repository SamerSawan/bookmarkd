import axiosInstance from "@/utils/axiosInstance";
import { auth } from "../../firebase";
import { User, UserWithStats } from "@/types/user";

class UserService {

    private async getAuthHeaders() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Not authenticated")
        }

        const idToken = await user.getIdToken()
        return { Authorization: `Bearer ${idToken}` }
    }

    /**
     * Get current authenticated user's data
     */
    async getCurrentUser(): Promise<User> {
        try {
            const headers = await this.getAuthHeaders()
            const res = await axiosInstance.get('/users/me', { headers } )
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error("Failed to fetch current user")
        }
    }

    /**
     * Get any user's public profile data by username
     * @param username 
     */
    async getUserProfile(username: string): Promise<UserWithStats> {
        try {
            const res = await axiosInstance.get(`/profile/${username}`)
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to fetch ${username}'s profile`)
        }
    }

    /**
     * Updates current user's profile
     * @param data
     * @returns
     */
    async updateUser(data: Partial<User>): Promise<User> {
        try {
            const headers = await this.getAuthHeaders()
            const res = await axiosInstance.put('/users/me', data, { headers })
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update user data')
        }
    }

    /**
     * Updates current user's profile (bio and profile image)
     * @param bio
     * @param profileImageUrl
     * @returns
     */
    async updateUserProfile(bio?: string, profileImageUrl?: string): Promise<User> {
        try {
            const headers = await this.getAuthHeaders()
            const res = await axiosInstance.put('/users/me/profile', {
                bio: bio || "",
                profileImageUrl: profileImageUrl || ""
            }, { headers })
            return res.data
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update user profile')
        }
    }

}

export default new UserService()