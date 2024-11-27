package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func parseTime(publish_date string) (time.Time, error) {
	parsedTime, err := time.Parse("2006-01-02", publish_date)
	if err != nil {
		return time.Time{}, fmt.Errorf("Failed to parse date into time object")
	}
	return parsedTime, nil
}

// TODO: Add a way to make sure that we're getting the right ISBN from the response from the API. Limit response to top 10 related searches
// TODO: Test search with multiple different ISBNs to ensure that if the ISBN exists, itll be in the top 10 results.
func insertBook(isbn string, cfg *ApiConfig, r *http.Request) error {
	baseURL := "https://www.googleapis.com/books/v1/volumes"
	fullURL := fmt.Sprintf("%s?q=%s&key=%s", baseURL, isbn, cfg.ApiKey)
	resp, err := http.Get(fullURL)
	if err != nil {
		return fmt.Errorf("Failed to fetch books from GoogleBooks")
	}
	decoder := json.NewDecoder(resp.Body)
	params := BookResponse{}
	if err := decoder.Decode(&params); err != nil {
		return fmt.Errorf("Failed to decode response")
	}
	if len(params.Items) == 0 {
		return fmt.Errorf("Invalid ISBN")
	}
	bookParams := params.Items[0].VolumeInfo

	isbn13 := ""
	for _, identifier := range bookParams.IndustryIdentifiers {
		if identifier.Type == "ISBN_13" {
			isbn13 = identifier.Identifier
			break
		}
	}
	if isbn13 == "" {
		return fmt.Errorf("ISBN_13 not found for book with provided ISBN: %s", isbn)
	}

	parsedTime, err := parseTime(bookParams.PublishedDate)
	_, err = cfg.Db.CreateBook(r.Context(), database.CreateBookParams{
		Isbn:          isbn13,
		Title:         bookParams.Title,
		Author:        bookParams.Authors[0],
		CoverImageUrl: bookParams.ImageLinks.Thumbnail,
		PublishDate:   parsedTime,
		Pages:         int32(bookParams.PageCount),
		Description:   bookParams.Description})
	if err != nil {
		return fmt.Errorf("Failed to create book and insert into database")
	}
	fmt.Println("Book successfully inserted into database")
	fmt.Println("----------------------------------------")
	return nil
}
