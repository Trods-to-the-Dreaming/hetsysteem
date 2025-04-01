const GameController = {
	//--- Show menu page ---//
	showMenu: (req, res) => {
		res.render("game/menu");
	}
};

module.exports = { GameController };