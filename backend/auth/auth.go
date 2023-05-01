package auth

import (
	"context"
	"net/http"
	"strings"
	"time"
  "os"

	"github.com/dgrijalva/jwt-go"
	"github.com/mlorthiois/coffee/models"
	"golang.org/x/crypto/bcrypt"
)

var SECRET_KEY string = os.Getenv("JWT_SECRET_KEY")
var EXPIRATION_TIME int = os.Getenv("JWT_EXPIRATION_TIME")

type JwtClaims struct {
	User models.User `json:"user"`
	jwt.StandardClaims
}

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract token
		bearToken := r.Header.Get("Authorization")
		strArr := strings.Split(bearToken, " ")
		if len(strArr) != 2 {
			http.Error(w, "Authorization Header badly formatted.", http.StatusUnauthorized)
			return
		}
		tokenString := strArr[1]

		// Verify Token
		token, err := jwt.ParseWithClaims(
			tokenString,
			&JwtClaims{},
			func(token *jwt.Token) (interface{}, error) {
				return []byte(SECRET_KEY), nil
			},
		)
		if err != nil {
			http.Error(w, "Token not valid.", http.StatusUnauthorized)
			return
		}

		// Token valid
		claims, ok := token.Claims.(*JwtClaims)
		if !ok {
			http.Error(w, "Couldn't parse claims", http.StatusUnauthorized)
			return
		}

		// Token not expired
		if claims.ExpiresAt < time.Now().Unix() {
			http.Error(w, "JWT is expired", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "user", claims.User)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func CreateToken(user models.User) (string, error) {
	var err error

	//Creating Access Token
	atClaims := JwtClaims{
		User: user,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * time.Duration(EXPIRATION_TIME)).Unix()},
	}
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", err
	}
	return token, nil
}

func EncodePassword(pwd string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
}
