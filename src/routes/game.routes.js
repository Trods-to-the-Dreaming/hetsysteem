import express from "express";
import gameController from "../controllers/game.controllers.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/game/menu", requireAuth, gameController.showMenu);
router.post("/game/enter", gameController.handleEnter);
router.get("/game/enter", requireAuth, gameController.showEnter);

export default router;