//=== Imports ===================================================================================//

import bcrypt from 'bcrypt';

import knex from '#utils/db.js';

//=== Main ======================================================================================//

export const findUserById = async (id) => {
	return await knex('users')
		.where('id', id)
		.first();
};
//-----------------------------------------------------------------------------------------------//
export const findUserByName = async (name) => {
	return await knex('users')
		.where('name', name)
		.first();
};
//-----------------------------------------------------------------------------------------------//
export const isUsernameTaken = async (username) => {
	const user = await knex('users')
		.select('id')
		.where('name', username)
		.first();
	return !!user;
};
//-----------------------------------------------------------------------------------------------//
export const isPasswordCorrect = async (user, 
										password) => {
	return await bcrypt.compare(password, user.password);
};
//-----------------------------------------------------------------------------------------------//
export const registerUser = async (username, 
								   password) => {
	const hashedPassword = await bcrypt.hash(password, 8);
	const [id] = await knex('users')
		.insert({
			name: username,
			password: hashedPassword,
		});
	return await findUserById(id);
};
//-----------------------------------------------------------------------------------------------//
export const updateUsername = async (userId, newUsername) => {
	await knex('users')
		.where('id', userId)
		.update({ name: newUsername });
};
//-----------------------------------------------------------------------------------------------//
export const updatePassword = async (userId, newPassword) => {
	const hashedPassword = await bcrypt.hash(newPassword, 8);
	await knex('users')
		.where('id', userId)
		.update({ password: hashedPassword });
};