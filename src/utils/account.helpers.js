//=== Imports ===================================================================================//
import bcrypt from "bcrypt";

import db from "./db.js";

//=== Main ======================================================================================//

//--- Find user by id ---------------------------------------------------------------------------//
export const findUserById = async (id) => {
	const [users] = await db.execute(
		`SELECT * 
		 FROM users 
		 WHERE id = ?`,
		[id]
	);
	return users[0] || null;
};

//--- Find user by name -------------------------------------------------------------------------//
export const findUserByName = async (name) => {
	const [users] = await db.execute(
		`SELECT * 
		 FROM users 
		 WHERE name = ?`,
		[name]
	);
	return users[0] || null;
};

//--- Is username taken? ------------------------------------------------------------------------//
export const isUsernameTaken = async (username) => {
	const [users] = await db.execute(
		`SELECT id 
		 FROM users 
		 WHERE name = ?`,
		[username]
	);
	return users.length > 0;
};

//--- Is password correct? ----------------------------------------------------------------------//
export const isPasswordCorrect = async (user, password) => {
	return await bcrypt.compare(password, user.password);
};

//--- Register user -----------------------------------------------------------------------------//
export const registerUser = async (username, password) => {
	const hashedPassword = await bcrypt.hash(password, 8);
	const [result] = await db.execute(
		`INSERT INTO users
			(name, 
			 password) 
		 VALUES (?, ?)`, 
		[username, 
		 hashedPassword]
	);
	
	const user = await findUserById(result.insertId);
	return user;
};

//--- Update username ---------------------------------------------------------------------------//
export const updateUsername = async (userId, newUsername) => {
	await db.execute(
		`UPDATE users 
		 SET name = ? 
		 WHERE id = ?`,
		[newUsername, 
		 userId]
	);
};

//--- Update password ---------------------------------------------------------------------------//
export const updatePassword = async (userId, newPassword) => {
	const hashedPassword = await bcrypt.hash(newPassword, 8);
	await db.execute(
		`UPDATE users 
		 SET password = ? 
		 WHERE id = ?`,
		[hashedPassword, 
		 userId]
	);
};