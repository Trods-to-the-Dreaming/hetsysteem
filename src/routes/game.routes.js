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
	showChooseWorld,
	handleChooseWorld,
	showCustomizeCharacter,
	handleCustomizeCharacter,
	showMenu
} from "../controllers/game.controllers.js";

//=== Constants =================================================================================//
const requireAuthenticatedAndSelected = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected
];

const requireAuthenticatedAndCustomized = [
	requireAuthenticated,
	requireWorldSelected,
	requireCharacterSelected,
	requireCharacterCustomized
];

//=== Main ======================================================================================//
const router = express.Router();

// Choose world
router.get( "/choose-world", requireAuthenticated, showChooseWorld);
router.post("/choose-world", requireAuthenticated, handleChooseWorld);

// Customize character
router.get( "/customize-character", requireAuthenticatedAndSelected, showCustomizeCharacter);
router.post("/customize-character", requireAuthenticatedAndSelected, handleCustomizeCharacter);

// Game menu
router.get("/", requireAuthenticatedAndCustomized, showMenu);

//=== Export ====================================================================================//
export default {
	path: "/game",
	router
};