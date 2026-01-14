import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { 
	requireLogin
} from '#middleware/auth.js';
import { 
	validate
} from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	requireWorldEntered,
	requireToken
} from './middleware.js';
import {
	enterWorldSchema,
	finishTurnSchema,
	checkCharacterNameSchema,
	checkBuildingNameSchema
} from './validation.js';
import {
	showEnterWorld,
	handleEnterWorld,
	showMenu,
	showCharacter,
	showStartTurn,
	showCustomizeCharacter,
	showManageBuildings,
	showManageEmploymentContracts,
	showManageRentalAgreements,
	showProduce,
	showTrade,
	showShare,
	showConsume,
	showManageGroup,
	handleFinishTurn,
	handleCheckCharacterName,
	handleCheckBuildingName,
	showResolveNameConflicts,
	showStatistics,
	triggerProcessActions
} from './controller.js';

//===============================================================================================//

const requireGameAccess = [
	requireLogin,
	requireWorldEntered
];

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/enter-world',
	requireLogin, 
	showEnterWorld
);
//-----------------------------------------------------------------------------------------------//
router.post('/enter-world',
	requireLogin,
	validate(enterWorldSchema),
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
	showStartTurn
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
	validate(finishTurnSchema),
	handleFinishTurn
);
//-----------------------------------------------------------------------------------------------//
router.post('/turn/check-character-name',
	requireGameAccess,
	validate(checkCharacterNameSchema),
	handleCheckCharacterName
);
//-----------------------------------------------------------------------------------------------//
router.post('/turn/check-building-name',
	requireGameAccess,
	validate(checkBuildingNameSchema),
	handleCheckBuildingName
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/resolve-name-conflicts',
	requireGameAccess,
	showResolveNameConflicts
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/process-actions',
	requireToken,
	triggerProcessActions
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