package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/auth"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (cfg *ApiConfig) CreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode user parameters", err)
		return
	}
	ok := auth.CheckPasswordStrength(params.Password)
	if !ok {
		respondWithError(w, http.StatusBadRequest, "Your password must include at least 1 capital letter, 1 lowercase letter, 1 number and 1 special character", nil)
		return
	}
	hashed_password, err := auth.HashPassword(params.Password)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to hash password.", err)
		return
	}
	user, err := cfg.Db.CreateUser(r.Context(), database.CreateUserParams{Email: params.Email, Password: hashed_password})
	respondWithJSON(w, http.StatusCreated, User{ID: user.ID, Email: user.Email, CreatedAt: user.CreatedAt, UpdatedAt: user.UpdatedAt})

}
