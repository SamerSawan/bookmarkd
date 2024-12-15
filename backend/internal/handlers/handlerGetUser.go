package handlers

import (
	"net/http"
)

func (cfg *ApiConfig) GetUser(w http.ResponseWriter, r *http.Request) {

	user_id := r.PathValue("user_id")

	user, err := cfg.Db.GetUserByID(r.Context(), user_id)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Error retrieving user", err)
		return
	}
	respondWithJSON(w, http.StatusOK, User{ID: user.ID, Email: user.Email, CreatedAt: user.CreatedAt, UpdatedAt: user.UpdatedAt, Username: user.Username})
}
