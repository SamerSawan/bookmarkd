package handlers

import (
	"net/http"
)

func (cfg *ApiConfig) CheckBookExists(w http.ResponseWriter, r *http.Request) {
	type response struct {
		Exists bool `json:"exists"`
	}

	query := r.URL.Query().Get("isbn")

	_, err := cfg.Db.GetBook(r.Context(), query)
	if err != nil {
		respondWithJSON(w, http.StatusOK, response{Exists: false})
		return
	}

	respondWithJSON(w, http.StatusOK, response{Exists: true})
}
