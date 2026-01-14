import rateLimit from 'express-rate-limit';

//===============================================================================================//

export const limitLoginRate = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
});
//-----------------------------------------------------------------------------------------------//
export const limitRegisterRate = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
});
//-----------------------------------------------------------------------------------------------//
export const limitChangeUsernameRate = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: req => req.session.userId,
});

//-----------------------------------------------------------------------------------------------//
export const limitChangePasswordRate = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: req => req.session.userId,
});