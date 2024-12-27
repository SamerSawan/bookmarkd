package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

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

	shelf, err := cfg.Db.GetShelf(r.Context(), shelf_uuid)

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

	coreShelves := []string{"To Be Read", "Currently Reading", "Read"}

	isCoreShelf := false
	for _, name := range coreShelves {
		if name == shelf.Name {
			isCoreShelf = true
			break
		}
	}

	if isCoreShelf {
		client, err := cfg.Firebase.Auth(r.Context())
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth client", err)
			return
		}

		authHeader := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
		token, err := client.VerifyIDToken(r.Context(), authHeader)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
			fmt.Println("Authorization Header:", r.Header.Get("Authorization"))
			return
		}
		userID := token.UID

		_, err = cfg.Db.GetUserBook(r.Context(), database.GetUserBookParams{
			UserID: userID,
			Isbn:   params.ISBN,
		})

		if err != nil {

			_, err = cfg.Db.AddBookToUser(r.Context(), database.AddBookToUserParams{
				UserID: userID,
				Isbn:   params.ISBN,
				Status: shelf.Name,
			})
			if err != nil {
				respondWithError(w, http.StatusInternalServerError, "Failed to create user-book relationship", err)
				return
			}
		} else {
			// Update the existing status
			_, err = cfg.Db.UpdateBookStatus(r.Context(), database.UpdateBookStatusParams{
				UserID: userID,
				Isbn:   params.ISBN,
				Status: shelf.Name,
			})
			if err != nil {
				respondWithError(w, http.StatusInternalServerError, "Failed to update user-book status", err)
				return
			}
		}
	}

	respondWithJSON(w, http.StatusOK, AddBookToShelfResponse{book_shelf.ShelfID.String(), book_shelf.BookIsbn})
}
