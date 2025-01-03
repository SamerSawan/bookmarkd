package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func (cfg *ApiConfig) AddFavourite(w http.ResponseWriter, r *http.Request) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth client", err)
		return
	}

	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	token, err := client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	userID := token.UID

	type parameters struct {
		ISBN string `json:"isbn"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	favorites, err := cfg.Db.GetFavourites(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to fetch favorites", err)
		return
	}

	// Enforce max limit
	if len(favorites) >= 4 {
		respondWithError(w, http.StatusBadRequest, "Max 4 favorites allowed. Remove one to add another.", nil)
		return
	}

	favourite, err := cfg.Db.CreateFavourite(r.Context(), database.CreateFavouriteParams{
		UserID: userID,
		Isbn:   params.ISBN,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to add favorite", err)
		return
	}

	respondWithJSON(w, http.StatusOK, favourite)
}
