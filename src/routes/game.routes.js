//=== Imports ===================================================================================//
import express from 'express';

import { 
	requireAuthenticated
} from '../middleware/auth.middleware.js';

import {
	requireWorldSession/*,
	requireCharacterSelected,
	requireCharacterCustomized*/
} from '../middleware/game.middleware.js';

import {
	showChooseWorld,
	handleChooseWorld/*,
	showCustomizeCharacter,
	handleCustomizeCharacter*/,
	showMenu,
	showCharacter,
	showTurn,
	showCustomizeCharacter,
	showManageBuildings,
	showManageEmploymentContracts,
	showManageRentalAgreements,
	showProduce,
	showTrade,
	showShare,
	showConsume,
	showManageGroup/*,
	handleTurn,
	showStatistics*/
} from '../controllers/game.controllers.js';

//=== Constants =================================================================================//
const requireGameAccess = [
	requireAuthenticated,
	requireWorldSession
];

/*const requireAuthenticatedAndCustomized = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
];*/

//=== Main ======================================================================================//
const router = express.Router();

router.get( '/choose-world', requireAuthenticated, showChooseWorld);
router.post('/choose-world', requireAuthenticated, handleChooseWorld);

//router.get( '/setup/customize-character', requireAuthenticatedAndSelected, showCustomizeCharacter);
//router.post('/setup/customize-character', requireAuthenticatedAndSelected, handleCustomizeCharacter);

router.get( '/', requireGameAccess, showMenu);

router.get( '/character', requireGameAccess, showCharacter);

router.get( '/turn', requireGameAccess, showTurn);
router.get( '/turn/customize-character', requireGameAccess, showCustomizeCharacter);
router.get( '/turn/manage-buildings', requireGameAccess, showManageBuildings);
router.get( '/turn/manage-employment-contracts', requireGameAccess, showManageEmploymentContracts);
router.get( '/turn/manage-rental-agreements', requireGameAccess, showManageRentalAgreements);
router.get( '/turn/produce', requireGameAccess, showProduce);
router.get( '/turn/trade', requireGameAccess, showTrade);
router.get( '/turn/share', requireGameAccess, showShare);
router.get( '/turn/consume', requireGameAccess, showConsume);
router.get( '/turn/manage-group', requireGameAccess, showManageGroup);
//router.post('/turn', requireAuthenticatedAndCustomized, handleTurn);

//router.get('/statistics', requireAuthenticatedAndCustomized, showStatistics);

//=== Export ====================================================================================//
export default {
	path: '/game',
	router
};