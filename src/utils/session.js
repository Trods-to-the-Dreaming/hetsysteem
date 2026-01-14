export function regenerateSession(req) {
	return new Promise((resolve, reject) => {
		req.session.regenerate((err) => {
			if (err) reject(err);
			resolve();
		});
	});
}
//-----------------------------------------------------------------------------------------------//
export function saveSession(req) {
	return new Promise((resolve, reject) => {
		req.session.save((err) => {
			if (err) reject(err);
			resolve();
		});
	});
}
//-----------------------------------------------------------------------------------------------//
export function destroySession(req) {
	return new Promise((resolve, reject) => {
		req.session.destroy((err) => {
			if (err) return reject(err);
			resolve();
		});
	});
}