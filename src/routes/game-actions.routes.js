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
	showTrade,
	handleTrade,
	showSpendTime,
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
router.get("/survive", requireAuthenticatedAndCustomized, showSurvive);

// Trade
router.get( "/trade", requireAuthenticatedAndCustomized, showTrade);
router.post("/trade", requireAuthenticatedAndCustomized, handleTrade);

// Spend time
router.get("/spend-time", requireAuthenticatedAndCustomized, showSpendTime);

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