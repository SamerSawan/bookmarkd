package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func parseTime(publish_date string) (time.Time, error) {
	// Attempt to parse with full date (YYYY-MM-DD)
	parsedTime, err := time.Parse("2006-01-02", publish_date)
	if err == nil {
		return parsedTime, nil
	}

	// Attempt to parse with year and month (YYYY-MM)
	parsedTime, err = time.Parse("2006-01", publish_date)
	if err == nil {
		return parsedTime, nil
	}

	// Attempt to parse with year only (YYYY)
	parsedTime, err = time.Parse("2006", publish_date)
	if err == nil {
		return parsedTime, nil
	}

	return time.Time{}, fmt.Errorf("failed to parse publish date: %s", publish_date)
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
		PublishDate:   sql.NullTime{Time: parsedTime, Valid: !parsedTime.IsZero()},
		Pages:         int32(bookParams.PageCount),
		Description:   bookParams.Description})
	if err != nil {
		return fmt.Errorf("Failed to create book and insert into database")
	}
	return nil
}

func (cfg *ApiConfig) Authenticate(r *http.Request) (string, int, string, error) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		return "", http.StatusInternalServerError, "Failed to initialize Firebase Auth Client", err
	}

	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	token, err := client.VerifyIDToken(r.Context(), authHeader)

	if err != nil {
		return "", http.StatusUnauthorized, "Invalid Firebase ID Token", err
	}

	return token.UID, http.StatusOK, "", nil
}

func (cfg *ApiConfig) MoveToReadShelf(r *http.Request, userID, isbn string) error {
	shelves, err := cfg.Db.GetShelvesContainingBook(r.Context(), database.GetShelvesContainingBookParams{BookIsbn: isbn, UserID: userID})
	if err != nil {
		return err
	}

	inReadShelf := false
	for _, value := range shelves {
		shelf, err := cfg.Db.GetShelf(r.Context(), value)
		if err != nil {
			return err
		}
		if shelf.Name == "Read" {
			inReadShelf = true
			continue
		}
		err = cfg.Db.RemoveBookFromShelf(r.Context(), database.RemoveBookFromShelfParams{ShelfID: shelf.ID, BookIsbn: isbn})
		if err != nil {
			fmt.Printf("[WARNING] Failed to remove book: %s from shelf: %s. Error: %s\n", isbn, shelf.ID, err.Error())
		}
	}

	if !inReadShelf {
		shelf, err := cfg.Db.GetReadShelf(r.Context(), userID)
		if err != nil {
			return err
		}

		_, err = cfg.Db.GetBook(r.Context(), isbn)
		if err != nil {
			err = insertBook(isbn, cfg, r)
			if err != nil {
				return err
			}
		}
		_, err = cfg.Db.AddBookToShelf(r.Context(), database.AddBookToShelfParams{ShelfID: shelf, BookIsbn: isbn})
		if err != nil {
			return err
		}
	}

	return nil
}
