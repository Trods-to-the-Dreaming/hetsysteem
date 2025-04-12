const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index.controllers.js");

router.get("/", indexController.showIndex);
router.get("/about", indexController.showAbout);
router.get("/rules", indexController.showRules);

module.exports = router;