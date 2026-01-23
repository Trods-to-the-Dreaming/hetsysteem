export function validateInvitationToken(invitationTokenInput) {
	const value = invitationTokenInput.value.trim().toUpperCase();
	const regex = /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/;

	if (!regex.test(value)) {
		invitationTokenInput.setCustomValidity(
			'De uitnodigingscode bestaat uit 16 letters of cijfers.');
	} else {
		invitationTokenInput.setCustomValidity('');
	}
}