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
    <div className="min-h-screen bg-back-base text-secondary-weak flex flex-col">
      <div className="px-20 py-10">
        <Navbar/>
      </div>

      {/* Main Content - Centered, Max Width */}
      <div className="w-full max-w-[1400px] mx-auto px-20">
        {/* Header section */}
        <div className="flex gap-12 items-start mb-16">
          {/* Profile Image */}
          <div>
            <Image
              src={user.profileImageUrl || "/default-avatar.jpg"}
              alt={`${user.username}'s avatar`}
              width={140}
              height={140}
              className="rounded-full object-cover aspect-square"
            />
          </div>

          {/* Name + Bio + Stats */}
          <div className="flex flex-col gap-2 relative w-full">
            {currentUser?.username === user.username && (
              <button
                onClick={() => setShowModal(true)}
                className="absolute top-0 right-0 text-sm text-primary hover:text-primary-light transition-colors"
              >
                Edit Profile
              </button>
            )}
            <h1 className="text-4xl font-bold text-white">{user.username}</h1>
            <p className="text-secondary-weak">@{user.username}</p>
            <p className="text-secondary mt-2">{user.bio || "No bio yet."}</p>

            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-2xl font-semibold text-white">{user.numberOfBooksRead}</p>
                <p className="text-sm text-secondary-weak">Books Read</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{user.avgRating ?? "—"}</p>
                <p className="text-sm text-secondary-weak">Avg Rating</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{user.numberOfReviewsWritten}</p>
                <p className="text-sm text-secondary-weak">Reviews Written</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/30 mb-12"></div>

        {/* Favourites */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Favourite Books</h2>
          {user.favourites && user.favourites.length > 0 ? (
            <ProfileFavouriteBooks username={user.username} favourites={user.favourites} />
          ) : (
            <div className="flex items-center justify-center py-12 bg-slate-800/20 rounded-lg border border-slate-700/30">
              <p className="text-secondary-weak">No favourite books yet.</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/30 mb-12"></div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Reviews</h2>
          {user.reviews && user.reviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              {user.reviews.map((review, index) => (
                <ReviewCardWithImage key={index} review={review} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 bg-slate-800/20 rounded-lg border border-slate-700/30">
              <p className="text-secondary-weak">No reviews yet.</p>
            </div>
          )}
        </div>
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
