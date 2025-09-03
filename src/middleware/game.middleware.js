//=== Main ======================================================================================//
export const requireWorldSession = (req, res, next) => {
	if (req.session.worldId && 
		req.session.worldType &&
		req.session.characterId) {
		res.locals.worldType = req.session.worldType;
		switch (req.session.worldType) {
			case 'Zo zuiver als goud':
				res.locals.worldClass = 'gold-world';
				break;
			case 'Belofte maakt schuld':
				res.locals.worldClass = 'debt-world';
				break;
			case 'De tijd brengt raad':
				res.locals.worldClass = 'time-world';
				break;
		}
		next();
	} else {
		res.redirect('/game/choose-world');
	}
};

/*export const requireCharacterSelected = (req, res, next) => {
	if (req.session.characterId) {
		next();
	} else {
		res.redirect('/game/setup/choose-world');
	}
};

export const requireCharacterCustomized = (req, res, next) => {
	if (req.session.characterFirstName && 
		req.session.characterLastName) {
		res.locals.characterFirstName = req.session.characterFirstName;
		res.locals.characterLastName = req.session.characterLastName;
		next();
	} else {
		res.redirect('/game/setup/customize-character');
	}
};*/