package handlers

import (
	"net/http"
	"strings"
)

func (cfg *ApiConfig) GetFavourites(w http.ResponseWriter, r *http.Request) {
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth Client", err)
		return
	}
	authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	token, err := client.VerifyIDToken(r.Context(), authHeader)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	userID := token.UID
	favorites, err := cfg.Db.GetFavourites(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to fetch favorites", err)
		return
	}

	respondWithJSON(w, http.StatusOK, favorites)
}
