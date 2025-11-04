package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) CreateReview(w http.ResponseWriter, r *http.Request) {
	userID, status, msg, err := cfg.Authenticate(r)
	if err != nil {
		respondWithError(w, status, msg, err)
		return
	}

	type parameters struct {
		ISBN        string  `json:"isbn"`
		Review      string  `json:"review"`
		Stars       float64 `json:"stars"`
		Recommended bool    `json:"recommended"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	err = cfg.MoveToReadShelf(r, userID, params.ISBN)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to move book to read shelf", err)
		return
	}

	_, err = cfg.Db.UpdateBookStatus(r.Context(), database.UpdateBookStatusParams{UserID: userID, Isbn: params.ISBN, Status: "Read"})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to update book status to read", err)
		return
	}

	review, err := cfg.Db.CreateReview(r.Context(), database.CreateReviewParams{
		Isbn:   params.ISBN,
		UserID: userID,
		Review: sql.NullString{
			String: params.Review,
			Valid:  params.Review != "",
		},
		Stars: sql.NullFloat64{
			Float64: params.Stars,
			Valid:   params.Stars != 0,
		},
		Recommended: sql.NullBool{
			Bool:  params.Recommended,
			Valid: true,
		},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Unable to create review", err)
		return
	}
	respondWithJSON(w, http.StatusOK, Review{ID: review.ID.String(), Isbn: review.Isbn, Stars: review.Stars.Float64, Recommended: review.Recommended.Bool, Content: review.Review.String, CreatedAt: review.CreatedAt.Time.Local().String()})
}
