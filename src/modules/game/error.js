export const GAME_ERROR = Object.freeze({
	NO_NEW_CHARACTERS: {
		code: 'NO_NEW_CHARACTERS',
		status: 409,
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
	},
	TURN_ALREADY_EDITED: {
		code: 'TURN_ALREADY_EDITED',
		status: 409,
		message: 'De beurt wordt reeds bewerkt in een andere browser.'
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