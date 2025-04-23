import express from "express";
import authController from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/auth/login", authController.showLogin);
router.post("/auth/login", authController.handleLogin);
router.get("/auth/register", authController.showRegister);
router.post("/auth/register", authController.handleRegister);
router.post("/auth/logout", authController.handleLogout);

export default router;