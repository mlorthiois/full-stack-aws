package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/mlorthiois/coffee/auth"
	"github.com/mlorthiois/coffee/db"
	"github.com/mlorthiois/coffee/models"

	"github.com/go-chi/chi/v5"
)

func AdminRouter() http.Handler {
	r := chi.NewRouter()
	r.Use(auth.Middleware)

	r.Post("/group/", createOwnedGroup)
	r.Get("/group/", getAdminGroup)
	r.Put("/group/", updateOwnedGroup)
	r.Put("/group/{price}/", updateOwnedGroupPrice)

	r.Get("/members/", getAdminGroupMembers)
	r.Get("/members/", getAdminGroupMembers)
	r.Put("/members/reset/{userID}/", resetInvoiceUser)
	r.Put("/members/approve/{userID}/", approveUser)

	r.Get("/reservations/", getAdminGroupReservations)
	return r
}

//////////////////////////////////////////////////////////////////////////////
var getAdminGroupMembersQuery = `
SELECT status, invoice, users.id, email, first_name, last_name, image_url
FROM group_members
INNER JOIN users ON group_members.user_id = users.id
WHERE group_id = $1;
`

func getAdminGroupMembers(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	members := []struct {
		models.Member
		User models.User `json:"user" db:""`
	}{}

	err := db.DbCo.Select(&members, getAdminGroupMembersQuery, claimsUser.GroupOwnedId)
	if err != nil {
		log.Println(err)
		http.NotFound(w, r)
	}

	payload, _ := json.Marshal(members)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}

//////////////////////////////////////////////////////////////////////////////
var getAdminGroupQuery = `
SELECT *
FROM groups
WHERE id = $1;
`

func getAdminGroup(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	group := models.Group{}
	err := db.DbCo.Get(&group, getAdminGroupQuery, claimsUser.GroupOwnedId)
	if err != nil {
		log.Println(err)
		http.NotFound(w, r)
	}

	payload, _ := json.Marshal(group)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}

//////////////////////////////////////////////////////////////////////////////
var getAdminGroupReservationsQuery = `
  SELECT reservations.id AS "res_id", date, price AS "res_price", users.id, email, first_name, last_name, image_url
  FROM reservations
  INNER JOIN users ON reservations.user_id = users.id
  WHERE group_id = $1 AND date = $2;
`

func getAdminGroupReservations(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)
	today := time.Now().Format("2006-01-02")

	members := []struct {
		models.Reservation
		User models.User `json:"user" db:""`
	}{}

	err := db.DbCo.Select(&members, getAdminGroupReservationsQuery, claimsUser.GroupOwnedId, today)
	if err != nil {
		log.Println(err)
		http.NotFound(w, r)
		return
	}

	payload, _ := json.Marshal(members)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}

//////////////////////////////////////////////////////////////////////////////
var createOwnedGroupInsert = `
INSERT INTO groups (name, price, capacity, hour_limit) 
VALUES ($1, $2, $3, $4)
RETURNING id;`

func createOwnedGroup(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	if claimsUser.GroupOwnedId.Valid {
		log.Println("User already has a group")
		http.NotFound(w, r)
		return
	}

	body := models.Group{}

	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	err := d.Decode(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	body.Id = claimsUser.GroupOwnedId.Int64

	// Create group
	tx := db.DbCo.MustBegin()
	var groupID int
	err = tx.QueryRowx(createOwnedGroupInsert, body.Name, body.Price, body.Capacity, body.HourLimit).Scan(&groupID)
	if err != nil {
		tx.Rollback()
		log.Println(err)
		http.Error(w, "An error occurs during group creation", http.StatusFailedDependency)
		return
	}

	// Add to own group id and add in members
	tx.MustExec("UPDATE users SET group_owned_id=$1 WHERE id=$2;", groupID, claimsUser.Id)
	tx.MustExec("INSERT INTO group_members (group_id, user_id, status, invoice) VALUES ($1, $2, $3, $4);", groupID, claimsUser.Id, "approved", 0)
	tx.Commit()

	w.Write([]byte("Successfully updated"))
}

//////////////////////////////////////////////////////////////////////////////
var updateOwnedGroupQuery = `
UPDATE groups
SET name=:name, price=:price, capacity=:capacity, hour_limit=:hour_limit 
WHERE id=:id;`

func updateOwnedGroup(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)

	body := models.Group{}

	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	err := d.Decode(&body)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	body.Id = claimsUser.GroupOwnedId.ValueOrZero()
	if body.Id == 0 {
		log.Println("User doesn't own group")
		http.Error(w, "User doesn't own group", http.StatusFailedDependency)
		return
	}

	// Get group price
	_, err = db.DbCo.NamedExec(updateOwnedGroupQuery, body)
	if err != nil {
		log.Println(err)
		http.Error(w, "An error occurs during group update", http.StatusFailedDependency)
		return
	}

	w.Write([]byte("Successfully updated"))
}

///////////////////////////////////////////////////////////////////////////////
func updateOwnedGroupPrice(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)
	groupID := claimsUser.GroupOwnedId.ValueOrZero()
	if groupID == 0 {
		log.Println("User doesn't own group")
		http.Error(w, "User doesn't own group", http.StatusFailedDependency)
		return
	}

	price := chi.URLParam(r, "price")
	db.DbCo.MustExec("UPDATE groups SET price=$1 WHERE id=$2;", price, groupID)
	w.Write([]byte("Successfully updated"))
}

///////////////////////////////////////////////////////////////////////////////
func resetInvoiceUser(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)
	groupID := claimsUser.GroupOwnedId.ValueOrZero()
	if groupID == 0 {
		log.Println("User doesn't own group")
		http.Error(w, "User doesn't own group", http.StatusFailedDependency)
		return
	}

	userID := chi.URLParam(r, "userID")
	result := db.DbCo.MustExec("UPDATE group_members SET invoice=0 WHERE user_id=$1 AND group_id=$2;", userID, groupID)
	affected_rows, err := result.RowsAffected()
	if affected_rows == 0 || err != nil {
		log.Println("User doesn't own group")
		http.Error(w, "User doesn't own group", http.StatusFailedDependency)
	}
	w.Write([]byte("Successfully reset"))
}

///////////////////////////////////////////////////////////////////////////////
func approveUser(w http.ResponseWriter, r *http.Request) {
	claimsUser, _ := r.Context().Value("user").(models.User)
	groupID := claimsUser.GroupOwnedId.ValueOrZero()
	if groupID == 0 {
		log.Println("User doesn't own group")
		http.Error(w, "User doesn't own group", http.StatusFailedDependency)
		return
	}

	userID := chi.URLParam(r, "userID")
	result := db.DbCo.MustExec("UPDATE group_members SET status='approved' WHERE user_id=$1 AND group_id=$2;", userID, groupID)
	affected_rows, err := result.RowsAffected()
	if affected_rows == 0 || err != nil {
		log.Println("0 rows affected")
		http.Error(w, "0 rows affected, user not in the group", http.StatusFailedDependency)
	}
	w.Write([]byte("Successfully approved"))
}
