export function validateName({ nameInput,
							   minLength,
							   maxLength,
							   regex }) {
	const value = nameInput.value;

	if (value.length < minLength) {
		nameInput.setCustomValidity(
			`De naam moet minstens ${minLength} tekens lang zijn.`
		);
	} else if (value.length > maxLength) {
		nameInput.setCustomValidity(
			`De naam mag hoogstens ${maxLength} tekens lang zijn.`
		);
	} else if (value !== value.trim()) {
		nameInput.setCustomValidity(
			'Spaties aan het begin of het einde zijn niet toegestaan.'
		);
	} else if (!regex.test(value)) {
		nameInput.setCustomValidity(
			'Dit is geen geldige naam.'
		);
	} else {
		nameInput.setCustomValidity('');
	}
}