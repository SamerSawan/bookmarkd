package handlers

import (
	firebase "firebase.google.com/go"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

type ApiConfig struct {
	Db       *database.Queries
	ApiKey   string
	Firebase *firebase.App
}
