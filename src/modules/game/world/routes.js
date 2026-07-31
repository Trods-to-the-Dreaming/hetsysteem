import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
//-----------------------------------------------------------------------------------------------//
import { requireWorldEntered } from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import { showMenu } from './controller.js';
//-----------------------------------------------------------------------------------------------//
import turnRouter 		from './turn/routes.js';
import characterRouter 	from './character/routes.js';
import statisticsRouter from './statistics/routes.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/menu',
	requireLogin,
	requireWorldEntered,
	showMenu
);
//-----------------------------------------------------------------------------------------------//
router.use('/turn', 	  turnRouter);
router.use('/character',  characterRouter);
router.use('/statistics', statisticsRouter);

//===============================================================================================//

export default router;