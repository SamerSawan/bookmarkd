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

	respondWithJSON(w, http.StatusOK, reviews)
}
