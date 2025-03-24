import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import ProfilePage from "@/components/ProfilePage";

export default async function UserProfile({ params }: { params: { username: string } }) {
    const username = params.username;
  
    if (!username) return notFound();
  
    try {
      const res = await axiosInstance.get(`/profile/${username}`);
      const user = res.data;
  
      if (!user) return notFound();
  
      return <ProfilePage user={user} />;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return notFound();
    }
  }
  
