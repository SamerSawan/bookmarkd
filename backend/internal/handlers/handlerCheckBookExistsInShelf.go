package handlers

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) CheckBookExistsInShelf(w http.ResponseWriter, r *http.Request) {
	type response struct {
		Exists bool `json:"exists"`
	}

	shelf_id_string := r.PathValue("shelf_id")

	shelf_id, err := uuid.Parse(shelf_id_string)
	query := r.URL.Query().Get("isbn")

	_, err = cfg.Db.CheckBookExistsInShelf(r.Context(), database.CheckBookExistsInShelfParams{ShelfID: shelf_id, BookIsbn: query})
	if err != nil {
		respondWithJSON(w, http.StatusOK, response{Exists: false})
		return
	}

	respondWithJSON(w, http.StatusOK, response{Exists: true})
}
