import express from "express";
import accountController from "../controllers/account.controllers.js";
import requireAuth from"../middleware/auth.middleware.js";

const router = express.Router();

router.get("/account/menu", requireAuth, accountController.showAccountMenu);
router.get("/account/changeusername", requireAuth, accountController.showChangeUsername);
router.post("/account/changeusername", requireAuth, accountController.handleChangeUsername);
router.get("/account/changepassword", requireAuth, accountController.showChangePassword);
router.post("/account/changepassword", requireAuth, accountController.handleChangePassword);

export default router;