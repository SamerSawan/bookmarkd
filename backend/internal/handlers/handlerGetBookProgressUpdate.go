package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) GetBookProgressUpdate(w http.ResponseWriter, r *http.Request) {
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
	progressUpdates, err := cfg.Db.GetProgressUpdates(r.Context(), database.GetProgressUpdatesParams{Isbn: isbn, UserID: user_id})

	type ProgressUpdateResponse struct {
		ID        uuid.UUID `json:"id"`
		Progress  int       `json:"progress"`
		Comment   string    `json:"comment,omitempty"` // `omitempty` removes empty comments
		CreatedAt time.Time `json:"created_at"`
	}

	var response []ProgressUpdateResponse
	for _, update := range progressUpdates {
		response = append(response, ProgressUpdateResponse{
			ID:        update.ID,
			Progress:  int(update.Progress),
			Comment:   update.Comment.String, // Convert `sql.NullString` to `string`
			CreatedAt: update.CreatedAt.Time,
		})
	}

	respondWithJSON(w, http.StatusOK, response)
}
