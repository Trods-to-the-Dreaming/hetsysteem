import knex from '#utils/db.js';

//===============================================================================================//

export function findUserById(id,
							 trx = knex) {
	return trx('users')
		.where('id', id)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findUserByName(name,
							   trx = knex) {
	return trx('users')
		.where('name', name)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function createUser(name,
						   hashedPassword,
						   trx = knex) {
	return trx('users').insert({
		name,
		password: hashedPassword,
	});
}
//-----------------------------------------------------------------------------------------------//
export async function updateUsername(userId, 
									 name,
									 trx = knex) {
	await trx('users')
		.where('id', userId)
		.update({ name });
}
//-----------------------------------------------------------------------------------------------//
export async function updatePassword(userId, 
									 hashedPassword,
									 trx = knex) {
	await trx('users')
		.where('id', userId)
		.update({ password: hashedPassword });
}
/*export async function isUsernameTaken(username) {
	const user = await knex('users')
		.select('id')
		.where('name', username)
		.first();
	return Boolean(user);
}*/
//-----------------------------------------------------------------------------------------------//
/*export async function createUser(name,
								 hashedPassword) {
	const [id] = await knex('users').insert({
		name,
		password: hashedPassword,
	});
	return findUserById(id);
}*/
