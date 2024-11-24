package auth

import (
	"strings"
	"testing"
)

type passwordTest struct {
	password string
	expected bool
}

type hashingTest struct {
	password    string
	expectError bool
}

var passwordTests = []passwordTest{
	passwordTest{"helloworld", false},
	passwordTest{"hey", false},
	passwordTest{"HELLO!21", false},
	passwordTest{"Tr0ub4dor&3", true},
}

var hashingTests = []hashingTest{
	hashingTest{"", true},
	hashingTest{strings.Repeat("Tr0ub4dor&3", 1000000), true},
	hashingTest{"Tr0ub4dor&3", false},
	hashingTest{"密码123@aB", false},
}

func TestCheckPasswordStrength(t *testing.T) {
	for _, test := range passwordTests {
		if output := CheckPasswordStrength(test.password); output != test.expected {
			t.Errorf("got %t, wanted %t for %s", output, test.expected, test.password)
		}
	}
}

func TestPasswordHashing(t *testing.T) {
	for _, test := range hashingTests {
		hashed_password, err := HashPassword(test.password)
		if test.expectError {
			if err == nil {
				t.Errorf("Expected an error for %s", test.password)
			}
		} else {
			if err != nil {
				t.Error("Failed to hash password: ", err)
			}
			if hashed_password == "" {
				t.Error("Hashed password is an empty string")
			}
			err = CheckPasswordHash(test.password, hashed_password)
			if err != nil {
				t.Errorf("Password not hashed properly: %s", test.password)
			}
		}

	}

}
