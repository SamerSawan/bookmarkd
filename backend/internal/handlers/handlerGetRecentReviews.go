package handlers

import (
	"net/http"
	"strconv"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) GetRecentReviews(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 20
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset <= 0 {
		offset = 0
	}

	reviews, err := cfg.Db.GetRecentReviews(r.Context(), database.GetRecentReviewsParams{Limit: int32(limit), Offset: int32(offset)})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get reviews", err)
		return
	}

	type ReviewResponse struct {
		ID            string  `json:"id"`
		Isbn          string  `json:"isbn"`
		UserID        string  `json:"userId"`
		Username      string  `json:"username"`
		BookTitle     string  `json:"bookTitle"`
		CoverImageUrl string  `json:"coverImageUrl"`
		Stars         float64 `json:"stars"`
		Recommended   bool    `json:"recommended"`
		Content       string  `json:"content"`
		CreatedAt     string  `json:"createdAt"`
	}

	response := make([]ReviewResponse, len(reviews))
	for i, review := range reviews {
		response[i] = ReviewResponse{
			ID:            review.ID.String(),
			Isbn:          review.Isbn,
			UserID:        review.UserID,
			Username:      review.Username,
			BookTitle:     review.Title,
			CoverImageUrl: review.CoverImageUrl,
			Stars:         review.Stars.Float64,
			Recommended:   review.Recommended.Bool,
			Content:       review.Review.String,
			CreatedAt:     review.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	respondWithJSON(w, http.StatusOK, response)
}
