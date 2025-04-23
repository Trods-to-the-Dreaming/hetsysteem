import GAME from "../constants/game.js";
import db from "../utils/db.js";

/*//--- Show menu page ---//
const showMenu = (req, res) => {
	res.render("game/menu");
};*/

//--- Show menu page ---//
const showMenu = async (req, res) => {
	try {
		const [games] = await db.execute("SELECT id, name FROM games ORDER BY id");

		res.render("game/menu", {
			games // Pass the array to your template
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(GAME.UNEXPECTED_ERROR);
	}
};

//--- Handle enter request ---//
const handleEnter = async (req, res) => {
	try {
		const gameId = req.body.game;
		const [games] = await db.execute("SELECT * FROM games WHERE id = ?", [gameId]);

		if (games.length === 0) {
			return res.render("game/menu", {
				errorGame: GAME.INVALID_GAME
			});
		}

		const selectedGame = games[0];
		
		// Save selected game in session
		req.session.gameId = selectedGame.id;
		req.session.gameName = selectedGame.name;
		
		req.session.save((error) => {
			if (error) {
				console.error(error);
				return res.status(500).send(GAME.UNEXPECTED_ERROR);
			}
			res.redirect("/game/enter");
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send(GAME.UNEXPECTED_ERROR);
	}
};

//--- Show enter page ---//
const showEnter = (req, res) => {
	res.render("game/enter");
};

export default  {
	showMenu,
	handleEnter,
	showEnter
};