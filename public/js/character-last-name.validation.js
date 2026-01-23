export function validateCharacterLastName(lastNameInput) {
	const name = lastNameInput.value;
	const minLength = 3;
	const maxLength = 20;
	const regex = /^\p{L}+(?:[ '-]\p{L}+)*$/u;

	if (name.length < minLength) {
		lastNameInput.setCustomValidity(
			`De achternaam moet minstens ${minLength} tekens lang zijn.`
		);
	} else if (name.length > maxLength) {
		lastNameInput.setCustomValidity(
			`De achternaam mag hoogstens ${maxLength} tekens lang zijn.`
		);
	} else if (!regex.test(name)) {
		lastNameInput.setCustomValidity(
			'Dit is geen geldige achternaam.'
		);
	} else if (name !== name.trim()) {
		lastNameInput.setCustomValidity(
			'Spaties aan het begin of het einde zijn niet toegestaan.'
		);
	} else {
		lastNameInput.setCustomValidity('');
	}
}