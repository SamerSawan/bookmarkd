package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/samersawan/bookmarkd/backend/internal/database"
	"github.com/samersawan/bookmarkd/backend/internal/handlers"
	"google.golang.org/api/option"
)

func handlePage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(200)
	const page = `<html>
<head></head>
<body>
	<p> Hello from Docker! I'm a Go server. </p>
</body>
</html>
`
	w.Write([]byte(page))
}
func main() {
	godotenv.Load()
	serveMux := http.NewServeMux()

	dbURL := os.Getenv("DB_URL")
	apiKey := os.Getenv("API_KEY")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open connection to database.")
	}
	dbQueries := database.New(db)

	serviceAccountKey := os.Getenv("serviceAccountKey")
	if serviceAccountKey == "" {
		log.Fatalf("Missing serviceAccountKey.json environment variable")
	}

	opt := option.WithCredentialsJSON([]byte(serviceAccountKey))

	//opt := option.WithCredentialsFile("./serviceAccountKey.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase Admin SDK: %v", err)
	}

	apiCfg := handlers.ApiConfig{Db: dbQueries, ApiKey: apiKey, Firebase: app}

	serveMux.HandleFunc("/", handlePage)
	serveMux.HandleFunc("POST /api/books", apiCfg.CreateBook)
	serveMux.HandleFunc("POST /api/users", apiCfg.CreateUser)
	serveMux.HandleFunc("POST /api/users/{user_id}/books", apiCfg.AddBookToUser)
	serveMux.HandleFunc("GET /api/books/search", apiCfg.Search)
	serveMux.HandleFunc("PUT /api/users/{user_id}/books/{isbn}/progress", apiCfg.UpdateBookProgress)
	serveMux.HandleFunc("GET /api/users/{user_id}", apiCfg.GetUser)
	serveMux.HandleFunc("GET /api/users/{user_id}/shelves", apiCfg.GetShelves)
	serveMux.HandleFunc("POST /api/shelves/{shelf_id}", apiCfg.AddBookToShelf)
	serveMux.HandleFunc("GET /api/books", apiCfg.GetBook)
	serveMux.HandleFunc("GET /api/books/exists", apiCfg.CheckBookExists)
	serveMux.HandleFunc("GET /api/users/me/currently-reading", apiCfg.GetCurrentlyReading)
	serveMux.HandleFunc("GET /api/users/me/favourites", apiCfg.GetFavourites)
	serveMux.HandleFunc("POST /api/users/me/favourites", apiCfg.AddFavourite)
	serveMux.HandleFunc("DELETE /api/users/me/favourites", apiCfg.RemoveFavourite)

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(serveMux)
	server := http.Server{Handler: handler, Addr: ":8080"}
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
