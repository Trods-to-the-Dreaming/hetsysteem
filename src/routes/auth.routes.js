const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers.js");

router.get("/auth/login", authController.showLogin);
router.post("/auth/login", authController.handleLogin);
router.get("/auth/register", authController.showRegister);
router.post("/auth/register", authController.handleRegister);
router.post("/auth/logout", authController.handleLogout);

module.exports = router;