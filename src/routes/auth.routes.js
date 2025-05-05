import express from "express";
import {
	showLogin,
	handleLogin,
	showRegister,
	handleRegister,	
	handleLogout
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/login", showLogin);
router.post("/login", handleLogin);
router.get("/register", showRegister);
router.post("/register", handleRegister);
router.post("/logout", handleLogout);

export default {
    path: "/auth",
    router
};
