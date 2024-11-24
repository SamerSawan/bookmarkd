package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"github.com/samersawan/bookmarkd/backend/internal/database"
)

type apiConfig struct {
	db *database.Queries
}

func main() {
	serveMux := http.NewServeMux()
	server := http.Server{Handler: serveMux, Addr: ":8080"}
	dbURL := os.Getenv("DB_URL")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open connection to database.")
	}
	dbQueries := database.New(db)

	apiCfg := apiConfig{db: dbQueries}
	fmt.Println(apiCfg)

	//serveMux.HandleFunc("POST /api/users", apiCfg.handlerCreateUser)

	fmt.Println(" __          __  _                            _          ____              _                         _       _\n",
		"\\ \\        / / | |                          | |        |  _ \\            | |                       | |     | |\n",
		" \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___  | |_ ___   | |_) | ___   ___ | | ___ __ ___   __ _ _ __| | ____| |\n",
		"  \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\ | __/ _ \\  |  _ < / _ \\ / _ \\| |/ / '_ ` _ \\ / _` | '__| |/ / _` |\n",
		"   \\  /\\  /  __/ | (_| (_) | | | | | |  __/ | || (_) | | |_) | (_) | (_) |   <| | | | | | (_| | |  |   < (_| |\n",
		"    \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/  |____/ \\___/ \\___/|_|\\_\\_| |_| |_|\\__,_|_|  |_|\\_\\__,_|\n",
	)
	server.ListenAndServe()
}
