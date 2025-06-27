import express from "express";
import {
	processOrders
} from "../controllers/cron.controllers.js";

const router = express.Router();

router.get("/process-orders", processOrders);

export default {
	path: "/cron",
	router
};