package handlers

import (
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) GetFavourites(w http.ResponseWriter, r *http.Request) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth Client", err)
		return
	}
	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	token, err := client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	userID := token.UID
	favourites, err := cfg.Db.GetFavourites(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to fetch favorites", err)
		return
	}

	var books []database.Book

	for _, item := range favourites {
		book, err := cfg.Db.GetBook(r.Context(), item.Isbn)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Book is in favourites but not in database", err)
			return
		}
		books = append(books, book)
	}

	respondWithJSON(w, http.StatusOK, books)
}
