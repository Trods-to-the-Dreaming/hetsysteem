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
	showMenu,
	showCharacter,
	showStatistics
} from "../controllers/game.controllers.js";
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
} from "../controllers/actions.controllers.js";

const router = express.Router();

router.get("/choose-world", requireAuth, showChooseWorld);
router.post("/choose-world", requireAuth, handleChooseWorld);
router.get("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, showCustomizeCharacter);
router.post("/customize-character", requireAuth, requireWorldSelected, requireCharacterSelected, handleCustomizeCharacter);
router.get("/menu", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showMenu);
router.get("/character", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showCharacter);

router.get("/actions", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showActions);
router.get("/actions/survive", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showSurvive);
router.get("/actions/trade", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showTrade);
router.post("/actions/trade", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, handleTrade);
router.get("/actions/spend-time", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showSpendTime);
router.get("/actions/apply", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showApply);
router.get("/actions/resign", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showResign);
router.get("/actions/recruit", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showRecruit);
router.get("/actions/fire", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showFire);

router.get("/statistics", requireAuth, requireWorldSelected, requireCharacterSelected, requireCharacterCustomized, showStatistics);

export default {
	path: "/game",
	router
};