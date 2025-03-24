package handlers

import (
	"net/http"
	"strings"
)

func (cfg *ApiConfig) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
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

	user, err := cfg.Db.GetUserByID(r.Context(), uid)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "User not found", err)
		return
	}

	type UserResponse struct {
		ID              string  `json:"id"`
		Email           string  `json:"email"`
		Username        string  `json:"username"`
		Bio             *string `json:"bio,omitempty"`
		ProfileImageUrl *string `json:"profileImageUrl,omitempty"`
	}

	resp := UserResponse{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
	}

	if user.Bio.Valid {
		resp.Bio = &user.Bio.String
	}
	if user.ProfileImageUrl.Valid {
		resp.ProfileImageUrl = &user.ProfileImageUrl.String
	}

	respondWithJSON(w, http.StatusOK, resp)
}
