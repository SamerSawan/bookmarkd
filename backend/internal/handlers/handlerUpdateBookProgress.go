package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) UpdateBookProgress(w http.ResponseWriter, r *http.Request) {

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
	user_id := token.UID

	isbn := r.PathValue("isbn")
	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "Missing ISBN parameter", nil)
		return
	}

	type parameters struct {
		Progress int    `json:"progress"`
		Comment  string `json:"comment"`
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

	user_book, err := cfg.Db.UpdateBookProgress(r.Context(), database.UpdateBookProgressParams{UserID: user_id, Isbn: isbn, Progress: int32(params.Progress)})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to update book progress", err)
		return
	}

	user_book_progress, err := cfg.Db.UpdateProgressWithComment(r.Context(), database.UpdateProgressWithCommentParams{UserID: user_id, Isbn: isbn, Progress: int32(params.Progress), Comment: sql.NullString{String: params.Comment, Valid: params.Comment != ""}})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create Progress Update with Comment", err)
		return
	}

	type response struct {
		ID         uuid.UUID `json:"id"`
		UserID     string    `json:"user_id"`
		ISBN       string    `json:"isbn"`
		Status     string    `json:"status"`
		Progress   int       `json:"progress"`
		Comment    string    `json:"comment"`
		StartedAt  time.Time `json:"started_at"`
		FinishedAt time.Time `json:"finished_at"`
	}

	respondWithJSON(w, http.StatusOK, response{
		ID:         user_book.ID,
		ISBN:       user_book.Isbn,
		UserID:     user_book.UserID,
		Status:     user_book.Status,
		Progress:   int(user_book.Progress),
		Comment:    user_book_progress.Comment.String,
		StartedAt:  user_book.StartedAt.Time,
		FinishedAt: user_book.FinishedAt.Time})
}
