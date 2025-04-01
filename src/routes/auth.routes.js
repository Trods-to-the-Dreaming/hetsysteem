const express = require("express");
const router = express.Router();
const { AuthController } = require("../controllers/auth.controllers.js");

router.get("/auth/login", AuthController.showLogin);
router.post("/auth/login", AuthController.handleLogin);
router.get("/auth/register", AuthController.showRegister);
router.post("/auth/register", AuthController.handleRegister);
//router.get("/auth/changepassword", AuthController.showChangePassword);
//router.post("/auth/changepassword", AuthController.handleChangePassword);
router.get("/auth/account", AuthController.showAccount);
router.post("/auth/logout", AuthController.handleLogout);

module.exports = { router };