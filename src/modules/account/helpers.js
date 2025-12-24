import bcrypt from 'bcrypt';

import knex from '#utils/db.js';

//===============================================================================================//

export async function findUserById(id) {
	return await knex('users')
		.where('id', id)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export async function findUserByName(name) {
	return await knex('users')
		.where('name', name)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export async function isUsernameTaken(username) {
	const user = await knex('users')
		.select('id')
		.where('name', username)
		.first();
	return !!user;
}
//-----------------------------------------------------------------------------------------------//
export async function isPasswordCorrect(user, 
										password) {
	return await bcrypt.compare(password, user.password);
}
//-----------------------------------------------------------------------------------------------//
export async function registerUser(username, 
								   password) {
	const hashedPassword = await bcrypt.hash(password, 8);
	const [id] = await knex('users')
		.insert({
			name: username,
			password: hashedPassword,
		});
	return await findUserById(id);
}
//-----------------------------------------------------------------------------------------------//
export async function updateUsername(userId, 
									 newUsername) {
	await knex('users')
		.where('id', userId)
		.update({ name: newUsername });
}
//-----------------------------------------------------------------------------------------------//
export async function updatePassword(userId, 
									 newPassword) {
	const hashedPassword = await bcrypt.hash(newPassword, 8);
	await knex('users')
		.where('id', userId)
		.update({ password: hashedPassword });
}