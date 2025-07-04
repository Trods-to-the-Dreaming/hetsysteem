//=== Main ======================================================================================//

//--- Show index page ---------------------------------------------------------------------------//
export const showIndex = (req, res, next) => {
	try {
		return res.redirect("/about");
	} catch (err) {
		next(err); 
	}
};

//--- Show about page ---------------------------------------------------------------------------//
export const showAbout = (req, res, next) => {
	try {
		return res.render("about");
	} catch (err) {
		next(err);  
	}
};

//--- Show game rules page ----------------------------------------------------------------------//
export const showRules = (req, res, next) => {
	try {
		return res.render("rules");
	} catch (err) {
		next(err); 
	}
};