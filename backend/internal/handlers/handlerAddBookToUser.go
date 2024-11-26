package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

// TODO: Check validity of status param
func (cfg *ApiConfig) AddBookToUser(w http.ResponseWriter, r *http.Request) {
	user_id_string := r.PathValue("user_id")
	user_id, err := uuid.Parse(user_id_string)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to parse user_id into uuid", err)
		return
	}
	_, err = cfg.Db.GetUserByID(r.Context(), user_id)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "User with input ID does not exist!", err)
		return
	}

	type parameters struct {
		ISBN   string `json:"isbn"`
		Status string `json:"status"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}
	_, err = cfg.Db.GetBook(r.Context(), params.ISBN)
	if err != nil {
		err = insertBook(params.ISBN, cfg, r)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Failed to insert book", err)
			return
		}
	}

	user_book, err := cfg.Db.AddBookToUser(r.Context(), database.AddBookToUserParams{
		UserID: user_id,
		Isbn:   params.ISBN,
		Status: params.Status,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create user-book relationship", err)
		return
	}
	type response struct {
		ID     uuid.UUID `json:"id"`
		UserID uuid.UUID `json:"user_id"`
		ISBN   string    `json:"isbn"`
		Status string    `json:"status"`
	}
	respondWithJSON(w, http.StatusCreated, response{
		ID:     user_book.ID,
		UserID: user_book.UserID,
		ISBN:   user_book.Isbn,
		Status: user_book.Status})
}
