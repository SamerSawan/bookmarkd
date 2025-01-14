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
	// Parse shelf ID
	shelf_id := r.PathValue("shelf_id")
	shelf_uuid, err := uuid.Parse(shelf_id)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Failed to parse shelf_id into uuid", err)
		return
	}
	// Get shelf details
	shelf, err := cfg.Db.GetShelf(r.Context(), shelf_uuid)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Shelf does not exist!", err)
		return
	}

	// Parse request body
	type parameters struct {
		ISBN string `json:"isbn"`
	}
	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to decode parameters", err)
		return
	}

	// Add book to shelf_books
	book_shelf, err := cfg.Db.AddBookToShelf(r.Context(), database.AddBookToShelfParams{
		ShelfID:  shelf_uuid,
		BookIsbn: params.ISBN,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create book-shelf relationship", err)
		return
	}

	// Core shelf logic
	coreShelves := []string{"To Be Read", "Currently Reading", "Read"}
	isCoreShelf := false
	for _, name := range coreShelves {
		if name == shelf.Name {
			isCoreShelf = true
			break
		}
	}

	if isCoreShelf {
		// Authenticate user
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
		// Check if the book already has a status
		userBook, err := cfg.Db.GetUserBook(r.Context(), database.GetUserBookParams{
			UserID: userID,
			Isbn:   params.ISBN,
		})

		if err != nil {
			// Book does NOT have a status — Add it as a new user-book
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
			// Book already has a status — Move between core shelves if needed
			if userBook.Status != shelf.Name {
				// Fetch all shelves for the user
				userShelves, err := cfg.Db.GetUsersShelves(r.Context(), userID)
				if err != nil {
					respondWithError(w, http.StatusInternalServerError, "Failed to fetch user shelves", err)
					return
				}

				// Find the previous shelf by matching status
				var previousShelf database.Shelf
				for _, s := range userShelves {
					prev, _ := cfg.Db.GetShelf(r.Context(), s.ShelfID)
					if prev.Name == userBook.Status {
						previousShelf = prev
						break
					}
				}

				// Remove the book from the previous shelf
				err = cfg.Db.RemoveBookFromShelf(r.Context(), database.RemoveBookFromShelfParams{
					ShelfID:  previousShelf.ID,
					BookIsbn: params.ISBN,
				})
				if err != nil {
					respondWithError(w, http.StatusInternalServerError, "Failed to remove book from previous shelf", err)
					return
				}

				// Update the book status
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
	}

	respondWithJSON(w, http.StatusOK, AddBookToShelfResponse{
		ShelfID: book_shelf.ShelfID.String(),
		ISBN:    book_shelf.BookIsbn,
	})
}
