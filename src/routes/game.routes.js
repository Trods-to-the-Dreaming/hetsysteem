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
	showActions,
	showStatistics
} from "../controllers/game.controllers.js";
import {
	showSpendTime,
	showTrade,
	showApply,
	showResign,
	showRecruit,
	showFire
} from "../controllers/actions.controllers.js";

const router = express.Router();

router.get("/choose-world", requireAuth, showChooseWorld);
router.post("/choose-world", requireAuth, handleChooseWorld);
router.get("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, showCustomizeCharacter);
router.post("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, handleCustomizeCharacter);
router.get("/world", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showPlay);
router.get("/world/character", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showCharacter);
router.get("/world/actions", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showActions);
router.get("/world/actions/spend-time", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showSpendTime);
router.get("/world/actions/trade", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showTrade);
router.get("/world/actions/apply", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showApply);
router.get("/world/actions/resign", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showResign);
router.get("/world/actions/recruit", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showRecruit);
router.get("/world/actions/fire", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showFire);
router.get("/world/statistics", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showStatistics);

export default {
	path: "/game",
	router
};