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
		ID:       "123",
		Email:    "samersawan123@gmail.com",
		Username: "samersawan",
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
		PublishDate:   sql.NullTime{Time: time.Now(), Valid: true},
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

		requestURL := fmt.Sprintf("/api/users/%s/books/%s/progress", user.ID, bookISBN)
		req := httptest.NewRequest(http.MethodPut, requestURL, bytes.NewReader(bodyJSON))
		req.Header.Set("Content-Type", "application/json")
		req.SetPathValue("user_id", user.ID)
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
		ID:       "123",
		Email:    "samersawan123@gmail.com",
		Username: "samersawan",
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
		PublishDate:   sql.NullTime{Time: time.Now(), Valid: true},
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

		requestURL := fmt.Sprintf("/api/users/%s/books/%s/status", user.ID, bookISBN)
		req := httptest.NewRequest(http.MethodPut, requestURL, bytes.NewReader(bodyJSON))
		req.Header.Set("Content-Type", "application/json")
		req.SetPathValue("user_id", user.ID)
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
