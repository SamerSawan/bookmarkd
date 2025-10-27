package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
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
		Bio             string `json:"bio"`
		ProfileImageURL string `json:"profileImageUrl"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	updatedUser, err := cfg.Db.UpdateUserProfile(r.Context(), database.UpdateUserProfileParams{
		ID: userID,
		Bio: sql.NullString{
			String: params.Bio,
			Valid:  params.Bio != "",
		},
		ProfileImageUrl: sql.NullString{
			String: params.ProfileImageURL,
			Valid:  params.ProfileImageURL != "",
		},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to update profile", err)
		return
	}

	type response struct {
		ID              string `json:"id"`
		Email           string `json:"email"`
		Username        string `json:"username"`
		Bio             string `json:"bio"`
		ProfileImageURL string `json:"profileImageUrl"`
	}

	respondWithJSON(w, http.StatusOK, response{
		ID:              updatedUser.ID,
		Email:           updatedUser.Email,
		Username:        updatedUser.Username,
		Bio:             updatedUser.Bio.String,
		ProfileImageURL: updatedUser.ProfileImageUrl.String,
	})
}
