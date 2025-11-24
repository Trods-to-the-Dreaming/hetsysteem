//=== Imports ===================================================================================//

import express from 'express';

import { 
	requireAuthenticated
} from '#middleware/auth.middleware.js';

import {
	requireWorldSession
} from '#middleware/game.middleware.js';

import {
	showEnterWorld,
	handleEnterWorld,
	showMenu,
	showCharacter,
	startTurn,
	showCustomizeCharacter,
	showManageBuildings,
	showManageEmploymentContracts,
	showManageRentalAgreements,
	showProduce,
	showTrade,
	showShare,
	showConsume,
	showManageGroup,
	finishTurn,
	isCharacterNameAvailable,
	isBuildingNameAvailable,
	showCharacterNameConflict,
	showBuildingNamesConflict,
	showStatistics
} from '#controllers/game.controllers.js';

//=== Constants =================================================================================//

const requireGameAccess = [
	requireAuthenticated,
	requireWorldSession
];

//=== Main ======================================================================================//

const router = express.Router();

router.get( '/enter-world', requireAuthenticated, showEnterWorld);
router.post('/enter-world', requireAuthenticated, handleEnterWorld);

router.get( '/', 								 requireGameAccess, showMenu);
router.get( '/character', 						 requireGameAccess, showCharacter);
router.get( '/turn/start', 						 requireGameAccess, startTurn);
router.get( '/turn/customize-character', 		 requireGameAccess, showCustomizeCharacter);
router.get( '/turn/manage-buildings', 			 requireGameAccess, showManageBuildings);
router.get( '/turn/manage-employment-contracts', requireGameAccess, showManageEmploymentContracts);
router.get( '/turn/manage-rental-agreements', 	 requireGameAccess, showManageRentalAgreements);
router.get( '/turn/produce', 					 requireGameAccess, showProduce);
router.get( '/turn/trade', 						 requireGameAccess, showTrade);
router.get( '/turn/share', 						 requireGameAccess, showShare);
router.get( '/turn/consume', 					 requireGameAccess, showConsume);
router.get( '/turn/manage-group', 				 requireGameAccess, showManageGroup);
router.post('/turn/finish', 					 requireGameAccess, finishTurn);
router.get( '/turn/is-character-name-available', requireGameAccess, isCharacterNameAvailable);
router.get( '/turn/is-building-name-available',  requireGameAccess, isBuildingNameAvailable);
router.get( '/turn/character-name-conflict',     requireGameAccess, showCharacterNameConflict);
router.get( '/turn/building-names-conflict', 	 requireGameAccess, showBuildingNamesConflict);
router.get( '/statistics', 					 	 requireGameAccess, showStatistics);

//=== Export ====================================================================================//

export default {
	path: '/game',
	router
};