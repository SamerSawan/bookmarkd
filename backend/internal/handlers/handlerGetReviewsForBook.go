package handlers

import (
	"fmt"
	"net/http"
)

func (cfg *ApiConfig) GetReviewsForBook(w http.ResponseWriter, r *http.Request) {
	isbn := r.URL.Query().Get("isbn")
	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "ISBN query parameter is required", nil)
		return
	}

	reviews, err := cfg.Db.GetBookReviews(r.Context(), isbn)
	if err != nil {
		respondWithError(w, http.StatusNotFound, fmt.Sprintf("No reviews were found for book with ISBN: %s", isbn), nil)
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
