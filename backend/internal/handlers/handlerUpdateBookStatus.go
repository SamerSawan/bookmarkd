package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) UpdateBookStatus(w http.ResponseWriter, r *http.Request) {
	user_id := r.PathValue("user_id")

	isbn := r.PathValue("isbn")
	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "Missing ISBN parameter", nil)
		return
	}

	type parameters struct {
		Status string `json:"status"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	validStatuses := map[string]bool{
		"To Be Read":        true,
		"Currently Reading": true,
		"Read":              true,
	}
	if !validStatuses[params.Status] {
		respondWithError(w, http.StatusBadRequest, "Invalid status value", nil)
		return
	}

	user_book, err := cfg.Db.UpdateBookStatus(r.Context(), database.UpdateBookStatusParams{
		UserID: user_id,
		Isbn:   isbn,
		Status: params.Status,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to update book status", err)
		return
	}

	type response struct {
		ID         uuid.UUID `json:"id"`
		UserID     uuid.UUID `json:"user_id"`
		ISBN       string    `json:"isbn"`
		Status     string    `json:"status"`
		Progress   int       `json:"progress"`
		StartedAt  time.Time `json:"started_at"`
		FinishedAt time.Time `json:"finished_at"`
	}

	respondWithJSON(w, http.StatusOK, response{
		ID:         user_book.ID,
		ISBN:       user_book.Isbn,
		UserID:     user_book.ID,
		Status:     user_book.Status,
		Progress:   int(user_book.Progress.Int32),
		StartedAt:  user_book.StartedAt.Time,
		FinishedAt: user_book.FinishedAt.Time})
}
