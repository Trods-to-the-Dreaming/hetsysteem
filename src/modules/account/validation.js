import { z } from 'zod';

//===============================================================================================//

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

//===============================================================================================//

const usernameSchema = z
	.string()
	.min(MIN_USERNAME_LENGTH)
	.max(MAX_USERNAME_LENGTH)
	.regex(/^[A-Za-z0-9_]+$/)
	.refine((usr) => !usr.startsWith('_'))
	.refine((usr) => !usr.endsWith('_'))
	.refine((usr) => !usr.includes('__'));
//-----------------------------------------------------------------------------------------------//
const passwordSchema = z
	.string()
	.min(MIN_PASSWORD_LENGTH)
	.max(MAX_PASSWORD_LENGTH)
	.refine((pwd) => pwd.trim() === pwd);

//===============================================================================================//

function passwordsMatch(password, confirmedPassword) {
	return (data) => data[password] === data[confirmedPassword];
}

//===============================================================================================//

export const loginSchema = z.object({
		username: z.string(),
		password: z.string()
	});
//-----------------------------------------------------------------------------------------------//
export const registerSchema = z.object({
		username: usernameSchema,
		password: passwordSchema,
		confirmedPassword: z.string()
	}).refine(
		passwordsMatch('password', 'confirmedPassword'),
		{ path: ['confirmedPassword'] }
	);
//-----------------------------------------------------------------------------------------------//
export const changeUsernameSchema = z.object({
		newUsername: usernameSchema,
		password: z.string()
	});
//-----------------------------------------------------------------------------------------------//
export const changePasswordSchema = z.object({
		password: z.string(),
		newPassword: passwordSchema,
		confirmedNewPassword: z.string()
	}).refine(
		passwordsMatch('newPassword', 'confirmedNewPassword'),
		{ path: ['confirmedNewPassword'] }
	);