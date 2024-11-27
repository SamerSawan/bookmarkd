package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) UpdateBookProgress(w http.ResponseWriter, r *http.Request) {
	user_id_string := r.PathValue("user_id")
	user_id, err := uuid.Parse(user_id_string)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to parse user_id into uuid", err)
		return
	}

	isbn := r.PathValue("isbn")
	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "Missing ISBN parameter", nil)
		return
	}

	type parameters struct {
		Progress int `json:"progress"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	if params.Progress < 0 {
		respondWithError(w, http.StatusBadRequest, "Progress cannot be negative", nil)
		return
	}

	user_book, err := cfg.Db.UpdateBookProgress(r.Context(), database.UpdateBookProgressParams{UserID: user_id, Isbn: isbn, Progress: sql.NullInt32{Int32: int32(params.Progress), Valid: true}})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to update book progress", err)
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
