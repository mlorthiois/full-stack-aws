package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/mlorthiois/coffee/auth"
	"github.com/mlorthiois/coffee/db"
	"github.com/mlorthiois/coffee/models"

	"github.com/go-chi/chi/v5"
)

func UsersRouter() http.Handler {
	r := chi.NewRouter()
	r.Use(auth.Middleware)
	r.Get("/", getAuthUser)
	r.Put("/", updateAuthUser)

	r.Get("/groups/", getAuthUserGroups)

	r.Get("/reservations/", getAuthUserReservations)
	r.Post("/reservations/{groupID}/", createReservation)

	r.Post("/join/{groupID}/", joinGroup)
	return r
}

//////////////////////////////////////////////////////////////////////////////
func getAuthUser(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	user := models.User{}
	err := db.DbCo.Get(&user, "SELECT * FROM users WHERE id=$1", claimsUser.Id)
	if err != nil {
		http.NotFound(w, r)
	}

	payload, _ := json.Marshal(user)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}

//////////////////////////////////////////////////////////////////////////////
var getAuthUserGroupsQuery = `
SELECT status, invoice, groups.*
FROM group_members
INNER JOIN groups ON group_members.group_id=groups.id
WHERE user_id=$1;
`

func getAuthUserGroups(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	groups := []struct {
		models.Member
		Group models.Group `json:"group" db:""`
	}{}

	err := db.DbCo.Select(&groups, getAuthUserGroupsQuery, claimsUser.Id)
	if err != nil {
		log.Println(err)
		http.NotFound(w, r)
	}

	payload, _ := json.Marshal(groups)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}

///////////////////////////////////////////////////////////////////////////////
var getAuthUserReservationsQuery = `
SELECT reservations.id AS "res_id", date, reservations.price AS "res_price", groups.*
FROM reservations
INNER JOIN groups ON reservations.group_id=groups.id
WHERE user_id=$1;
`

func getAuthUserReservations(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	reservations := []struct {
		models.Reservation
		Group models.Group `json:"group" db:""`
	}{}

	err := db.DbCo.Select(&reservations, getAuthUserReservationsQuery, claimsUser.Id)
	if err != nil {
		log.Println(err)
		http.NotFound(w, r)
	}

	payload, _ := json.Marshal(reservations)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}

///////////////////////////////////////////////////////////////////////////////
func createReservation(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)
	groupID := chi.URLParam(r, "groupID")
	groupID_int, err := strconv.ParseInt(groupID, 10, 64)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	// Get group price
	var price float64
	err = db.DbCo.Get(&price, "SELECT price FROM groups WHERE id=$1", groupID)
	if err != nil {
		log.Println(err)
		http.Error(w, "Group not found", http.StatusFailedDependency)
		return
	}

	// Add to reservations table and increase invoice
	tx := db.DbCo.MustBegin()
	tx.MustExec("INSERT INTO reservations (group_id,user_id,date,price) VALUES ($1, $2, $3, $4);", groupID_int, claimsUser.Id, time.Now().Format("2006-01-02"), price)
	tx.MustExec("UPDATE group_members SET invoice = invoice + $1 WHERE group_id =$2 AND user_id = $3;", price, groupID_int, claimsUser.Id)
	tx.Commit()

	w.Write([]byte("Successfully reserved"))
}

///////////////////////////////////////////////////////////////////////////////
var joinGroupQuery = `
INSERT INTO group_members (user_id,group_id,status,invoice) 
VALUES (:user_id, :group_id, :status, :invoice);
`

func joinGroup(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)
	groupID := chi.URLParam(r, "groupID")
	groupID_int, err := strconv.ParseInt(groupID, 10, 64)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	// Check if not already in group
	var status string
	err = db.DbCo.Get(&status, "SELECT status FROM group_members WHERE group_id=$1 AND user_id=$2;", groupID_int, claimsUser.Id)
	if err == nil {
		log.Println(err)
		http.Error(w, "User already in group", http.StatusFailedDependency)
		return
	}

	_, err = db.DbCo.NamedExec(joinGroupQuery, map[string]interface{}{
		"user_id":  claimsUser.Id,
		"group_id": groupID_int,
		"status":   "pending",
		"invoice":  0,
	})
	if err != nil {
		log.Println(err)
		http.Error(w, "Join failed", http.StatusFailedDependency)
		return
	}

	w.Write([]byte("Successfully joined"))
}

///////////////////////////////////////////////////////////////////////////////
var updateAuthUserQuery = `
UPDATE users
SET email=:email, first_name=:first_name, last_name=:last_name, image_url=:image_url 
WHERE id=:id;`

func updateAuthUser(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	body := models.User{}

	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	err := d.Decode(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	body.Id = claimsUser.Id

	// Get group price
	_, err = db.DbCo.NamedExec(updateAuthUserQuery, body)
	if err != nil {
		log.Println(err)
		http.Error(w, "An error occurs during update", http.StatusFailedDependency)
		return
	}

	w.Write([]byte("Successfully updated"))
}
