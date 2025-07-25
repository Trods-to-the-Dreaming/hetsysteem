//=== Imports ===================================================================================//
import express from "express";

import { 
	requireAuthenticated
} from"../middleware/auth.middleware.js";

import {
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
} from "../middleware/game.middleware.js";

import {
	/*showManageBuildings,
	handleManageBuildings,
	showManageContracts,
	handleManageContracts,
	showSpendTime,
	handleSpendTime,
	showTrade,
	handleTrade,
	showSurvive,
	handleSurvive*/
} from "../controllers/game-actions.controllers.js";

//=== Constants =================================================================================//
const requireAuthenticatedAndCustomized = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
];

//=== Main ======================================================================================//
const router = express.Router();

/*router.get( "/",				 requireAuthenticatedAndCustomized, showCurrentAction);
router.get( "/manage-buildings", requireAuthenticatedAndCustomized, showManageBuildings);
router.post("/manage-buildings", requireAuthenticatedAndCustomized, handleManageBuildings);
router.get( "/manage-contracts", requireAuthenticatedAndCustomized, showManageContracts);
router.post("/manage-contracts", requireAuthenticatedAndCustomized, handleManageContracts);
router.get( "/spend-time", 		 requireAuthenticatedAndCustomized, showSpendTime);
router.post("/spend-time", 		 requireAuthenticatedAndCustomized, handleSpendTime);
router.get( "/trade", 			 requireAuthenticatedAndCustomized, showTrade);
router.post("/trade", 			 requireAuthenticatedAndCustomized, handleTrade);
router.get( "/survive", 		 requireAuthenticatedAndCustomized, showSurvive);
router.post("/survive", 		 requireAuthenticatedAndCustomized, handleSurvive);*/

//=== Export ====================================================================================//
export default {
	path: "/game/actions",
	router
};