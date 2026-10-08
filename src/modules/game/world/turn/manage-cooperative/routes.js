import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	limitReserveNameRate,
	requireWorldEntered,
	requireCanPlayTurn
} from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import { 
	getCooperativeSchema,
	reserveCooperativeNameSchema,
	getCharacterSchema 
} from './validation.js';
import { 
	showManageCooperative,
	handleGetCooperative,
	handleReserveCooperativeName,
	handleGetCharacter
} from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	showManageCooperative
);
//-----------------------------------------------------------------------------------------------//
router.post('/get-cooperative',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(getCooperativeSchema),
	handleGetCooperative
);
//-----------------------------------------------------------------------------------------------//
router.post('/reserve-cooperative-name',
	limitReserveNameRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(reserveCooperativeNameSchema),
	handleReserveCooperativeName
);
//-----------------------------------------------------------------------------------------------//
router.post('/get-character',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(getCharacterSchema),
	handleGetCharacter
);

//===============================================================================================//

export default router;