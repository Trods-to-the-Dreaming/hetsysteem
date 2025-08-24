//=== Imports ===================================================================================//
import express from 'express';

import {
	showIndex,
	showAbout,
	showRules
} from '../controllers/index.controllers.js';

//=== Main ======================================================================================//
const router = express.Router();

router.get('/', showIndex);

router.get('/about', showAbout);

router.get('/rules', showRules);

//=== Export ====================================================================================//
export default {
	path: '/',
	router
};