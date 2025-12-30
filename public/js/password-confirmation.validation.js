export function validatePasswordConfirmation(password, confirmedPassword) {
	if (password.value !== confirmedPassword.value) {
		confirmedPassword.setCustomValidity('De wachtwoorden komen niet overeen.');
	} else {
		confirmedPassword.setCustomValidity('');
	}
}