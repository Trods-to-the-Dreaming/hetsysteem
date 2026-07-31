import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { enterWorldSchema } from './validation.js';
import {
	showEnterWorld,
	handleEnterWorld,
} from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	showEnterWorld
);
//-----------------------------------------------------------------------------------------------//
router.post('/',
	requireLogin,
	requireValidation(enterWorldSchema),
	handleEnterWorld
);

//===============================================================================================//

export default router;