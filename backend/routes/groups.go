package routes

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/mlorthiois/coffee/auth"
	"github.com/mlorthiois/coffee/db"

	"github.com/go-chi/chi/v5"
)

func GroupsRouter() http.Handler {
	r := chi.NewRouter()
	r.Use(auth.Middleware)
	r.Get("/{groupID}/places/", getGroupPlaces)
	return r
}

//////////////////////////////////////////////////////////////////////////////
var getGroupPlacesQuery = `
SELECT COUNT(*)
FROM reservations
WHERE date=$1 AND group_id=$2;
`

func getGroupPlaces(w http.ResponseWriter, r *http.Request) {
	groupID := chi.URLParam(r, "groupID")
	today := time.Now().Format("2006-01-02")

	var places int
	err := db.DbCo.Get(&places, getGroupPlacesQuery, today, groupID)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	payload, _ := json.Marshal(places)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
}
