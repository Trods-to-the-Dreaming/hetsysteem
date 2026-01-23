export function validateCharacterFirstName(firstNameInput) {
	const name = firstNameInput.value;
	const minLength = 3;
	const maxLength = 20;
	const regex = /^\p{L}+(?:[ '-]\p{L}+)*$/u;

	if (name.length < minLength) {
		firstNameInput.setCustomValidity(
			`De voornaam moet minstens ${minLength} tekens lang zijn.`
		);
	} else if (name.length > maxLength) {
		firstNameInput.setCustomValidity(
			`De voornaam mag hoogstens ${maxLength} tekens lang zijn.`
		);
	} else if (!regex.test(name)) {
		firstNameInput.setCustomValidity(
			'Dit is geen geldige voornaam.'
		);
	} else if (name !== name.trim()) {
		firstNameInput.setCustomValidity(
			'Spaties aan het begin of het einde zijn niet toegestaan.'
		);
	} else {
		firstNameInput.setCustomValidity('');
	}
}