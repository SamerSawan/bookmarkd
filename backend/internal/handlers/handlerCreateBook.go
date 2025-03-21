package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

// TODO: Handle invalid publish date input (only the year without a day or a month)

func (cfg *ApiConfig) CreateBook(w http.ResponseWriter, r *http.Request) {
	params := BookParameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}
	isbn13 := ""
	for _, identifier := range params.IndustryIdentifiers {
		if identifier.Type == "ISBN_13" {
			isbn13 = identifier.Identifier
			break
		}
	}
	if isbn13 == "" {
		respondWithError(w, http.StatusBadRequest, "Invalid ISBN. Expected ISBN 13. Got nothing.", fmt.Errorf("No valid ISBN found"))
		return
	}
	_, err := cfg.Db.GetBook(r.Context(), isbn13)
	if err == nil {
		respondWithError(w, http.StatusConflict, "Book already exists!", err)
		return
	}

	var parsedTime time.Time
	if params.PublishedDate == "" {
		fmt.Println("No PublishedDate provided. Skipping date parsing.")
	} else {
		var err error
		parsedTime, err = parseTime(params.PublishedDate)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Failed to parse date into time", err)
			return
		}
		fmt.Println("Parsed Publish Date:", parsedTime)
	}

	book, err := cfg.Db.CreateBook(r.Context(), database.CreateBookParams{
		Isbn:          isbn13,
		Title:         params.Title,
		Author:        params.Authors[0],
		CoverImageUrl: params.ImageLinks.Thumbnail,
		PublishDate:   sql.NullTime{Time: parsedTime, Valid: !parsedTime.IsZero()},
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
		PublishDate:   book.PublishDate.Time,
		CoverImageURL: book.CoverImageUrl,
		Pages:         book.Pages,
		Description:   book.Description})
}
