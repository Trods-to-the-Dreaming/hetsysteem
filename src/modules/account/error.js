export const ACCOUNT_ERROR = Object.freeze({
	INVALID_CREDENTIALS: {
		code: 'INVALID_CREDENTIALS',
		status: 401,
		message: 'Onbestaande gebruikersnaam of onjuist wachtwoord.'
	},
	INVALID_INVITATION_TOKEN: {
		code: 'INVALID_INVITATION_TOKEN',
		status: 401,
		message: 'Deze uitnodigingscode is niet (meer) geldig.'
	},
	USERNAME_TAKEN: {
		code: 'USERNAME_TAKEN',
		status: 409,
		message: 'Deze gebruikersnaam is al in gebruik.'
	},
	PASSWORD_WRONG: {
		code: 'PASSWORD_WRONG',
		status: 401,
		message: 'Het wachtwoord is onjuist.'
	}
});

//===============================================================================================//

export class AccountError extends Error {
	constructor({ status, code, message }) {
		super(message);
		
		this.name = 'AccountError';
		this.code = code;
		this.status = status;
	}
}