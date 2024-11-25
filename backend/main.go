package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/samersawan/bookmarkd/backend/internal/database"
	"github.com/samersawan/bookmarkd/backend/internal/handlers"
)

func main() {
	godotenv.Load()
	serveMux := http.NewServeMux()
	server := http.Server{Handler: serveMux, Addr: ":8080"}
	dbURL := os.Getenv("DB_URL")
	apiKey := os.Getenv("API_KEY")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open connection to database.")
	}
	dbQueries := database.New(db)

	apiCfg := handlers.ApiConfig{Db: dbQueries, ApiKey: apiKey}

	serveMux.HandleFunc("POST /api/users", apiCfg.CreateUser)
	serveMux.HandleFunc("GET /books/search", apiCfg.Search)

	fmt.Println(" __          __  _                            _          ____              _                         _       _\n",
		"\\ \\        / / | |                          | |        |  _ \\            | |                       | |     | |\n",
		" \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___  | |_ ___   | |_) | ___   ___ | | ___ __ ___   __ _ _ __| | ____| |\n",
		"  \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\ | __/ _ \\  |  _ < / _ \\ / _ \\| |/ / '_ ` _ \\ / _` | '__| |/ / _` |\n",
		"   \\  /\\  /  __/ | (_| (_) | | | | | |  __/ | || (_) | | |_) | (_) | (_) |   <| | | | | | (_| | |  |   < (_| |\n",
		"    \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/  |____/ \\___/ \\___/|_|\\_\\_| |_| |_|\\__,_|_|  |_|\\_\\__,_|",
	)
	fmt.Println("Server is live! Listening for requests...")
	server.ListenAndServe()
}
