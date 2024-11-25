package handlers

import (
	"time"

	"github.com/google/uuid"
)

type BookResponse struct {
	Items []struct {
		VolumeInfo BookParameters
	}
}

type User struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type BookParameters struct {
	Title               string   `json:"title"`
	Authors             []string `json:"authors"`
	Publisher           string   `json:"publisher"`
	PublishedDate       string   `json:"publishedDate"`
	Description         string   `json:"description"`
	IndustryIdentifiers []struct {
		Type       string `json:"type"`
		Identifier string `json:"identifier"`
	} `json:"industryIdentifiers"`
	PageCount      int      `json:"pageCount"`
	Categories     []string `json:"categories"`
	MaturityRating string   `json:"maturityRating"`
	ImageLinks     struct {
		Thumbnail string `json:"thumbnail"`
	} `json:"imageLinks"`
	Language string `json:"language"`
}

type Book struct {
	ISBN          string    `json:"isbn"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Title         string    `json:"title"`
	Author        string    `json:"author"`
	PublishDate   time.Time `json:"publish_date"`
	CoverImageURL string    `json:"cover_image_url"`
	Pages         int32     `json:"pages"`
	Description   string    `json:"description"`
}
