package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) CreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		ID       string `json:"id"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode user parameters", err)
		return
	}

	_, err := cfg.Db.GetUserByEmail(r.Context(), params.Email)
	if err == nil {
		respondWithError(w, http.StatusConflict, "Email already in use!", err)
		return
	}
	user, err := cfg.Db.CreateUser(r.Context(), database.CreateUserParams{Email: params.Email, Username: params.Username, ID: params.ID})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create new user.", err)
		return
	}
	respondWithJSON(w, http.StatusCreated, User{ID: user.ID, Email: user.Email, CreatedAt: user.CreatedAt, UpdatedAt: user.UpdatedAt})
}
