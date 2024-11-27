package handlers

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
	"github.com/samersawan/bookmarkd/backend/internal/database"
	"github.com/stretchr/testify/assert"
)

type IndustryIdentifier struct {
	Type       string `json:"type"`
	Identifier string `json:"identifier"`
}

type ImageLinks struct {
	Thumbnail string `json:"thumbnail"`
}

type UserBookTest struct {
	isbn     string
	expected int
}

var userBookTests = []UserBookTest{
	UserBookTest{"9781250621184", 201},
	UserBookTest{"9781429926584", 201},
	UserBookTest{"9781019379219", 201},
}

var progressTests = []struct {
	progress int
	expected int
}{
	{progress: 150, expected: http.StatusOK},
	{progress: 300, expected: http.StatusOK},
	{progress: -10, expected: http.StatusBadRequest},
}

var statusTests = []struct {
	status   string
	expected int
}{
	{status: "Currently Reading", expected: http.StatusOK},
	{status: "Read", expected: http.StatusOK},
	{status: "Invalid Status", expected: http.StatusBadRequest}, // Invalid status
}

// TODO: Create multiple test cases, including invalid ones
// TODO: Add ISBN checking to make sure only valid ISBNs are accepted
func TestAddBookToUserEndpoint(t *testing.T) {
	godotenv.Load("../../.env")
	dbURL := os.Getenv("TEST_DB_URL")
	apiKey := os.Getenv("API_KEY")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open connection to database.", err)
	}
	dbQueries := database.New(db)
	cfg := ApiConfig{Db: dbQueries, ApiKey: apiKey}

	cfg.Db.ResetBooks(context.Background())
	cfg.Db.ResetUsers(context.Background())

	user, err := cfg.Db.CreateUser(context.Background(), database.CreateUserParams{
		Email:    "samersawan123@gmail.com",
		Password: "Tr0ub4dour&!2",
	})
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}

	for _, test := range userBookTests {
		book := BookParameters{
			Title:   "Test Book",
			Authors: []string{"Test Author"},
			IndustryIdentifiers: []struct {
				Type       string `json:"type"`
				Identifier string `json:"identifier"`
			}{
				{Type: "ISBN_13", Identifier: test.isbn},
			},
			PublishedDate: "2000-01-01",
			PageCount:     300,
			ImageLinks:    ImageLinks{Thumbnail: "http://example.com/image.jpg"},
			Description:   "This is a test book.",
		}

		body := map[string]interface{}{
			"Book":   book,
			"status": "Currently Reading",
		}
		bodyJSON, _ := json.Marshal(body)

		requestURL := fmt.Sprintf("/api/users/%s/books", user.ID.String())
		req := httptest.NewRequest(http.MethodPost, requestURL, bytes.NewReader(bodyJSON))
		req.Header.Set("Content-Type", "application/json")

		req.SetPathValue("user_id", user.ID.String())

		rec := httptest.NewRecorder()

		cfg.AddBookToUser(rec, req)

		assert.Equal(t, test.expected, rec.Code)

		type Response struct {
			ID     string `json:"id"`
			UserID string `json:"user_id"`
			ISBN   string `json:"isbn"`
			Status string `json:"status"`
		}

		var response Response
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		if err != nil {
			t.Fatalf("Failed to parse response body: %v", err)
		}

		assert.Equal(t, test.isbn, response.ISBN)
		assert.Equal(t, user.ID.String(), response.UserID)
		assert.Equal(t, "Currently Reading", response.Status)

		err = cfg.Db.DeleteUserBookEntry(context.Background(), database.DeleteUserBookEntryParams{
			UserID: user.ID,
			Isbn:   test.isbn,
		})
		if err != nil {
			t.Fatalf("Failed to delete user-book entry: %v", err)
		}
	}

	cfg.Db.ResetBooks(context.Background())
	cfg.Db.ResetUsers(context.Background())
}

func TestUpdateBookProgressEndpoint(t *testing.T) {
	godotenv.Load("../../.env")
	dbURL := os.Getenv("TEST_DB_URL")
	apiKey := os.Getenv("API_KEY")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open connection to database.", err)
	}
	dbQueries := database.New(db)
	cfg := ApiConfig{Db: dbQueries, ApiKey: apiKey}

	cfg.Db.ResetBooks(context.Background())
	cfg.Db.ResetUsers(context.Background())

	user, err := cfg.Db.CreateUser(context.Background(), database.CreateUserParams{
		Email:    "samersawan123@gmail.com",
		Password: "Tr0ub4dour&!2",
	})
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}

	bookISBN := "9780765348784"
	_, err = cfg.Db.CreateBook(context.Background(), database.CreateBookParams{
		Isbn:          bookISBN,
		Title:         "Test Book",
		Author:        "Test Author",
		CoverImageUrl: "http://example.com/image.jpg",
		PublishDate:   time.Now(),
		Pages:         300,
		Description:   "This is a test book.",
	})
	if err != nil {
		t.Fatalf("Failed to create book: %v", err)
	}

	_, err = cfg.Db.AddBookToUser(context.Background(), database.AddBookToUserParams{
		UserID: user.ID,
		Isbn:   bookISBN,
		Status: "Currently Reading",
	})
	if err != nil {
		t.Fatalf("Failed to create user-book relationship: %v", err)
	}

	for _, test := range progressTests {
		body := map[string]interface{}{
			"progress": test.progress,
		}
		bodyJSON, _ := json.Marshal(body)

		requestURL := fmt.Sprintf("/api/users/%s/books/%s/progress", user.ID.String(), bookISBN)
		req := httptest.NewRequest(http.MethodPut, requestURL, bytes.NewReader(bodyJSON))
		req.Header.Set("Content-Type", "application/json")
		req.SetPathValue("user_id", user.ID.String())
		req.SetPathValue("isbn", bookISBN)

		rec := httptest.NewRecorder()
		cfg.UpdateBookProgress(rec, req)

		assert.Equal(t, test.expected, rec.Code)

		if test.expected == http.StatusOK {
			var updatedProgress sql.NullInt32
			row := db.QueryRow("SELECT progress FROM user_books WHERE user_id = $1 AND isbn = $2", user.ID, bookISBN)
			if err := row.Scan(&updatedProgress); err != nil {
				t.Fatalf("Failed to fetch updated progress: %v", err)
			}
			assert.Equal(t, test.progress, int(updatedProgress.Int32))
		}
	}

	cfg.Db.ResetBooks(context.Background())
	cfg.Db.ResetUsers(context.Background())
}

func TestUpdateBookStatusEndpoint(t *testing.T) {
	godotenv.Load("../../.env")
	dbURL := os.Getenv("TEST_DB_URL")
	apiKey := os.Getenv("API_KEY")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open connection to database.", err)
	}
	dbQueries := database.New(db)
	cfg := ApiConfig{Db: dbQueries, ApiKey: apiKey}

	cfg.Db.ResetBooks(context.Background())
	cfg.Db.ResetUsers(context.Background())

	user, err := cfg.Db.CreateUser(context.Background(), database.CreateUserParams{
		Email:    "samersawan123@gmail.com",
		Password: "Tr0ub4dour&!2",
	})
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}

	bookISBN := "9780765348784"
	_, err = cfg.Db.CreateBook(context.Background(), database.CreateBookParams{
		Isbn:          bookISBN,
		Title:         "Test Book",
		Author:        "Test Author",
		CoverImageUrl: "http://example.com/image.jpg",
		PublishDate:   time.Now(),
		Pages:         300,
		Description:   "This is a test book.",
	})
	if err != nil {
		t.Fatalf("Failed to create book: %v", err)
	}

	_, err = cfg.Db.AddBookToUser(context.Background(), database.AddBookToUserParams{
		UserID: user.ID,
		Isbn:   bookISBN,
		Status: "To Be Read",
	})
	if err != nil {
		t.Fatalf("Failed to create user-book relationship: %v", err)
	}

	for _, test := range statusTests {
		body := map[string]interface{}{
			"status": test.status,
		}
		bodyJSON, _ := json.Marshal(body)

		requestURL := fmt.Sprintf("/api/users/%s/books/%s/status", user.ID.String(), bookISBN)
		req := httptest.NewRequest(http.MethodPut, requestURL, bytes.NewReader(bodyJSON))
		req.Header.Set("Content-Type", "application/json")
		req.SetPathValue("user_id", user.ID.String())
		req.SetPathValue("isbn", bookISBN)

		rec := httptest.NewRecorder()
		cfg.UpdateBookStatus(rec, req)

		assert.Equal(t, test.expected, rec.Code)

		if test.expected == http.StatusOK {
			var updatedStatus string
			row := db.QueryRow("SELECT status FROM user_books WHERE user_id = $1 AND isbn = $2", user.ID, bookISBN)
			if err := row.Scan(&updatedStatus); err != nil {
				t.Fatalf("Failed to fetch updated status: %v", err)
			}
			assert.Equal(t, test.status, updatedStatus)
		}
	}

	cfg.Db.ResetBooks(context.Background())
	cfg.Db.ResetUsers(context.Background())
}
