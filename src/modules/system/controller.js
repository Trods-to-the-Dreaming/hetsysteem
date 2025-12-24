export async function showHome(req, res, next) {
	try {
		return res.redirect('/about');
	} catch (err) {
		next(err); 
	}
};
//-----------------------------------------------------------------------------------------------//
export async function showAbout(req, res, next) {
	try {
		return res.render('system/about');
	} catch (err) {
		next(err);  
	}
};
//-----------------------------------------------------------------------------------------------//
export async function showGameMechanics(req, res, next) {
	try {
		return res.render('system/game-mechanics');
	} catch (err) {
		next(err); 
	}
};