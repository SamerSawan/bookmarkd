package handlers

import (
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) DeleteReview(w http.ResponseWriter, r *http.Request) {
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
	isbn := r.URL.Query().Get("isbn")

	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "ISBN is required", nil)
		return
	}

	err = cfg.Db.DeleteReview(r.Context(), database.DeleteReviewParams{
		Isbn:   isbn,
		UserID: userID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Unable to delete review", err)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Review deleted successfully"})
}
