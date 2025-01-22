package handlers

import (
	"net/http"
)

func (cfg *ApiConfig) GetBook(w http.ResponseWriter, r *http.Request) {

	isbn := r.URL.Query().Get("isbn")
	if isbn == "" {
		respondWithError(w, http.StatusBadRequest, "ISBN query parameter is required", nil)
		return
	}

	book, err := cfg.Db.GetBook(r.Context(), isbn)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Book does not exist!", err)
		return
	}

	respondWithJSON(w, http.StatusOK, Book{ISBN: book.Isbn, Title: book.Title, Author: book.Author, PublishDate: book.PublishDate, CoverImageURL: book.CoverImageUrl, Pages: book.Pages, Description: book.Description})
}
