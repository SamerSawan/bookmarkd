package handlers

import (
	"fmt"
	"net/http"
)

type Shelf struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	BookCount int    `json:"book_count"`
	Books     []Book `json:"books"`
}

func (cfg ApiConfig) GetShelves(w http.ResponseWriter, r *http.Request) {

	user_id := r.PathValue("user_id")

	client, err := cfg.Firebase.Auth(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to initialize Firebase Auth client", err)
		fmt.Println(err)
		return
	}

	token, err := client.VerifyIDToken(r.Context(), user_id)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Firebase ID token", err)
		fmt.Println(err)
		return
	}

	uid := token.UID

	shelves, err := cfg.Db.GetUsersShelves(r.Context(), uid)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to fetch user's shelves", err)
		fmt.Println(err)
		return
	}
	var shelfList []Shelf
	for _, s := range shelves {
		shelf, err := cfg.Db.GetShelf(r.Context(), s.ShelfID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Failed to fetch shelf", err)
			fmt.Println(err)
			return
		}

		booksInShelf, err := cfg.Db.GetBooksInShelf(r.Context(), s.ShelfID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to fetch books in the %s shelf", s.ShelfID), err)
			return
		}

		var bookList []Book
		for _, bookItem := range booksInShelf {
			book, _ := cfg.Db.GetBook(r.Context(), bookItem)

			bookList = append(bookList, Book{ISBN: book.Isbn, Title: book.Title, Author: book.Author, CoverImageURL: book.CoverImageUrl, PublishDate: book.PublishDate.Time, Pages: book.Pages, Description: book.Description})
		}

		shelfList = append(shelfList, Shelf{ID: shelf.ID.String(), Name: shelf.Name, BookCount: len(bookList), Books: bookList})
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"shelves": shelfList,
	})

}
