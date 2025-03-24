"use client";
import Image from "next/image";
import { useState } from "react";
import { UserWithStats } from "@/utils/models";
import ReviewCardWithImage from "./util/ReviewCardWithImage";
import ProfileFavouriteBooks from "./ProfileFavouriteBooks";
import { useUser } from "@/app/context/UserContext";
import Navbar from "./util/Navbar";

interface Props {
  user: UserWithStats;
}

const ProfilePage: React.FC<Props> = ({ user }) => {
  const { user: currentUser, loading } = useUser();
  const [showModal, setShowModal] = useState(false);
  if (loading) return null;
  return (
    <div className="min-h-screen bg-back-base text-secondary-weak flex justify-center flex-col items-center px-12 py-10">
      <Navbar/>
      {/* Header section */}
      <div className="flex gap-12 items-start my-10">
        {/* Profile Image */}
        <div>
          <Image
            src={user.profileImageUrl || "/default-avatar.jpg"}
            alt={`${user.username}'s avatar`}
            width={120}
            height={120}
            className="rounded-full object-cover aspect-square"
          />
        </div>

        {/* Name + Bio + Stats */}
        <div className="flex flex-col gap-2 relative w-full">
          {currentUser?.username === user.username && (
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-0 right-0 text-sm text-primary hover:underline"
            >
              Edit Profile
            </button>
          )}
          <h1 className="text-3xl font-bold text-secondary-strong">{user.username}</h1>
          <p className="text-secondary-weak text-sm">@{user.username}</p>
          <p className="italic">{user.bio || "No bio yet."}</p>

          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-xl font-semibold">{user.numberOfBooksRead}</p>
              <p className="text-sm text-secondary-weak">Books Read</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{user.avgRating ?? "—"}</p>
              <p className="text-sm text-secondary-weak">Avg Rating</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{user.numberOfReviewsWritten}</p>
              <p className="text-sm text-secondary-weak">Reviews Written</p>
            </div>
          </div>
        </div>
      </div>

      {/* Favourites */}
      <div className="w-3/5">
        <ProfileFavouriteBooks username={user.username} favourites={user.favourites} />
      </div>

      {/* Reviews */}
      <div className="w-3/5 mt-8">
        <h1 className="text-2xl text-secondary-strong font-semibold mb-2">
          {user.username}&apos;s reviews
        </h1>
        {user.reviews.length > 0 ? (
          user.reviews.map((review, index) => (
            <ReviewCardWithImage key={index} review={review} />
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-back-overlay p-6 rounded-xl w-[90%] md:w-[400px] text-secondary-strong shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Profile (This feature is not yet complete)</h2>

            <label className="block mb-2">Bio</label>
            <textarea
              className="w-full p-2 rounded bg-back-raised border border-stroke-weak mb-4"
              placeholder="Update your bio..."
              rows={3}
            />

            <label className="block mb-2">Profile Picture</label>
            <input type="file" accept="image/*" className="mb-4" />

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-sm bg-stroke-weak rounded hover:bg-stroke"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
