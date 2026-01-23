export function validatePasswordConfirmation(passwordInput, 
											 confirmedPasswordInput) {
	if (passwordInput.value !== confirmedPasswordInput.value) {
		confirmedPasswordInput.setCustomValidity('De wachtwoorden komen niet overeen.');
	} else {
		confirmedPasswordInput.setCustomValidity('');
	}
}