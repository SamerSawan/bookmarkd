package auth

import "testing"

type passwordTest struct {
	password string
	expected bool
}

var passwordTests = []passwordTest{
	passwordTest{"helloworld", false},
	passwordTest{"hey", false},
	passwordTest{"HELLO!21", false},
	passwordTest{"Tr0ub4dor&3", true},
}

func TestCheckPasswordStrength(t *testing.T) {
	for _, test := range passwordTests {
		if output := CheckPasswordStrength(test.password); output != test.expected {
			t.Errorf("got %t, wanted %t for %s", output, test.expected, test.password)
		}
	}
}
