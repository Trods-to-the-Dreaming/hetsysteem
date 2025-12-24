import { z } from 'zod';

//===============================================================================================//

const MIN_USR_LENGTH = 4;
const MAX_USR_LENGTH = 32;

const MIN_PWD_LENGTH = 10;
const MAX_PWD_LENGTH = 128;

//===============================================================================================//

const usernameSchema = z
	.string('Ongeldige gebruikersnaam.')
	.min(MIN_USR_LENGTH)
	.max(MAX_USR_LENGTH)
	.refine(usr => /^[a-zA-Z0-9]+$/.test(usr));

const passwordSchema = z
	.string()
	.min(MIN_PWD_LENGTH)
	.max(MAX_PWD_LENGTH)
	.refine(pwd => pwd.trim().replace(/\s+/g, " ") === pwd);

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
		currentPassword: z.string(),
		newPassword: passwordSchema,
		confirmedNewPassword: z.string()
	}).refine(
		passwordsMatch('newPassword', 'confirmedNewPassword'),
		{ path: ['confirmedNewPassword'] }
	);