package handlers

import (
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

type ShelvesContainingBookResponse struct {
	ShelfIDs []string `json:"shelf_ids"`
}

func (cfg *ApiConfig) GetShelvesContainingBook(w http.ResponseWriter, r *http.Request) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to init Firebase", err)
		return
	}

	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	token, err := client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid ID token", err)
		return
	}

	uid := token.UID

	// Get ISBN from query parameter
	isbn := r.URL.Query().Get("isbn")
	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "ISBN query parameter is required", nil)
		return
	}

	// Get all shelf IDs containing this book for the current user
	shelfUUIDs, err := cfg.Db.GetShelvesContainingBook(r.Context(), database.GetShelvesContainingBookParams{
		BookIsbn: isbn,
		UserID:   uid,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get shelves containing book", err)
		return
	}

	// Convert UUIDs to strings
	shelfIDs := make([]string, len(shelfUUIDs))
	for i, uuid := range shelfUUIDs {
		shelfIDs[i] = uuid.String()
	}

	respondWithJSON(w, http.StatusOK, ShelvesContainingBookResponse{
		ShelfIDs: shelfIDs,
	})
}
