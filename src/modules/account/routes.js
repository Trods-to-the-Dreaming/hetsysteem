import express from 'express';

import { loginRateLimiter } from '#middleware/rate-limit.js';
import { 
	requireGuest,
	requireAuthenticated
} from '#middleware/auth.js';

import { validate } from '#utils/validate.js';

import {
	loginSchema,
	registerSchema,
	changeUsernameSchema,
	changePasswordSchema
} from './validation.js';

import {
	showLogin,
	handleLogin,
	showRegister,
	handleRegister,	
	handleLogout,
	showAccount,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
} from './controller.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.get('/login',
	requireGuest,
	showLogin
);
//-----------------------------------------------------------------------------------------------//
router.post('/login',
	requireGuest,
	loginRateLimiter,
	validate(loginSchema, '/account/login'),
	handleLogin
);
//-----------------------------------------------------------------------------------------------//
router.post('/logout',
	requireAuthenticated,
	handleLogout
);
//-----------------------------------------------------------------------------------------------//
router.get('/register',
	requireGuest,
	showRegister
);
//-----------------------------------------------------------------------------------------------//
router.post('/register',
	requireGuest,
	loginRateLimiter,
	validate(registerSchema, '/account/register'),
	handleRegister
);
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireAuthenticated,
	showAccount
);
//-----------------------------------------------------------------------------------------------//
router.get('/change-username',
	requireAuthenticated,
	showChangeUsername
);
//-----------------------------------------------------------------------------------------------//
router.post('/change-username',
	requireAuthenticated,
	validate(changeUsernameSchema, '/account/change-username'),
	handleChangeUsername
);
//-----------------------------------------------------------------------------------------------//
router.get('/change-password',
	requireAuthenticated,
	showChangePassword
);
//-----------------------------------------------------------------------------------------------//
router.post('/change-password',
	requireAuthenticated,
	validate(changePasswordSchema, '/account/change-password'),
	handleChangePassword
);

//===============================================================================================//

export default {
    path: '/account',
    router
};