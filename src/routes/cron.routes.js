//=== Imports ===================================================================================//
import express from "express";
import {
	processOrders/*,
	test*/
} from "../controllers/cron.controllers.js";

//=== Main ======================================================================================//
const router = express.Router();

router.get("/process-orders", processOrders);
//router.get("/test", test);

//=== Export ====================================================================================//
export default {
	path: "/cron",
	router
};