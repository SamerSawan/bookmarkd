package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
)

type PaginatedBookResponse struct {
	TotalResults int                                   `json:"totalResults"`
	Items        []struct{ VolumeInfo BookParameters } `json:"items"`
}

func (cfg *ApiConfig) Search(w http.ResponseWriter, r *http.Request) {
	baseURL := "https://www.googleapis.com/books/v1/volumes"

	query := r.URL.Query().Get("q")
	startIndex := r.URL.Query().Get("startIndex")
	if startIndex == "" {
		startIndex = "0"
	}

	if query == "" {
		respondWithError(w, http.StatusBadRequest, "Missing query parameter", nil)
		fmt.Println("Search query is empty")
		return
	}

	// Check if the query is an ISBN-10 or ISBN-13
	if isISBN(query) {
		query = fmt.Sprintf("isbn:%s", query)
	}

	fullURL := fmt.Sprintf("%s?q=%s&startIndex=%s&key=%s", baseURL, query, startIndex, cfg.ApiKey)
	result := BookResponse{}
	resp, err := http.Get(fullURL)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to make GET request (search books): %w", err)
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()

	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(&result); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode response: %w", err)
		fmt.Println(err)
		return
	}

	respondWithJSON(w, http.StatusOK, PaginatedBookResponse{result.TotalItems, result.Items})
}

// Helper function to check if the query is an ISBN-10 or ISBN-13
func isISBN(query string) bool {
	isbn10Pattern := `^\d{9}[0-9X]$` // 9 digits followed by a digit or 'X'
	isbn13Pattern := `^\d{13}$`      // 13 digits
	return regexp.MustCompile(isbn10Pattern).MatchString(query) || regexp.MustCompile(isbn13Pattern).MatchString(query)
}
