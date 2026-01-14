export function showHome(req, res) {
	return res.redirect('/about');
};
//-----------------------------------------------------------------------------------------------//
export function showAbout(req, res) {
	return res.render('system/about');
};
//-----------------------------------------------------------------------------------------------//
export function showGameMechanics(req, res) {
	return res.render('system/game-mechanics');
};