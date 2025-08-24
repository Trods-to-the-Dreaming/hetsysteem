//=== Imports ===================================================================================//
import express from 'express';
/*import {
	processOrders
} from '../controllers/cron.controllers.js';*/

//=== Main ======================================================================================//
const router = express.Router();

//router.get('/process-orders', processOrders);

//=== Export ====================================================================================//
export default {
	path: '/cron',
	router
};