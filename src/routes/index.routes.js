import express from "express";
import indexController from "../controllers/index.controllers.js";

const router = express.Router();

router.get("/", indexController.showIndex);
router.get("/about", indexController.showAbout);
router.get("/rules", indexController.showRules);

export default {
	path: "/",
	router
};