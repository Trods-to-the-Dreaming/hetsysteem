import express from "express";
import { requireAuth } from"../middleware/auth.middleware.js";
import {
	showAccountMenu,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
} from "../controllers/account.controllers.js";

const router = express.Router();

router.get("/menu", requireAuth, showAccountMenu);
router.get("/changeusername", requireAuth, showChangeUsername);
router.post("/changeusername", requireAuth, handleChangeUsername);
router.get("/changepassword", requireAuth, showChangePassword);
router.post("/changepassword", requireAuth, handleChangePassword);

export default {
    path: "/account",
    router
};