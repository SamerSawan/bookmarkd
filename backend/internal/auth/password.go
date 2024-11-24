package auth

import (
	"fmt"
	"unicode"

	"golang.org/x/crypto/bcrypt"
)

func CheckPasswordStrength(password string) bool {
	var hasUpper, hasLower, hasNumber, hasSpecial bool
	if len(password) < 8 {
		return false
	}
	for _, c := range password {
		switch {
		case unicode.IsUpper(c):
			hasUpper = true
		case unicode.IsLower(c):
			hasLower = true
		case unicode.IsDigit(c):
			hasNumber = true
		case unicode.IsPunct(c) || unicode.IsSymbol(c):
			hasSpecial = true
		}
	}
	return hasUpper && hasLower && hasNumber && hasSpecial
}

func HashPassword(password string) (string, error) {
	hashed_pass, err := bcrypt.GenerateFromPassword([]byte(password), 0)
	if err != nil {
		return "", fmt.Errorf("Unable to hash password: %w", err)
	}
	return string(hashed_pass), nil
}

func CheckPasswordHash(password, hash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return fmt.Errorf("Incorrect password")
	}
	return nil
}
