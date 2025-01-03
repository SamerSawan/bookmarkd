package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) RemoveFavourite(w http.ResponseWriter, r *http.Request) {
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
		ISBN string `json:"isbn"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	err = cfg.Db.RemoveFavourite(r.Context(), database.RemoveFavouriteParams{
		UserID: userID,
		Isbn:   params.ISBN,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to remove favorite", err)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Book removed from favorites"})
}
