//=== Imports ===================================================================================//
import express from "express";

import { 
	requireAuthenticated 
} from"../middleware/auth.middleware.js";

import {
	showLogin,
	handleLogin,
	showRegister,
	handleRegister,	
	handleLogout,
	showAccount,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
} from "../controllers/account.controllers.js";

//=== Main ======================================================================================//
const router = express.Router();

// Log in
router.get( "/login", showLogin);
router.post("/login", handleLogin);

// Register
router.get( "/register", showRegister);
router.post("/register", handleRegister);

// Log out
router.post("/logout", handleLogout);

// Account
router.get("/", requireAuthenticated, showAccount);

// Change username
router.get( "/change-username", requireAuthenticated, showChangeUsername);
router.post("/change-username",	requireAuthenticated, handleChangeUsername);

// Change password
router.get( "/change-password", requireAuthenticated, showChangePassword);
router.post("/change-password", requireAuthenticated, handleChangePassword);

//=== Export ====================================================================================//
export default {
    path: "/account",
    router
};