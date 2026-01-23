export function validatePassword(passwordInput) {
	const value = passwordInput.value;
	const minLength = 8;
	const maxLength = 64;

	if (value.length < minLength) {
		passwordInput.setCustomValidity(`Het wachtwoord moet minstens ${minLength} tekens lang zijn.`);
	} else if (value.length > maxLength) {
		passwordInput.setCustomValidity(`Het wachtwoord mag hoogstens ${maxLength} tekens lang zijn.`);
	} else if (value !== value.trim()) {
		passwordInput.setCustomValidity('Spaties aan het begin of einde zijn niet toegestaan.');
	} else {
		passwordInput.setCustomValidity('');
	}
}