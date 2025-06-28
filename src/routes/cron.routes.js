import express from "express";
import {
	//processOrders,
	test
} from "../controllers/cron.controllers.js";

const router = express.Router();

//router.get("/process-orders", processOrders);
router.get("/test", test);

export default {
	path: "/cron",
	router
};