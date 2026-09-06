import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { requireLogin } from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	limitStartTurnRate,
	limitFinishTurnRate,
	requireWorldEntered,
	requireCanPlayTurn,
	requireToken
} from '#modules/game/middleware.js';
//-----------------------------------------------------------------------------------------------//
import {
	startTurnSchema,
	finishTurnSchema,
	checkTurnVersionSchema
} from './validation.js';
import {
	showStartTurn,
	handleStartTurn,
	showFinishTurn,
	handleFinishTurn,
	triggerProcessActions
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
router.get('/start',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	showStartTurn
);
//-----------------------------------------------------------------------------------------------//
router.post('/start',
	limitStartTurnRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(startTurnSchema),
	handleStartTurn
);
//-----------------------------------------------------------------------------------------------//
router.get('/finish',
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	showFinishTurn
);
//-----------------------------------------------------------------------------------------------//
router.post('/finish',
	limitFinishTurnRate,
	requireLogin,
	requireWorldEntered,
	requireCanPlayTurn,
	requireValidation(finishTurnSchema),
	handleFinishTurn
);
//-----------------------------------------------------------------------------------------------//
router.get('/process-actions',
	//requireToken,
	triggerProcessActions
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