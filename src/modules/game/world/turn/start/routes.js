import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { 
	requireLogin
} from '#middleware/auth.js';
//-----------------------------------------------------------------------------------------------//
import { 
	requireWorldEntered,
	requireCharacterCreated
} from './middleware.js';
import {
	enterWorldSchema,
	createCharacterSchema,
	finishTurnSchema,
	checkTurnEditVersionSchema,
	reserveBuildingNameSchema,
	cancelBuildingNameSchema
} from './validation.js';
import {
	showStartTurn,
	handleStartTurn
} from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	requireWorldEntered,
	requireCharacterCreated,
	showStartTurn
);
//-----------------------------------------------------------------------------------------------//
router.post('/',
	requireLogin,
	requireWorldEntered,
	requireCharacterCreated,
	handleStartTurn
);

//===============================================================================================//

export default router;