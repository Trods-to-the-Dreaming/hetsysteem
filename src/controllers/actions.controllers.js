import GAME from "../constants/game.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";

//--- Show spend time page ---//
export const showSpendTime = async (req, res) => {
	try {
		const { characterId } = req.session;
		
		const [contracts] = await db.execute(
			`SELECT ec.id, ec.hours, ec.hourly_wage, 
			emp.first_name AS employer_first_name, 
			emp.last_name AS employer_last_name, 
			j.name AS job_name
			FROM employment_contracts ec
			JOIN characters emp ON ec.employer_id = emp.id
			JOIN jobs j ON ec.job_id = j.id
			WHERE ec.employee_id = ?`,
			[characterId]
		);
		
		const [[character]] = await db.execute(
			`SELECT hours_available FROM characters WHERE id = ?`,
			[characterId]
		);
		const hours_available = character.hours_available;

		res.render("game/actions/spend-time", {
			contracts,
			hours_available
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show trade page ---//
export const showTrade = async (req, res) => {
	try {
		/*const { characterId } = req.session;

		const [itemRows] = await db.execute(
			`SELECT i.name, ci.quantity
			 FROM character_items ci
			 JOIN items i ON ci.item_id = i.id
			 WHERE ci.character_id = ? AND ci.quantity > 0
			 ORDER BY i.id`,
			[characterId]
		);
		
		const [buildingRows] = await db.execute(
			`SELECT i.name, ci.quantity
			 FROM character_buildings ci
			 JOIN buildings i ON ci.building_id = i.id
			 WHERE ci.character_id = ? AND ci.quantity > 0
			 ORDER BY i.id`,
			[characterId]
		);*/

		res.render("game/actions/trade"/*, {
			items: itemRows,
			buildings: buildingRows
		}*/);
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show apply page ---//
export const showApply = async (req, res) => {
	try {
		res.render("game/actions/apply");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show resign page ---//
export const showResign = async (req, res) => {
	try {
		res.render("game/actions/resign");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show recruit page ---//
export const showRecruit = async (req, res) => {
	try {
		res.render("game/actions/recruit");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show fire page ---//
export const showFire = async (req, res) => {
	try {
		res.render("game/actions/fire");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

/*
//--- Show inventory page ---//
export const showInventory = async (req, res) => {
	try {
		const { characterId } = req.session;

		const [itemRows] = await db.execute(
			`SELECT i.name, ci.quantity
			 FROM character_items ci
			 JOIN items i ON ci.item_id = i.id
			 WHERE ci.character_id = ? AND ci.quantity > 0
			 ORDER BY i.id`,
			[characterId]
		);
		
		const [buildingRows] = await db.execute(
			`SELECT i.name, ci.quantity
			 FROM character_buildings ci
			 JOIN buildings i ON ci.building_id = i.id
			 WHERE ci.character_id = ? AND ci.quantity > 0
			 ORDER BY i.id`,
			[characterId]
		);

		res.render("game/world/inventory", {
			items: itemRows,
			buildings: buildingRows
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};
*/