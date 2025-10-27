package handlers

import (
	"net/http"
	"strings"
)

type CurrentlyReadingResponse struct {
	Isbn          string `json:"isbn"`
	Title         string `json:"title"`
	Author        string `json:"author"`
	CoverImageUrl string `json:"coverImageUrl"`
	PublishDate   string `json:"publishDate"`
	Pages         int32  `json:"pages"`
	Description   string `json:"description"`
	Progress      int32  `json:"progress"`
}

func (cfg *ApiConfig) GetCurrentlyReading(w http.ResponseWriter, r *http.Request) {
	// Validate Firebase token
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

	// Extract user ID
	userID := token.UID

	books, err := cfg.Db.GetLatestCurrentlyReadingBook(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "No currently reading book found", err)
		return
	}

	var response []CurrentlyReadingResponse
	for _, book := range books {
		publishDate := ""
		if book.PublishDate.Valid {
			publishDate = book.PublishDate.Time.Format("2006-01-02")
		}
		response = append(response, CurrentlyReadingResponse{
			Isbn:          book.Isbn,
			Title:         book.Title,
			Author:        book.Author,
			CoverImageUrl: book.CoverImageUrl,
			PublishDate:   publishDate,
			Pages:         book.Pages,
			Description:   book.Description,
			Progress:      book.Progress,
		})
	}

	respondWithJSON(w, http.StatusOK, response)
}
