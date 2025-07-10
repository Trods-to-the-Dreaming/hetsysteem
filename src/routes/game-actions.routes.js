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
	showActions,
	showSurvive,
	handleSurvive,
	showTrade,
	handleTrade,
	showSpendTime,
	handleSpendTime,
	showApply,
	showResign,
	showRecruit,
	showFire
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

// Actions menu
router.get("/", requireAuthenticatedAndCustomized, showActions);

// Survive
router.get( "/survive", requireAuthenticatedAndCustomized, showSurvive);
router.post("/survive", requireAuthenticatedAndCustomized, handleSurvive);

// Trade
router.get( "/trade", requireAuthenticatedAndCustomized, showTrade);
router.post("/trade", requireAuthenticatedAndCustomized, handleTrade);

// Spend time
router.get( "/spend-time", requireAuthenticatedAndCustomized, showSpendTime);
router.post("/spend-time", requireAuthenticatedAndCustomized, handleSpendTime);

// (to do)
router.get("/apply", requireAuthenticatedAndCustomized, showApply);
router.get("/resign", requireAuthenticatedAndCustomized, showResign);
router.get("/recruit", requireAuthenticatedAndCustomized, showRecruit);
router.get("/fire", requireAuthenticatedAndCustomized, showFire);

//=== Export ====================================================================================//
export default {
	path: "/game/actions",
	router
};