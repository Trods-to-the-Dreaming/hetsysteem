import bcrypt from 'bcrypt';

import { ok, fail } from '#utils/result.js';

import { ACCOUNT } from './reasons.js';

import {
	findUserById,
	findUserByName,
	insertUser,
	updateUsername,
	updatePassword
} from './repository.js';

//===============================================================================================//

export async function login(username, password) {
	const user = await findUserByName(username);
	if (!user) return fail(ACCOUNT.REASON.INVALID_CREDENTIALS);

	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK ) return fail(ACCOUNT.REASON.INVALID_CREDENTIALS);

	return ok(user);
}
//-----------------------------------------------------------------------------------------------//
export async function register(username, 
							   password) {
	const hashedPassword = await bcrypt.hash(password, 8);
	
	let id;
	try {
		[id] = await insertUser(username, hashedPassword);
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			return fail(ACCOUNT.REASON.USERNAME_TAKEN);
		}
		throw err;
	}
	
	const user = await findUserById(id);

	return ok(user);
}
//-----------------------------------------------------------------------------------------------//
export async function changeUsername(userId,
									 newUsername,
									 password) {
	const user = await findUserById(userId);
	
	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK) return fail(ACCOUNT.REASON.PASSWORD_WRONG);

	try {
		await updateUsername(userId, newUsername);
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			return fail(ACCOUNT.REASON.USERNAME_TAKEN);
		}
		throw err;
	}

	return ok();
}
//-----------------------------------------------------------------------------------------------//
export async function changePassword(userId, 
									 newPassword,
									 password) {
	const user = await findUserById(userId);
	
	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK) return fail(ACCOUNT.REASON.PASSWORD_WRONG);
	
	const hashedNewPassword = await bcrypt.hash(newPassword, 8);
	await updatePassword(userId, hashedNewPassword);

	return ok();
}