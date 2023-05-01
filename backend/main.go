package main

import (
	"fmt"
	"net/http"

	"github.com/mlorthiois/coffee/db"
	"github.com/mlorthiois/coffee/routes"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// Init DB connexion
	db.DbCo = db.InitDb()

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// Middlewares
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Routes
	r.Mount("/user", routes.UsersRouter())
	r.Mount("/group", routes.GroupsRouter())
	r.Mount("/admin", routes.AdminRouter())
	r.Mount("/", routes.AuthRouter())

	// Server
	fmt.Println("Server listening at port 3000")
	http.ListenAndServe(":3000", r)
}
