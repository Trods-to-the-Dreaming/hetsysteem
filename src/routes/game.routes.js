const express = require("express");
const router = express.Router();
const { GameController } = require("../controllers/game.controllers.js");
const requireAuth = require("../middleware/auth.middleware.js");

router.get("/game/menu", requireAuth, GameController.showMenu);

module.exports = { router };