import knex from '#utils/db.js';

//===============================================================================================//

export function findUserById({ userId,
							   trx = knex }) {
	return trx('users')
		.select({
			id: 'id',
			name: 'name',
			hashedPassword: 'hashed_password',
			invitationId: 'invitation_id'
		})
		.where({ id: userId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findUserByName({ username,
							     trx = knex }) {
	return trx('users')
		.select({
			id: 'id',
			name: 'name',
			hashedPassword: 'hashed_password',
			invitationId: 'invitation_id'
		})
		.where({ name: username })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function lockInvitation({ invitationToken,
								 trx }) {
	return trx('invitations')
        .select({
			id: 'id',
			status: 'status'
		})
		.where({ token: invitationToken })
        .forUpdate()
        .first();
}
//-----------------------------------------------------------------------------------------------//
export function insertUser({ username,
							 hashedPassword,
							 invitationId,
							 trx = knex }) {
	return trx('users')
		.insert({
			name: username,
			hashed_password: hashedPassword,
			invitation_id: invitationId
		});
}
//-----------------------------------------------------------------------------------------------//
export function deleteUser({ userId,
							 trx = knex }) {
	return trx('users')
		.where({ id: userId })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function updateUsername({ userId, 
								 newUsername,
								 trx = knex }) {
	return trx('users')
		.where({ id: userId })
		.update({ name: newUsername });
}
//-----------------------------------------------------------------------------------------------//
export function updatePassword({ userId, 
								 hashedNewPassword,
								 trx = knex }) {
	return trx('users')
		.where({ id: userId })
		.update({ hashed_password: hashedNewPassword });
}
//-----------------------------------------------------------------------------------------------//
export function updateInvitation({ invitationId,
								   status,
								   usedAt,
								   releasedAt,
								   trx = knex }) {
	const update = { status };
	
	if (usedAt !== undefined)
		update.used_at = usedAt;

	if (releasedAt !== undefined)
		update.released_at = releasedAt;

	return trx('invitations')
		.where({ id: invitationId })
		.update(update);
}