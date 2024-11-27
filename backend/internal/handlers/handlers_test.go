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

	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
	"github.com/samersawan/bookmarkd/backend/internal/database"
	"github.com/stretchr/testify/assert"
)

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

	user, err := cfg.Db.CreateUser(context.Background(), database.CreateUserParams{Email: "samersawan123@gmail.com", Password: "Tr0ub4dour&!2"})
	bookISBN := "9781429926584"

	body := map[string]string{
		"isbn":   bookISBN,
		"status": "Currently Reading",
	}
	bodyJSON, _ := json.Marshal(body)
	requestURL := fmt.Sprintf("/api/users/%s/books", user.ID.String())
	fmt.Println(user.ID.String())
	req := httptest.NewRequest(http.MethodPost, requestURL, bytes.NewReader(bodyJSON))
	req.SetPathValue("user_id", user.ID.String())
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	cfg.AddBookToUser(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)
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

	assert.Equal(t, bookISBN, response.ISBN)
	assert.Equal(t, user.ID.String(), response.UserID)
	assert.Equal(t, "Currently Reading", response.Status)

	cfg.Db.DeleteUserBookEntry(context.Background(), database.DeleteUserBookEntryParams{UserID: user.ID, Isbn: bookISBN})
}
