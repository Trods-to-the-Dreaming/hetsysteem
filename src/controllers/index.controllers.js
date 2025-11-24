//=== Main ======================================================================================//

export const showIndex = (req, res, next) => {
	try {
		return res.redirect('/about');
	} catch (err) {
		next(err); 
	}
};
//-----------------------------------------------------------------------------------------------//
export const showAbout = (req, res, next) => {
	try {
		return res.render('about');
	} catch (err) {
		next(err);  
	}
};
//-----------------------------------------------------------------------------------------------//
export const showGameMechanics = (req, res, next) => {
	try {
		return res.render('game-mechanics');
	} catch (err) {
		next(err); 
	}
};