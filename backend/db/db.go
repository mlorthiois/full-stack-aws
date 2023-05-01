package db

import (
	"log"
  "os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DbCo *sqlx.DB

func InitDb() *sqlx.DB {
  db_user := os.Getenv("DB_USER")
  db_password := os.Getenv("DB_PASSWORD")
  db_dbname := os.Getenv("DB_DBNAME")

  connect_str := fmt.Sprintf(
    "user=%s password=%s dbname=%s sslmode=disable", 
    db_user, 
    db_password, 
    db_dbname
  )

	db, err := sqlx.Connect("postgres", connect_str)
	if err != nil {
		log.Fatalln(err)
	}

	return db
}
