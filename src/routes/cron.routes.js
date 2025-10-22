//=== Imports ===================================================================================//
import express from 'express';
import {
	processActions
} from '#controllers/cron.controllers.js';

//=== Main ======================================================================================//
const router = express.Router();

router.get('/process-actions', processActions);

//=== Export ====================================================================================//
export default {
	path: '/cron',
	router
};