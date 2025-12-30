import rateLimit from 'express-rate-limit';

//===============================================================================================//

export const loginRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
});
//-----------------------------------------------------------------------------------------------//
export const registerRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
});
//-----------------------------------------------------------------------------------------------//
export const changeUsernameRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: req => req.session.userId,
});

//-----------------------------------------------------------------------------------------------//
export const changePasswordRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: req => req.session.userId,
});