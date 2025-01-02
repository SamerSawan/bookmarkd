package handlers

import (
	"net/http"
	"strings"
)

func (cfg *ApiConfig) GetCurrentlyReading(w http.ResponseWriter, r *http.Request) {
	// Validate Firebase token
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

	// Extract user ID
	userID := token.UID

	// Fetch the most recently updated 'Currently Reading' book
	book, err := cfg.Db.GetLatestCurrentlyReadingBook(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "No currently reading book found", err)
		return
	}

	// Return the book
	respondWithJSON(w, http.StatusOK, book)
}
