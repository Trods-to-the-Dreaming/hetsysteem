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
	showStatistics
} from "../controllers/game-statistics.controllers.js";

//=== Constants =================================================================================//
const requireAuthenticatedAndCustomized = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
];

//=== Main ======================================================================================//
const router = express.Router();

// Statistics
router.get("/", requireAuthenticatedAndCustomized, showStatistics);

//=== Export ====================================================================================//
export default {
	path: "/game/statistics",
	router
};