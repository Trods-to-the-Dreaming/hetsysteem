export function validateName(nameInput) {
	const name = nameInput.value;
	const minLength = 2;
	const maxLength = 32;
	const regex = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+)*$/;

	if (name.length < minLength) {
		nameInput.setCustomValidity(`Minimaal ${minLength} tekens vereist.`);
	} else if (name.length > maxLength) {
		nameInput.setCustomValidity(`Maximaal ${maxLength} tekens toegestaan.`);
	} /*else if (name !== name.trim()) {
		nameInput.setCustomValidity(
			'Spaties aan het begin of het einde zijn niet toegestaan.');
	}*/ else if (!regex.test(name)) {
		nameInput.setCustomValidity(
			'Dit is geen geldige naam.');
	} else {
		nameInput.setCustomValidity('');
	}
}