export function validateName(nameInput) {
	const name = nameInput.value;
	const minLength = 2;
	const maxLength = 32;
	const regex = /^[A-Za-z0-9À-ÖØ-öø-ÿĀ-ž?!.]+(?:[ '-][A-Za-z0-9À-ÖØ-öø-ÿĀ-ž?!.]+)*$/;

	if (name.length < minLength) {
		nameInput.setCustomValidity(
			`De naam moet minstens ${minLength} tekens lang zijn.`
		);
	} else if (name.length > maxLength) {
		nameInput.setCustomValidity(
			`De naam mag hoogstens ${maxLength} tekens lang zijn.`
		);
	} else if (!regex.test(name)) {
		nameInput.setCustomValidity(
			'Dit is geen geldige naam.'
		);
	} else if (name !== name.trim()) {
		nameInput.setCustomValidity(
			'Spaties aan het begin of het einde zijn niet toegestaan.'
		);
	} else {
		nameInput.setCustomValidity('');
	}
}