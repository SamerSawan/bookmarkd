package handlers

import (
	"net/http"
)

func (cfg *ApiConfig) GetUserWithStats(w http.ResponseWriter, r *http.Request) {
	username := r.PathValue("username")
	user, err := cfg.Db.GetUserProfileByUsername(r.Context(), username)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "User not found", err)
		return
	}

	booksRead, err := cfg.Db.CountBooksReadByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to count books read", err)
		return
	}
	avgRating, err := cfg.Db.GetAverageRatingByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get average rating", err)
		return
	}
	reviews, err := cfg.Db.GetReviewsByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get user's reviews", err)
		return
	}
	reviewCount, err := cfg.Db.CountReviewsWrittenByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to count reviews written", err)
		return
	}
	favourites, err := cfg.Db.GetFavouritesVerbose(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get favourites", err)
		return
	}

	var bio *string
	if user.Bio.Valid {
		bio = &user.Bio.String
	}

	var profileImageURL *string
	if user.ProfileImageUrl.Valid {
		profileImageURL = &user.ProfileImageUrl.String
	}

	profile := UserWithStats{
		ID:                     user.ID,
		Username:               user.Username,
		Bio:                    bio,
		ProfileImageURL:        profileImageURL,
		NumberOfBooksRead:      int(booksRead),
		AvgRating:              avgRating,
		Reviews:                reviews,
		Favourites:             favourites,
		NumberOfReviewsWritten: reviewCount,
	}

	respondWithJSON(w, http.StatusOK, profile)
}
