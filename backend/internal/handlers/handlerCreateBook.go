package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

// TODO: Handle checking for existence before creation to return appropriate error
// TODO: Handle invalid publish date input (only the year without a day or a month)

func (cfg *ApiConfig) CreateBook(w http.ResponseWriter, r *http.Request) {
	params := BookParameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}
	_, err := cfg.Db.GetBook(r.Context(), params.IndustryIdentifiers[1].Identifier)
	if err == nil {
		respondWithError(w, http.StatusConflict, "Book already exists!", err)
		return
	}
	parsedTime, err := time.Parse("2006-01-02", params.PublishedDate)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to parse date into time", err)
		return
	}
	book, err := cfg.Db.CreateBook(r.Context(), database.CreateBookParams{
		Isbn:          params.IndustryIdentifiers[1].Identifier,
		Title:         params.Title,
		Author:        params.Authors[0],
		CoverImageUrl: params.ImageLinks.Thumbnail,
		PublishDate:   parsedTime,
		Pages:         int32(params.PageCount),
		Description:   params.Description})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create book", err)
		return
	}
	respondWithJSON(w, http.StatusCreated, Book{
		ISBN:          book.Isbn,
		CreatedAt:     book.CreatedAt,
		UpdatedAt:     book.UpdatedAt,
		Title:         book.Title,
		Author:        book.Author,
		PublishDate:   book.PublishDate,
		CoverImageURL: book.CoverImageUrl,
		Pages:         book.Pages,
		Description:   book.Description})
}
