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
	avgRatingResult, err := cfg.Db.GetAverageRatingByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get average rating", err)
		return
	}

	var avgRating float64
	if avgRatingResult != nil {
		switch v := avgRatingResult.(type) {
		case float64:
			avgRating = v
		case string:
			// Handle string conversion if needed
			avgRating = 0
		default:
			avgRating = 0
		}
	}
	reviewsRows, err := cfg.Db.GetReviewsByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get user's reviews", err)
		return
	}

	reviews := make([]Review, 0, len(reviewsRows))
	for _, rev := range reviewsRows {
		coverImageUrl := rev.CoverImageUrl
		if coverImageUrl == "" {
			coverImageUrl = "https://via.placeholder.com/120x180"
		}

		createdAt := ""
		if rev.CreatedAt.Valid {
			createdAt = rev.CreatedAt.Time.Format("2006-01-02T15:04:05Z")
		}

		reviews = append(reviews, Review{
			ID:            rev.ID.String(),
			Isbn:          rev.Isbn,
			UserId:        user.ID,
			Username:      rev.Username,
			BookTitle:     rev.Title,
			CoverImageUrl: coverImageUrl,
			Stars:         rev.Stars.Float64,
			Recommended:   rev.Recommended.Bool,
			Content:       rev.Review.String,
			CreatedAt:     createdAt,
		})
	}

	reviewCount, err := cfg.Db.CountReviewsWrittenByUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to count reviews written", err)
		return
	}
	favouritesRows, err := cfg.Db.GetFavouritesVerbose(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get favourites", err)
		return
	}

	var favourites []Book
	for _, fav := range favouritesRows {
		coverImageUrl := fav.CoverImageUrl
		if coverImageUrl == "" {
			coverImageUrl = "https://via.placeholder.com/100x150"
		}

		favourites = append(favourites, Book{
			ISBN:          fav.Isbn,
			Title:         fav.Title,
			Author:        fav.Author,
			CoverImageURL: coverImageUrl,
			PublishDate:   fav.PublishDate.Time,
			Pages:         fav.Pages,
			Description:   fav.Description,
		})
	}

	var bio *string
	if user.Bio.Valid && user.Bio.String != "" {
		bio = &user.Bio.String
	}

	var profileImageURL *string
	if user.ProfileImageUrl.Valid && user.ProfileImageUrl.String != "" {
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
