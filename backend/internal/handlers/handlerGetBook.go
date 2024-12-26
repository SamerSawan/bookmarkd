package handlers

import (
	"encoding/json"
	"net/http"
)

func (cfg *ApiConfig) GetBook(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		ISBN string `json:"isbn"`
	}

	params := parameters{}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	book, err := cfg.Db.GetBook(r.Context(), params.ISBN)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Book does not exist!", err)
		return
	}

	respondWithJSON(w, http.StatusOK, Book{ISBN: book.Isbn, Title: book.Title, Author: book.Author, PublishDate: book.PublishDate, CoverImageURL: book.CoverImageUrl, Pages: book.Pages, Description: book.Description})
}
