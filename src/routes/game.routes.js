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
	showDashboard
} from "../controllers/game.controllers.js";

const router = express.Router();

router.get("/choose-world", requireAuth, showChooseWorld);
router.post("/choose-world", requireAuth, handleChooseWorld);
router.get("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, showCustomizeCharacter);
router.post("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, handleCustomizeCharacter);
router.get("/dashboard", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showDashboard);

export default {
	path: "/game",
	router
};