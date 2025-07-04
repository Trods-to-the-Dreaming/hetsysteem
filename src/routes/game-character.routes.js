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
	showCharacter
} from "../controllers/game-character.controllers.js";

//=== Constants =================================================================================//
const requireAuthenticatedAndCustomized = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
];

//=== Main ======================================================================================//
const router = express.Router();

// Character
router.get("/", requireAuthenticatedAndCustomized, showCharacter);

//=== Export ====================================================================================//
export default {
	path: "/game/character",
	router
};