export function validateUsername(usernameInput) {
	const value = usernameInput.value;
	const minLength = 3;
	const maxLength = 20;
	const doubleUnderscores = /__/;
	const allowedCharacters = /^[a-zA-Z0-9_]+$/;

	if (value.length < minLength) {
		usernameInput.setCustomValidity(
			`De gebruikersnaam moet minstens ${minLength} tekens lang zijn.`
		);
	} else if (value.length > maxLength) {
		usernameInput.setCustomValidity(
			`De gebruikersnaam mag hoogstens ${maxLength} tekens lang zijn.`
		);
	} else if (value.startsWith('_')) {
		usernameInput.setCustomValidity(
			'Een underscore aan het begin is niet toegestaan.'
		);
	} else if (value.endsWith('_')) {
		usernameInput.setCustomValidity(
			'Een underscore aan het einde is niet toegestaan.'
		);
	} else if (doubleUnderscores.test(value)) {
		usernameInput.setCustomValidity(
			'Dubbele underscores zijn niet toegestaan.'
		);
	} else if (!allowedCharacters.test(value)) {
		usernameInput.setCustomValidity(
			'Enkel letters, cijfers en underscores zijn toegestaan.'
		);
	} else {
		usernameInput.setCustomValidity('');
	}
}