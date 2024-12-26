package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

type AddBookToShelfResponse struct {
	ShelfID string `json:"shelf_id"`
	ISBN    string `json:"isbn"`
}

func (cfg *ApiConfig) AddBookToShelf(w http.ResponseWriter, r *http.Request) {
	shelf_id := r.PathValue("shelf_id")

	shelf_uuid, err := uuid.Parse(shelf_id)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Failed to parse shelf_id into uuid", err)
		return
	}

	_, err = cfg.Db.GetShelf(r.Context(), shelf_uuid)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Shelf does not exist!", err)
		return
	}

	type parameters struct {
		ISBN string `json:"isbn"`
	}

	params := parameters{}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	book_shelf, err := cfg.Db.AddBookToShelf(r.Context(), database.AddBookToShelfParams{ShelfID: shelf_uuid, BookIsbn: params.ISBN})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create book-shelf relationship", err)
		return
	}

	respondWithJSON(w, http.StatusOK, AddBookToShelfResponse{book_shelf.ShelfID.String(), book_shelf.BookIsbn})
}
