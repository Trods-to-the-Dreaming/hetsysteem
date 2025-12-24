import express from 'express';

import { requireAuthenticated } from '#middleware/auth.js';
import { requireWorldSession } from './middleware.js';

import { validate } from '#utils/validate.js';

import {
	enterWorldSchema
} from './validation.js';

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
} from './controller.js';

//===============================================================================================//

const requireGameAccess = [
	requireAuthenticated,
	requireWorldSession
];

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/enter-world',
	requireAuthenticated, 
	showEnterWorld
);
//-----------------------------------------------------------------------------------------------//
router.post('/enter-world',
	requireAuthenticated,
	validate(enterWorldSchema, '/game/enter-world'),
	handleEnterWorld
);
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireGameAccess,
	showMenu
);
//-----------------------------------------------------------------------------------------------//
router.get('/character',
	requireGameAccess,
	showCharacter
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/start',
	requireGameAccess,
	startTurn
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/customize-character',
	requireGameAccess,
	showCustomizeCharacter
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/manage-buildings',
	requireGameAccess,
	showManageBuildings
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/manage-employment-contracts',
	requireGameAccess,
	showManageEmploymentContracts
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/manage-rental-agreements',
	requireGameAccess,
	showManageRentalAgreements
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/produce',
	requireGameAccess,
	showProduce
);//-----------------------------------------------------------------------------------------------//
router.get('/turn/trade',
	requireGameAccess,
	showTrade
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/share',
	requireGameAccess,
	showShare
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/consume',
	requireGameAccess,
	showConsume
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/manage-group',
	requireGameAccess,
	showManageGroup
);
//-----------------------------------------------------------------------------------------------//
router.post('/turn/finish',
	requireGameAccess,
	validate(finishTurnSchema, '/game/turn/finish'),
	finishTurn
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/is-character-name-available',
	requireGameAccess,
	isCharacterNameAvailable
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/is-building-name-available',
	requireGameAccess,
	isBuildingNameAvailable
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/character-name-conflict',
	requireGameAccess,
	showCharacterNameConflict
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/building-names-conflict',
	requireGameAccess,
	showBuildingNamesConflict
);
//-----------------------------------------------------------------------------------------------//
router.get('/statistics',
	requireGameAccess,
	showStatistics
);

//===============================================================================================//

export default {
	path: '/game',
	router
};