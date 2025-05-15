export const requireWorldSelected = (req, res, next) => {
	if (req.session.worldId && 
		req.session.worldName) {
		res.locals.world_name = req.session.worldName;
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
		res.locals.character_first_name = req.session.characterFirstName;
		res.locals.character_last_name = req.session.characterLastName;
		next();
	} else {
		res.redirect("/game/customize-character");
	}
};