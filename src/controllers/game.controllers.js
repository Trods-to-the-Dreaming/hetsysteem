import GAME from "../constants/game.js";
import db from "../utils/db.js";

//--- Show menu page ---//
const showMenu = async (req, res) => {
	try {
		const [games] = await db.execute(
			"SELECT id, name FROM games ORDER BY id"
		);
		res.render("game/menu", {
			games
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(GAME.UNEXPECTED_ERROR);
	}
};

//--- Handle enter request ---//
const handleEnter = async (req, res) => {
	try {
		const gameId = req.body.gameId;
		const userId = req.session.userId;

		// Fetch game
		const [games] = await db.execute(
			"SELECT * FROM games WHERE id = ?", 
			[gameId]
		);
		if (games.length === 0) {
			return res.render("game/menu", {
				errorGame: GAME.INVALID_GAME
			});
		}
		const game = games[0];
		
		// Fetch character
		const [characters] = await db.execute(
			"SELECT * FROM characters WHERE user_id = ? AND game_id = ?",
			[userId, gameId]
		);

		// Update session
		req.session.gameId = game.id;
		req.session.gameName = game.name;
		req.session.save((error) => {
			if (error) {
				console.error(error);
				return res.status(500).send(GAME.UNEXPECTED_ERROR);
			}

			if (characters.length > 0) {
				res.redirect("/game/dashboard");
			} else {
				res.redirect("/game/create-character");
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send(GAME.UNEXPECTED_ERROR);
	}
};

//--- Show create character page ---//
const showCreateCharacter = async (req, res) => {
	try {
		const [jobs] = await db.execute(
			"SELECT id, name FROM jobs ORDER BY id"
		);
		const [luxuries] = await db.execute(
			"SELECT id, name FROM luxury_preferences ORDER BY id"
		);
		res.render("game/create-character", {
			jobs,
			luxuries
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(GAME.UNEXPECTED_ERROR);
	}
};

//--- Handle create character request ---//
const handleCreateCharacter = async (req, res) => {
	try {
		const { firstName, 
				lastName, 
				jobPreference1, 
				jobPreference2, 
				jobPreference3, 
				luxuryPreference } = req.body;
		const userId = req.session.userId;
		const gameId = req.session.gameId;

		// Validation
		if (
			jobPreference1 === jobPreference2 ||
			jobPreference1 === jobPreference3 ||
			jobPreference2 === jobPreference3
		) {
			return res.render("game/create-character", {
				errorJobPreference: "Kies drie verschillende jobs.",
				firstName,
				lastName
			});
		}

		// Voeg nieuw personage toe
		await db.execute(`
			INSERT INTO characters (
				first_name, last_name, game_id, user_id,
				balance, age, hours_available,
				health, cumulative_health_loss, happiness,
				education_level, 
				job_preference_1_id, job_preference_2_id, job_preference_3_id,
				luxury_preference_id
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, [
			firstName, lastName, gameId, userId,
			1000, // start balance
			18,   // age
			40,   // hours_available per week
			100,  // health
			0,    // cumulative_health_loss
			50,   // happiness
			0,    // education_level
			jobPreference1,
			jobPreference2,
			jobPreference3,
			luxuryPreference
		]);

		res.redirect("/game/dashboard");

	} catch (error) {
		console.error(error);

		// Error bij dubbele naam?
		if (error.code === "ER_DUP_ENTRY") {
			return res.render("game/create-character", {
				firstName,
				lastName,
				errorJobPreference: "Er bestaat al een personage met die voor- en achternaam in deze wereld."
			});
		}

		res.status(500).send("Onverwachte fout bij het aanmaken van het personage.");
	}
};




const handleCreateCharacter = async (req, res) => {
	try {
		const gameId = req.body.gameId;
		
		const gameId = req.session.gameId;
		const userId = req.session.userId;

		// Fetch game
		const [games] = await db.execute(
			"SELECT * FROM games WHERE id = ?", 
			[gameId]
		);
		if (games.length === 0) {
			return res.render("game/menu", {
				errorGame: GAME.INVALID_GAME
			});
		}
		const game = games[0];
		
		// Fetch character
		const [characters] = await db.execute(
			"SELECT * FROM characters WHERE user_id = ? AND game_id = ?",
			[userId, gameId]
		);

		// Update session
		req.session.gameId = game.id;
		req.session.gameName = game.name;
		req.session.save((error) => {
			if (error) {
				console.error(error);
				return res.status(500).send(GAME.UNEXPECTED_ERROR);
			}

			if (characters.length > 0) {
				res.redirect("/game/dashboard");
			} else {
				res.redirect("/game/create-character");
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send(GAME.UNEXPECTED_ERROR);
	}
};				

/*const handleEnter = async (req, res) => {
	try {
		const gameId = req.body.game;
		const [games] = await db.execute("SELECT * FROM games WHERE id = ?", [gameId]);

		if (games.length === 0) {
			return res.render("game/menu", {
				errorGame: GAME.INVALID_GAME
			});
		}

		const selectedGame = games[0];
		
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
};*/

//--- Show enter page ---//
const showEnter = (req, res) => {
	res.render("game/enter");
};

export default  {
	showMenu,
	handleEnter,
	showCreateCharacter,
	showEnter
};