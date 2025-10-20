import { notFound } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";
import userService from "@/services/userService";

type Params = Promise<{username: string}>

export default async function UserProfile({ params }: { params: Params }) {
    const username = (await params).username;
  
    if (!username) return notFound();
  
    try {
      const user = await userService.getUserProfile(username);
  
      if (!user) return notFound();
  
      return <ProfilePage user={user} />;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return notFound();
    }
  }
  
