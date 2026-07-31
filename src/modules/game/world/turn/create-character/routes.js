import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	limitReserveCharacterNameRate,
	requireWorldEntered,
	requireCanPlayTurn
} from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import { reserveCharacterNameSchema } from './validation.js';
import {
	showCreateCharacter,
	handleReserveCharacterName,
	showNoNewCharacters
} from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	showCreateCharacter
);
//-----------------------------------------------------------------------------------------------//
router.post('/reserve-character-name',
	limitReserveCharacterNameRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(reserveCharacterNameSchema),
	handleReserveCharacterName
);
//-----------------------------------------------------------------------------------------------//
router.get('/no-new-characters',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	showNoNewCharacters
);

//===============================================================================================//

export default router;