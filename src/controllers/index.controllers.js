//--- Show index page ---//
export const showIndex = (req, res) => {
	try {
		res.redirect("/about");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Show about page ---//
export const showAbout = (req, res) => {
	try {
		res.render("about");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Show game rules page ---//
export const showRules = (req, res) => {
	try {
		res.render("rules");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};