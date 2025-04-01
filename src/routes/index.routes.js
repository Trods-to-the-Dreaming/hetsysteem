const express = require("express");
const router = express.Router();
const { IndexController } = require("../controllers/index.controllers.js");

router.get("/", IndexController.showIndex);
router.get("/rules", IndexController.showRules);

module.exports = { router };