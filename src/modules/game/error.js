export const GAME_ERROR = Object.freeze({
	NO_NEW_CHARACTERS: {
		code: 'NO_NEW_CHARACTERS',
		status: 401,
		message: 'Het personage kan niet worden aangemaakt, omdat de wereld ondertussen vol is.'
	},
	CHARACTER_NAME_TAKEN: {
		code: 'CHARACTER_NAME_TAKEN',
		status: 409,
		message: 'Er bestaat reeds een personage met deze naam.'
	},
	BUILDING_NAME_TAKEN: {
		code: 'BUILDING_NAME_TAKEN',
		status: 409,
		message: 'Er bestaat reeds een gebouw met deze naam.'
	}
});

//===============================================================================================//

export class GameError extends Error {
	constructor({ status, code, message }) {
		super(message);
		
		this.name = 'GameError';
		this.code = code;
		this.status = status;
	}
}