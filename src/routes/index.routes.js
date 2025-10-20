//=== Imports ===================================================================================//
import express from 'express';

import {
	showIndex,
	showAbout/*,
	showGameMechanics*/
} from '../controllers/index.controllers.js';

//=== Main ======================================================================================//
const router = express.Router();

router.get('/', showIndex);

router.get('/about', showAbout);

//router.get('/game-mechanics', showGameMechanics);

//=== Export ====================================================================================//
export default {
	path: '/',
	router
};