module github.com/mlorthiois/coffee

go 1.15

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-chi/chi/v5 v5.0.3
	github.com/go-chi/cors v1.2.0
	github.com/gorilla/schema v1.2.0
	github.com/jmoiron/sqlx v1.3.3
	github.com/lib/pq v1.10.1
	golang.org/x/crypto v0.0.0-20210503195802-e9a32991a82e
	gopkg.in/dealancer/validate.v2 v2.1.0 // indirect
	gopkg.in/guregu/null.v4 v4.0.0
)

replace github.com/mlorthiois/coffee/routes => ../routes

replace github.com/mlorthiois/coffee/db => ../db
