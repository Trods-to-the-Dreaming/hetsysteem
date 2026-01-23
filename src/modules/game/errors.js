import { 
	GAME
} from './reasons.js';

//===============================================================================================//

export class GameError extends Error {
	constructor({ status, code, meta = {} }) {
		super(GAME.MESSAGE[code]);
		this.name = 'GameError';
		this.status = status;
		this.code = code;
		this.meta = meta;
	}
}