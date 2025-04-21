const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controllers.js");
const requireAuth = require("../middleware/auth.middleware.js");

router.get("/game/menu", requireAuth, gameController.showMenu);
router.post("/game/enter", gameController.handleEnter);
router.get("/game/enter", requireAuth, gameController.showEnter);

module.exports = router;