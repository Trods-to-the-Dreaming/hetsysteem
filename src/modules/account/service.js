import bcrypt from 'bcrypt';
//-----------------------------------------------------------------------------------------------//
import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import { 
	ACCOUNT_ERROR,
	AccountError 
} from './error.js';
import {
	findUserById,
	findUserByName,
	lockInvitation,
	insertUser,
	deleteUser,
	insertTurns,
	updateUsername,
	updatePassword,
	updateInvitation
} from './repository.js';

//===============================================================================================//

export async function login({ username, 
							  password }) {
	const user = await findUserByName({ username });
	if (!user)
		throw new AccountError(ACCOUNT_ERROR.INVALID_CREDENTIALS);

	const passwordOK = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordOK )
		throw new AccountError(ACCOUNT_ERROR.INVALID_CREDENTIALS);

	return user;
}
//-----------------------------------------------------------------------------------------------//
export function register({ username, 
						   password,
						   invitationToken }) {
	return knex.transaction(async (trx) => {
		const invitation = await lockInvitation({ 
			invitationToken,
			trx
		});
		if (!invitation || invitation.status !== 'unused')
			throw new AccountError(ACCOUNT_ERROR.INVALID_INVITATION_TOKEN);	
		
		const hashedPassword = await bcrypt.hash(password, 8);
		
		let userId;
		try {
			[userId] = await insertUser({ 
				username, 
				hashedPassword,
				invitationId: invitation.id,
				trx
			});
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY')
				throw new AccountError(ACCOUNT_ERROR.USERNAME_TAKEN);	
			
			throw err;
		}
		
		await insertTurns({
			userId,
			trx
		});
		
		await updateInvitation({
			invitationId: invitation.id,
			status: 'used',
			usedAt: trx.fn.now(),
			trx
		});
		
		const user = await findUserById({ 
			userId,
			trx
		});
		
		return user;
	});
}
//-----------------------------------------------------------------------------------------------//
export function deregister(userId) {
	return knex.transaction(async (trx) => {
		const user = await findUserById({
            userId,
            trx
        });
		
		await deleteUser({
			userId,
			trx
		});
		
		await updateInvitation({
			invitationId: user.invitationId,
            status: 'released',
            releasedAt: trx.fn.now(),
			trx
		});
	});
}
//-----------------------------------------------------------------------------------------------//
export async function changeUsername({ userId,
									   newUsername,
									   password }) {
	const user = await findUserById({ userId });
	
	const passwordOK = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordOK)
		throw new AccountError(ACCOUNT_ERROR.PASSWORD_WRONG);

	try {
		await updateUsername({ 
			userId, 
			newUsername 
		});
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY')
			throw new AccountError(ACCOUNT_ERROR.USERNAME_TAKEN);
		
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function changePassword({ userId, 
									   newPassword,
									   password }) {
	const user = await findUserById({ userId });
	
	const passwordOK = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordOK)
		throw new AccountError(ACCOUNT_ERROR.PASSWORD_WRONG);
	
	const hashedNewPassword = await bcrypt.hash(newPassword, 8);
	await updatePassword({ 
		userId, 
		hashedNewPassword 
	});
}