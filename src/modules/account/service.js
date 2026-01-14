import bcrypt from 'bcrypt';
//-----------------------------------------------------------------------------------------------//
import { 
	ok, 
	fail 
} from '#utils/result.js';
import { 
	BadRequestError 
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	ACCOUNT 
} from './reasons.js';
import {
	findUserById,
	findUserByName,
	insertUser,
	updateUsername,
	updatePassword
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_USER = 'Deze gebruiker bestaat niet.';

//===============================================================================================//

export async function login({ username, 
							  password }) {
	const user = await findUserByName({ username });
	if (!user) 
		return fail({ reason: ACCOUNT.REASON.INVALID_CREDENTIALS });

	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK ) 
		return fail({ reason: ACCOUNT.REASON.INVALID_CREDENTIALS });

	return ok(user);
}
//-----------------------------------------------------------------------------------------------//
export async function register({ username, 
							     password }) {
	const hashedPassword = await bcrypt.hash(password, 8);
	
	let userId;
	try {
		[userId] = await insertUser({ 
			username, 
			hashedPassword 
		});
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY')
			return fail({ reason: ACCOUNT.REASON.USERNAME_TAKEN });
		
		throw err;
	}
	
	const user = await findUserById({ userId });
	if (!user) 
		throw new BadRequestError(MSG_INVALID_USER);

	return ok(user);
}
//-----------------------------------------------------------------------------------------------//
export async function changeUsername({ userId,
									   newUsername,
									   password }) {
	const user = await findUserById({ userId });
	if (!user) 
		throw new BadRequestError(MSG_INVALID_USER);
	
	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK) 
		return fail({ reason: ACCOUNT.REASON.PASSWORD_WRONG });

	try {
		await updateUsername({ 
			userId, 
			newUsername 
		});
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY')
			return fail({ reason: ACCOUNT.REASON.USERNAME_TAKEN });
		
		throw err;
	}

	return ok();
}
//-----------------------------------------------------------------------------------------------//
export async function changePassword({ userId, 
									   newPassword,
									   password }) {
	const user = await findUserById({ userId });
	if (!user) 
		throw new BadRequestError(MSG_INVALID_USER);
	
	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK) 
		return fail({ reason: ACCOUNT.REASON.PASSWORD_WRONG });
	
	const hashedNewPassword = await bcrypt.hash(newPassword, 8);
	await updatePassword({ 
		userId, 
		hashedNewPassword 
	});

	return ok();
}