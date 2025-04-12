const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controllers.js");
const requireAuth = require("../middleware/auth.middleware.js");

router.get("/account/menu", requireAuth, accountController.showAccountMenu);
router.get("/account/changeusername", requireAuth, accountController.showChangeUsername);
router.post("/account/changeusername", requireAuth, accountController.handleChangeUsername);
router.get("/account/changepassword", requireAuth, accountController.showChangePassword);
router.post("/account/changepassword", requireAuth, accountController.handleChangePassword);

module.exports = router;