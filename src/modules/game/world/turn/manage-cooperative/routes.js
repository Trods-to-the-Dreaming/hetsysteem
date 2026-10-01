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
import { reserveCooperativeNameSchema } from './validation.js';
import { 
	showManageCooperative,
	handleReserveCooperativeName
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
router.post('/reserve-cooperative-name',
	limitReserveNameRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(reserveCooperativeNameSchema),
	handleReserveCooperativeName
);

//===============================================================================================//

export default router;