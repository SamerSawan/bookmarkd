package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (cfg *ApiConfig) Search(w http.ResponseWriter, r *http.Request) {
	baseURL := "https://www.googleapis.com/books/v1/volumes"

	query := r.URL.Query().Get("q")

	if query == "" {
		respondWithError(w, http.StatusBadRequest, "Missing query parameter", nil)
		return
	}

	fullURL := fmt.Sprintf("%s?q=%s&key=%s", baseURL, query, cfg.ApiKey)
	result := BookResponse{}
	resp, err := http.Get(fullURL)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to make GET request (search books): %w", err)
		return
	}
	defer resp.Body.Close()

	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(&result); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode response: %w", err)
		return
	}
	respondWithJSON(w, http.StatusOK, result.Items)
}
