package models

import (
	"database/sql/driver"
	"fmt"
	"strings"
	"time"

	"gopkg.in/guregu/null.v4"
)

type User struct {
	Id             int         `json:"id" db:"id"`
	Email          string      `json:"email" db:"email"`
	FirstName      string      `json:"first_name" db:"first_name"`
	LastName       string      `json:"last_name" db:"last_name"`
	ImageUrl       null.String `json:"image_url" db:"image_url"`
	GroupOwnedId   null.Int    `json:"group_owned_id" db:"group_owned_id"`
	HashedPassword string      `json:"-" db:"hashed_password"`
}

type Group struct {
	Id        int64   `json:"id" db:"id"`
	Name      string  `json:"name" db:"name"`
	Price     float64 `json:"price" db:"price"`
	Capacity  int32   `json:"capacity" db:"capacity"`
	HourLimit hour    `json:"hour_limit" db:"hour_limit"`
}

type Member struct {
	Status  string  `json:"status" db:"status"`
	Invoice float64 `json:"invoice" db:"invoice"`
}

type Reservation struct {
	Id    *int    `json:"id" db:"res_id"`
	Date  date    `json:"date" db:"date"`
	Price float64 `json:"price" db:"res_price"`
}

////////////////////////////////////////////////////////////
type hour time.Time

func (h hour) MarshalJSON() ([]byte, error) {
	stamp := fmt.Sprintf("\"%s\"", time.Time(h).Format("15:04:05"))
	return []byte(stamp), nil
}

func (h *hour) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), "\"")
	t, err := time.Parse("15:04:05", s)
	if err != nil {
		return err
	}
	*h = hour(t)
	return nil
}

func (u hour) Value() (driver.Value, error) {
	return fmt.Sprintf("\"%s\"", time.Time(u).Format("15:04:05")), nil
}

//////////////////////////////////////////////////////////////
type date time.Time

func (h date) MarshalJSON() ([]byte, error) {
	stamp := fmt.Sprintf("\"%s\"", time.Time(h).Format("2006-01-02"))
	return []byte(stamp), nil
}

func (d *date) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), "\"")
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return err
	}
	fmt.Println(s, t)
	*d = date(t)
	return nil
}

func (u date) Value() (driver.Value, error) {
	return fmt.Sprintf("\"%s\"", time.Time(u).Format("2006-01-02")), nil
}
