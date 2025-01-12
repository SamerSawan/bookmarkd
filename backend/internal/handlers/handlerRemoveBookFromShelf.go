package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) RemoveBookFromShelf(w http.ResponseWriter, r *http.Request) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth client", err)
		return
	}

	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	_, err = client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	token, err := client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	userID := token.UID

	shelf_id_string := r.PathValue("shelf_id")

	shelf_id, err := uuid.Parse(shelf_id_string)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to parse shelf Id into UUID", err)
		return
	}

	type parameters struct {
		ISBN string `json:"isbn"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	err = cfg.Db.RemoveBookFromShelf(r.Context(), database.RemoveBookFromShelfParams{
		ShelfID:  shelf_id,
		BookIsbn: params.ISBN,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to remove book from shelf", err)
		return
	}
	err = cfg.Db.RemoveUserBook(r.Context(), database.RemoveUserBookParams{UserID: userID, Isbn: params.ISBN})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to remove user book relationship", err)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Book removed from favorites"})
}
