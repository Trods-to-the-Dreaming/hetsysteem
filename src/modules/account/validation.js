import { z } from 'zod';

//===============================================================================================//

const MIN_USR_LENGTH = 3;
const MAX_USR_LENGTH = 20;

const MIN_PWD_LENGTH = 8;
const MAX_PWD_LENGTH = 64;

//===============================================================================================//

const usernameSchema = z
	.string()
	.min(MIN_USR_LENGTH)
	.max(MAX_USR_LENGTH)
	.refine(usr => !usr.startsWith('_'))
	.refine(usr => !usr.endsWith('_'))
	.refine(usr => !/__/.test(usr))
	.refine(usr => /^[a-zA-Z0-9_]+$/.test(usr));

const passwordSchema = z
	.string()
	.min(MIN_PWD_LENGTH)
	.max(MAX_PWD_LENGTH)
	.refine(pwd => pwd.trim() === pwd);

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