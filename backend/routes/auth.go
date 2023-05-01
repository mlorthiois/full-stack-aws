package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/schema"
	"github.com/mlorthiois/coffee/auth"
	"github.com/mlorthiois/coffee/db"
	"github.com/mlorthiois/coffee/models"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/guregu/null.v4"
)

func AuthRouter() http.Handler {
	r := chi.NewRouter()
	r.Post("/login", login)
	r.Post("/register", register)
	return r
}

///////////////////////////////////////////////////////////////////////////////
func login(w http.ResponseWriter, r *http.Request) {
	// Parse body
	l := struct {
		Email    null.String `schema:"username,required"`
		Password string      `schema:"password,required"`
	}{}

	err := r.ParseForm()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	d := schema.NewDecoder()
	err = d.Decode(&l, r.Form)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Find user by email in db
	var user models.User
	err = db.DbCo.Get(&user, "SELECT * FROM users WHERE email=$1;", l.Email)
	if err != nil {
		log.Println(err)
		http.Error(w, "Email not found.", http.StatusUnauthorized)
		return
	}

	// Check if pwd in body is hashed pwd is db
	err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(l.Password))
	if err != nil {
		http.Error(w, "Password incorrect.", http.StatusUnauthorized)
		return
	}

	token, err := auth.CreateToken(user)

	returned_token := struct {
		AccessToken string `json:"access_token"`
	}{
		AccessToken: token,
	}
	payload, _ := json.Marshal(returned_token)
	w.Write([]byte(payload))
}

///////////////////////////////////////////////////////////////////////////////
func register(w http.ResponseWriter, r *http.Request) {
	// Parse body
	body := struct {
		Email     string `json:"email" db:"email" validate:"empty=false"`
		Password  string `json:"password" db:"hashed_password" validate:"empty=false"`
		FirstName string `json:"first_name" db:"first_name" validate:"empty=false"`
		LastName  string `json:"last_name" db:"last_name" validate:"empty=false"`
		ImageUrl  string `json:"image_url" db:"image_url"`
	}{}

	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	err := d.Decode(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if email not already in DB
	var user models.User
	err = db.DbCo.Get(&user, "SELECT email FROM users WHERE email=$1;", body.Email)
	if err == nil {
		http.Error(w, "Email already exists.", http.StatusUnauthorized)
		return
	}

	// Create User in DB
	encoded_password, err := auth.EncodePassword(body.Password)
	if err != nil {
		http.Error(w, "Unable to process password provide.", http.StatusUnauthorized)
		return
	}

	body.Password = string(encoded_password)

	_, err = db.DbCo.NamedExec(`INSERT INTO users (email,first_name,last_name,hashed_password,image_url) VALUES (:email,:first_name,:last_name,:hashed_password,:image_url)`, body)
	if err != nil {
		log.Println(err)
		http.Error(w, "Insert in DB failed", http.StatusFailedDependency)
		return
	}

	w.Write([]byte("Successfully register"))
}
