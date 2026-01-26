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
	requireCharacterCreated,
	requireNoCharacterCreated,
	requireToken
} from './middleware.js';
import {
	enterWorldSchema,
	createCharacterSchema/*,
	finishTurnSchema,
	checkCharacterNameSchema,
	checkBuildingNameSchema*/
} from './validation.js';
import {
	showEnterWorld,
	handleEnterWorld,
	showMenu,
	showCharacter,
	showCreateCharacter,
	handleCreateCharacter/*,
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
	showResolveNameConflicts*/,
	triggerProcessActions,
	showStatistics
} from './controller.js';

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
	requireLogin,
	requireWorldEntered,
	showMenu
);
//-----------------------------------------------------------------------------------------------//
router.get('/character',
	requireLogin,
	requireWorldEntered,
	requireCharacterCreated,
	showCharacter
);
//-----------------------------------------------------------------------------------------------//
router.get('/turn/create-character',
	requireLogin,
	requireWorldEntered,
	requireNoCharacterCreated,
	showCreateCharacter
);
//-----------------------------------------------------------------------------------------------//
router.post('/turn/create-character',
	requireLogin,
	requireWorldEntered,
	requireNoCharacterCreated,
	validate(createCharacterSchema),
	handleCreateCharacter
);
//-----------------------------------------------------------------------------------------------//
/*router.get('/turn/start',
	requireLogin,
	requireWorldEntered,
	requireCharacterCreated,
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
);*/
//-----------------------------------------------------------------------------------------------//
router.get('/turn/process-actions',
	//requireToken,
	triggerProcessActions
);
//-----------------------------------------------------------------------------------------------//
router.get('/statistics',
	requireLogin,
	requireWorldEntered,
	showStatistics
);

//===============================================================================================//

export default {
	path: '/game',
	router
};