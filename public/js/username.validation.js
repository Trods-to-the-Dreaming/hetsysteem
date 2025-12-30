export function validateUsername(username) {
	const value = username.value;
	const minLength = 3;
	const maxLength = 20;
	const allowedCharacters = /^[a-zA-Z0-9_]+$/;
	const doubleUnderscores = /__/;

	if (value.length < minLength) {
		username.setCustomValidity(`Minimaal ${minLength} tekens vereist.`);
	} else if (value.length > maxLength) {
		username.setCustomValidity(`Maximaal ${maxLength} tekens toegestaan.`);
	} else if (value.startsWith('_')) {
		username.setCustomValidity('Een underscore aan het begin is niet toegestaan.');
	} else if (value.endsWith('_')) {
		username.setCustomValidity('Een underscore aan het einde is niet toegestaan.');
	} else if (doubleUnderscores.test(value)) {
		username.setCustomValidity('Dubbele underscores zijn niet toegestaan.');
	} else if (!allowedCharacters.test(value)) {
		username.setCustomValidity('Enkel letters, cijfers en underscores zijn toegestaan.');
	} else {
		username.setCustomValidity('');
	}
}