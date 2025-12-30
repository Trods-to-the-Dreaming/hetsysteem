export function validatePassword(password) {
	const value = password.value;
	const minLength = 8;
	const maxLength = 64;

	if (value.length < minLength) {
		password.setCustomValidity(`Minimaal ${minLength} tekens vereist.`);
	} else if (value.length > maxLength) {
		password.setCustomValidity(`Maximaal ${maxLength} tekens toegestaan.`);
	} else if (value !== value.trim()) {
		password.setCustomValidity('Spaties aan het begin of einde zijn niet toegestaan.');
	} else {
		password.setCustomValidity('');
	}
}