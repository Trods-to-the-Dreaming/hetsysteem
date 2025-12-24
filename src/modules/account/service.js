import bcrypt from 'bcrypt';

import {
	findUserById,
	findUserByName,
	createUser
} from './repository.js';

//===============================================================================================//

export async function authenticate(username, password) {
	const user = await findUserByName(username);
	if (!user) return null;

	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK ) return null;

	return user;
}
//-----------------------------------------------------------------------------------------------//
export async function register(username, 
							   password) {
	const hashedPassword = await bcrypt.hash(password, 8);
	
	let id;
	try {
		[id] = await createUser(username, hashedPassword);
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			return null;
		}
		throw err;
	}

	return findUserById(id);
}
//-----------------------------------------------------------------------------------------------//
export async function changeUsername(userId, 
									 newUsername, 
									 password) {
	const user = await findUserById(userId);

	const passwordOK = await bcrypt.compare(password, user.password);
	if (!passwordOK) return { isPasswordWrong: true };

	try {
		await updateUsername(userId, newUsername);
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			return { isUsernameTaken: true };
		}
		throw err;
	}

	return {};
}






try {
	const { userId,
			username } = req.session;
	const { newUsername, 
			password } = req.validatedData;
	
	// Check if new username is taken
	if (await isUsernameTaken(newUsername)) {
		return res.render('account/change-username', {
			username,
			newUsername:   newUsername,
			usernameError: MSG_USERNAME_TAKEN
		});
	}

	// Find user
	const user = await findUserById(userId);

	// Verify password
	if (!(await isPasswordCorrect(user, password))) {
		return res.render('account/change-username', {
			username,
			newUsername:   newUsername,
			passwordError: MSG_PASSWORD_WRONG
		});
	}

	// Update username
	await updateUsername(userId, newUsername);

	// Save session
	req.session.username = newUsername;
	req.session.changeSaved = true;
	req.session.changeMessage = MSG_USERNAME_CHANGED;
	await saveSession(req);
	
	return res.redirect('/account/change-username');
} catch (err) {
	next(err); 
}





export async function changePassword(userId, 
									 newPassword) {
	const passwordHash = await bcrypt.hash(newPassword, 8);
	await updatePassword(userId, hash);
}



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
export function isPasswordCorrect(user, 
								  password) {
	return bcrypt.compare(password, user.password);
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