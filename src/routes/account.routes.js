import express from "express";
import { requireAuth } from"../middleware/auth.middleware.js";
import {
	showAccount,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
} from "../controllers/account.controllers.js";

const router = express.Router();

router.get("", requireAuth, showAccount);
router.get("/change-username", requireAuth, showChangeUsername);
router.post("/change-username", requireAuth, handleChangeUsername);
router.get("/change-password", requireAuth, showChangePassword);
router.post("/change-password", requireAuth, handleChangePassword);

export default {
    path: "/account",
    router
};