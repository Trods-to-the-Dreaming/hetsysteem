import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
//-----------------------------------------------------------------------------------------------//
import { 
	requireWorldEntered,
	requireCharacterCreated
} from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import { showCharacter } from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	requireWorldEntered,
	requireCharacterCreated,
	showCharacter
);

//===============================================================================================//

export default router;