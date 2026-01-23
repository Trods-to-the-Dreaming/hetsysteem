import bcrypt from 'bcrypt';
//-----------------------------------------------------------------------------------------------//
import knex from '#utils/db.js';
import { 
	ok, 
	fail 
} from '#utils/result.js';
//-----------------------------------------------------------------------------------------------//
import { 
	AccountError 
} from './errors.js';
import { 
	ACCOUNT 
} from './reasons.js';
import {
	findUserById,
	findUserByName,
	lockInvitation,
	insertUser,
	deleteUser,
	updateUsername,
	updatePassword,
	updateInvitation
} from './repository.js';

//===============================================================================================//

export async function login({ username, 
							  password }) {
	const user = await findUserByName({ username });
	if (!user) { 
		return fail({ 
			status: 401,
			reason: ACCOUNT.REASON.INVALID_CREDENTIALS 
		});
	}

	const passwordOK = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordOK ) {
		return fail({ 
			status: 401,
			reason: ACCOUNT.REASON.INVALID_CREDENTIALS 
		});
	}

	return ok(user);
}
//-----------------------------------------------------------------------------------------------//
export async function register({ username, 
							     password,
								 invitationToken }) {
	try {
		return await knex.transaction(async (trx) => {
			const invitation = await lockInvitation({ 
				invitationToken,
				trx
			});
			if (!invitation || invitation.status !== 'unused') {
				throw new AccountError({ 
					status: 401,
					code: ACCOUNT.REASON.INVALID_INVITATION_TOKEN 
				});
			}			
			
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
				if (err.code === 'ER_DUP_ENTRY') {
					throw new AccountError({ 
						status: 409,
						code: ACCOUNT.REASON.USERNAME_TAKEN 
					});
				}
				
				throw err;
			}
			
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
			
			return ok(user);
		});
	} catch (err) {
		if (err instanceof AccountError) {
            return fail({ 
				status: err.status,
				reason: err.code 
			});
		}
        
        throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function deregister(userId) {
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
		
		return ok();
	});
}
//-----------------------------------------------------------------------------------------------//
export async function changeUsername({ userId,
									   newUsername,
									   password }) {
	const user = await findUserById({ userId });
	
	const passwordOK = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordOK) {
		return fail({ 
			status: 401,
			reason: ACCOUNT.REASON.PASSWORD_WRONG 
		});
	}

	try {
		await updateUsername({ 
			userId, 
			newUsername 
		});
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			return fail({ 
				status: 409,
				reason: ACCOUNT.REASON.USERNAME_TAKEN 
			});
		}
		
		throw err;
	}

	return ok();
}
//-----------------------------------------------------------------------------------------------//
export async function changePassword({ userId, 
									   newPassword,
									   password }) {
	const user = await findUserById({ userId });
	
	const passwordOK = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordOK) {
		return fail({ 
			status: 401,
			reason: ACCOUNT.REASON.PASSWORD_WRONG 
		});
	}
	
	const hashedNewPassword = await bcrypt.hash(newPassword, 8);
	await updatePassword({ 
		userId, 
		hashedNewPassword 
	});

	return ok();
}