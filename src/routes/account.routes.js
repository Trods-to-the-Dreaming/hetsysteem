import express from "express";
import accountController from "../controllers/account.controllers.js";
import requireAuth from"../middleware/auth.middleware.js";

const router = express.Router();

router.get("/menu", requireAuth, accountController.showAccountMenu);
router.get("/changeusername", requireAuth, accountController.showChangeUsername);
router.post("/changeusername", requireAuth, accountController.handleChangeUsername);
router.get("/changepassword", requireAuth, accountController.showChangePassword);
router.post("/changepassword", requireAuth, accountController.handleChangePassword);

export default {
    path: "/account",
    router
};