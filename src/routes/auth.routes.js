import express from "express";
import authController from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/login", authController.showLogin);
router.post("/login", authController.handleLogin);
router.get("/register", authController.showRegister);
router.post("/register", authController.handleRegister);
router.post("/logout", authController.handleLogout);

export default {
    path: "/auth",
    router
};
