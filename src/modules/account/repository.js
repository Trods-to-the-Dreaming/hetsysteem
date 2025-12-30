import knex from '#utils/db.js';

//===============================================================================================//

export function findUserById(userId,
							 trx = knex) {
	return trx('users')
		.where('id', userId)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findUserByName(username,
							   trx = knex) {
	return trx('users')
		.where('name', username)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function insertUser(username,
						   hashedPassword,
						   trx = knex) {
	return trx('users').insert({
		name: username,
		password: hashedPassword,
	});
}
//-----------------------------------------------------------------------------------------------//
export async function updateUsername(userId, 
									 newUsername,
									 trx = knex) {
	await trx('users')
		.where('id', userId)
		.update({ name: newUsername });
}
//-----------------------------------------------------------------------------------------------//
export async function updatePassword(userId, 
									 hashedNewPassword,
									 trx = knex) {
	await trx('users')
		.where('id', userId)
		.update({ password: hashedNewPassword });
}