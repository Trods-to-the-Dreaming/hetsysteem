import express from 'express';
//-----------------------------------------------------------------------------------------------//
import { 
	requireGuest,
	requireLogin
} from '#middleware/auth.js';
import { requireValidation } from '#middleware/validate.js';
//-----------------------------------------------------------------------------------------------//
import { 
	limitLoginRate,
	limitRegisterRate,
	limitChangeUsernameRate,
	limitChangePasswordRate
} from './middleware.js';
import {
	loginSchema,
	registerSchema,
	changeUsernameSchema,
	changePasswordSchema
} from './validation.js';
import {
	showLogin,
	handleLogin,
	handleLogout,
	showRegister,
	handleRegister,
	handleDeregister,
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
	limitLoginRate,
	requireGuest,
	requireValidation(loginSchema),
	handleLogin
);
//-----------------------------------------------------------------------------------------------//
router.post('/logout',
	requireLogin,
	handleLogout
);
//-----------------------------------------------------------------------------------------------//
router.get('/register',
	requireGuest,
	showRegister
);
//-----------------------------------------------------------------------------------------------//
router.post('/register',
	limitRegisterRate,
	requireGuest,
	requireValidation(registerSchema),
	handleRegister
);
//-----------------------------------------------------------------------------------------------//
router.post('/deregister',
	requireLogin,
	handleDeregister
);
//-----------------------------------------------------------------------------------------------//
router.get('/',
	requireLogin,
	showAccount
);
//-----------------------------------------------------------------------------------------------//
router.get('/change-username',
	requireLogin,
	showChangeUsername
);
//-----------------------------------------------------------------------------------------------//
router.post('/change-username',
	limitChangeUsernameRate,
	requireLogin,
	requireValidation(changeUsernameSchema),
	handleChangeUsername
);
//-----------------------------------------------------------------------------------------------//
router.get('/change-password',
	requireLogin,
	showChangePassword
);
//-----------------------------------------------------------------------------------------------//
router.post('/change-password',
	limitChangePasswordRate,
	requireLogin,
	requireValidation(changePasswordSchema),
	handleChangePassword
);

//===============================================================================================//

export default router;