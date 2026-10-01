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
	reserveBuildingNameSchema,
	cancelBuildingNameSchema
} from './validation.js';
import {
	showManageBuildings,
	handleReserveBuildingName,
	handleCancelBuildingName
} from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	showManageBuildings
);
//-----------------------------------------------------------------------------------------------//
router.post('/reserve-building-name',
	limitReserveNameRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(reserveBuildingNameSchema),
	handleReserveBuildingName
);
//-----------------------------------------------------------------------------------------------//
router.post('/cancel-building-name',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(cancelBuildingNameSchema),
	handleCancelBuildingName
);

//===============================================================================================//

export default router;