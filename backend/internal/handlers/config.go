package handlers

import "github.com/samersawan/bookmarkd/backend/internal/database"

type ApiConfig struct {
	Db *database.Queries
}
