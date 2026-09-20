import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	limitLoadTurnRate,
	limitSaveTurnRate,
	requireWorldEntered,
	requireCanPlayTurn,
	requireToken
} from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import {
	saveTurnSchema
} from './validation.js';
import {
	handleLoadTurn,
	handleSaveTurn,
	triggerProcessTurn
} from './controller.js';
//-----------------------------------------------------------------------------------------------//
import createCharacterRouter 		   from './create-character/routes.js';
import manageBuildingsRouter 		   from './manage-buildings/routes.js';
import manageEmploymentContractsRouter from './manage-employment-contracts/routes.js';
import manageRentalAgreementsRouter    from './manage-rental-agreements/routes.js';
import produceRouter 				   from './produce/routes.js';
import tradeRouter 					   from './trade/routes.js';
import shareRouter 					   from './share/routes.js';
import manageTimeRouter 			   from './manage-time/routes.js';
import consumeRouter 				   from './consume/routes.js';
import manageCooperativeRouter 	   	   from './manage-cooperative/routes.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.post('/load',
	limitLoadTurnRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	handleLoadTurn
);
//-----------------------------------------------------------------------------------------------//
router.post('/save',
	limitSaveTurnRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(saveTurnSchema),
	handleSaveTurn
);
//-----------------------------------------------------------------------------------------------//
router.get('/process',
	//requireToken,
	triggerProcessTurn
);
//-----------------------------------------------------------------------------------------------//
router.use('/create-character', 		   createCharacterRouter);
router.use('/manage-buildings', 		   manageBuildingsRouter);
router.use('/manage-employment-contracts', manageEmploymentContractsRouter);
router.use('/manage-rental-agreements',    manageRentalAgreementsRouter);
router.use('/produce', 					   produceRouter);
router.use('/trade', 					   tradeRouter);
router.use('/share', 					   shareRouter);
router.use('/manage-time', 			   	   manageTimeRouter);
router.use('/consume', 					   consumeRouter);
router.use('/manage-cooperative', 		   manageCooperativeRouter);

//===============================================================================================//

export default router;