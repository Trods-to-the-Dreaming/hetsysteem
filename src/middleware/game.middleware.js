const setGameLocals = (req, res, next) => {
	if (req.session && req.session.gameId && req.session.gameName) {
		res.locals.gameId = req.session.gameId;
		res.locals.gameName = req.session.gameName;
	}
	next();
};



export default setGameLocals;