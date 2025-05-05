export const requireWorldSelected = (req, res, next) => {
	if (req.session.worldId && 
		req.session.worldName) {
		res.locals.worldName = req.session.worldName;
		next();
	} else {
		res.redirect("/game/choose-world");
	}
};

export const requireCharacterSelected = (req, res, next) => {
	if (req.session.characterId) {
		next();
	} else {
		res.redirect("/game/choose-world");
	}
};

export const requireCharacterCustomized = (req, res, next) => {
	if (req.session.characterFirstName && 
		req.session.characterLastName) {
		res.locals.characterFirstName = req.session.characterFirstName;
		res.locals.characterLastName = req.session.characterLastName;
		next();
	} else {
		res.redirect("/game/customize-character");
	}
};