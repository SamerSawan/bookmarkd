package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/samersawan/bookmarkd/backend/internal/database"
)

func createDefaultShelves(db *database.Queries, user_id string) error {

	readShelf, err := db.CreateShelf(context.Background(), "Read")
	if err != nil {
		return fmt.Errorf("Failed to create 'Read' shelf: %w", err)
	}
	currentlyReadingShelf, err := db.CreateShelf(context.Background(), "Currently Reading")
	if err != nil {
		return fmt.Errorf("Failed to create 'Currently Reading' shelf: %w", err)
	}
	toBeReadShelf, err := db.CreateShelf(context.Background(), "To Be Read")
	if err != nil {
		return fmt.Errorf("Failed to create 'To Be Read' shelf: %w", err)
	}

	_, err = db.AddShelfToUser(context.Background(), database.AddShelfToUserParams{UserID: user_id, ShelfID: readShelf.ID})
	if err != nil {
		return fmt.Errorf("Failed to add shelf to user: %w", err)
	}
	_, err = db.AddShelfToUser(context.Background(), database.AddShelfToUserParams{UserID: user_id, ShelfID: currentlyReadingShelf.ID})
	if err != nil {
		return fmt.Errorf("Failed to add shelf to user: %w", err)
	}
	_, err = db.AddShelfToUser(context.Background(), database.AddShelfToUserParams{UserID: user_id, ShelfID: toBeReadShelf.ID})
	if err != nil {
		return fmt.Errorf("Failed to add shelf to user: %w", err)
	}
	return nil

}

func (cfg *ApiConfig) CreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		ID       string `json:"id"`
	}
	params := parameters{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode user parameters", err)
		return
	}
	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth client", err)
		return
	}

	token, err := client.VerifyIDToken(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		return
	}

	uid := token.UID

	user, err := cfg.Db.CreateUser(r.Context(), database.CreateUserParams{Email: params.Email, Username: params.Username, ID: uid})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create new user.", err)
		return
	}
	err = createDefaultShelves(cfg.Db, user.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create default bookshelves for user", err)
		return
	}
	respondWithJSON(w, http.StatusCreated, User{ID: user.ID, Email: user.Email, CreatedAt: user.CreatedAt, UpdatedAt: user.UpdatedAt, Username: params.Username})
}
