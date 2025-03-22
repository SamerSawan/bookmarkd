package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) CreateReview(w http.ResponseWriter, r *http.Request) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth client", err)
		return
	}

	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	token, err := client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	userID := token.UID

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

	_, err = cfg.Db.UpdateBookStatus(r.Context(), database.UpdateBookStatusParams{UserID: userID, Isbn: params.ISBN, Status: "Read"})

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
	respondWithJSON(w, http.StatusOK, review)
}
