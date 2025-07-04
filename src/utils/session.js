//=== Main ======================================================================================//
const saveSession = (req) => {
	return new Promise((resolve, reject) => {
		req.session.save((err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

//=== Export ====================================================================================//
export default saveSession;