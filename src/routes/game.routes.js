import express from "express";
import gameController from "../controllers/game.controllers.js";
import requireAuth from "../middleware/auth.middleware.js";
import setGameLocals from "../middleware/game.middleware.js";

const router = express.Router();

router.get("/menu", requireAuth, setGameLocals, gameController.showMenu);
router.post("/enter", requireAuth, setGameLocals, gameController.handleEnter);
router.get("/create-character", requireAuth, setGameLocals, gameController.showCreateCharacter);
router.post("/create-character", requireAuth, setGameLocals, gameController.handleCreateCharacter);

export default {
	path: "/game",
	router
};