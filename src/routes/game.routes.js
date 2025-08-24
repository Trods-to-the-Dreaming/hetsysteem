//=== Imports ===================================================================================//
import express from 'express';

/*import { 
	requireAuthenticated
} from '../middleware/auth.middleware.js';

import {
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
} from '../middleware/game.middleware.js';

import {
	showChooseWorld,
	handleChooseWorld,
	showCustomizeCharacter,
	handleCustomizeCharacter,
	showMenu,
	showCharacter,
	showTurn,
	handleTurn,
	showStatistics
} from '../controllers/game.controllers.js';

//=== Constants =================================================================================//
const requireAuthenticatedAndSelected = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected
];

const requireAuthenticatedAndCustomized = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
];*/

//=== Main ======================================================================================//
const router = express.Router();

/*router.get( '/setup/choose-world', requireAuthenticated, showChooseWorld);
router.post('/setup/choose-world', requireAuthenticated, handleChooseWorld);

router.get( '/setup/customize-character', requireAuthenticatedAndSelected, showCustomizeCharacter);
router.post('/setup/customize-character', requireAuthenticatedAndSelected, handleCustomizeCharacter);

router.get( '/', requireAuthenticatedAndCustomized, showMenu);

router.get( '/character', requireAuthenticatedAndCustomized, showCharacter);

router.get( '/turn', requireAuthenticatedAndCustomized, showTurn);
router.post('/turn', requireAuthenticatedAndCustomized, handleTurn);

router.get('/statistics', requireAuthenticatedAndCustomized, showStatistics);*/

//=== Export ====================================================================================//
export default {
	path: '/game',
	router
};