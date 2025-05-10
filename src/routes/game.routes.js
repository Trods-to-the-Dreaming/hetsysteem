import express from "express";
import { requireAuth } from"../middleware/auth.middleware.js";
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
	showPlay,
	showCharacter,
	showInventory
} from "../controllers/game.controllers.js";

const router = express.Router();

router.get("/choose-world", requireAuth, showChooseWorld);
router.post("/choose-world", requireAuth, handleChooseWorld);
router.get("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, showCustomizeCharacter);
router.post("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, handleCustomizeCharacter);
router.get("/play", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showPlay);
router.get("/play/character", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showCharacter);
router.get("/play/inventory", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showInventory);

export default {
	path: "/game",
	router
};