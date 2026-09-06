import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	requireWorldEntered,
	requireCharacterCreated
} from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import { showManageGroup } from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	requireWorldEntered,
	requireCharacterCreated,
	showManageGroup
);

//===============================================================================================//

export default router;