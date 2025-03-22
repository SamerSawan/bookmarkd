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
	respondWithJSON(w, http.StatusOK, reviews)

}
