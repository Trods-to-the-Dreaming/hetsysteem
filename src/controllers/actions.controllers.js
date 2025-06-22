import GAME_MSG from "../constants/game.messages.js";
import GAME_RULES from "../constants/game.rules.js";
import { 
	replaceOrders,
	addFrontendIds	
} from "../utils/game.helpers.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";

//--- Show actions page ---//
export const showActions = async (req, res, next) => {
	try {
		return res.render("game/actions/actions");
	} catch (err) {
		next(err);
	}
};

//--- Show survive page ---//
export const showSurvive = async (req, res, next) => {
	try {
		const { characterId } = req.session;

		const [food] = await db.execute(
			`SELECT COALESCE(
				(SELECT quantity 
				FROM character_products 
				WHERE character_id = ? AND product_id = 1),
				0
			) AS quantity;`,
			[characterId]
		);
		const foodAvailable = food[0].quantity;
		const foodDefault = Math.min(foodAvailable, GAME_RULES.FOOD.NEEDED);
		const foodSelectable = Math.min(foodAvailable, GAME_RULES.FOOD.MAX);

		const [medicalCare] = await db.execute(
			`SELECT COALESCE(
				(SELECT quantity 
				FROM character_products 
				WHERE character_id = ? AND product_id = 2),
				0
			) AS quantity;`,
			[characterId]
		);
		const medicalCareAvailable = medicalCare[0].quantity;
		const medicalCareDefault = Math.min(medicalCareAvailable, GAME_RULES.MEDICAL_CARE.NEEDED);
		const medicalCareSelectable = Math.min(medicalCareAvailable, GAME_RULES.MEDICAL_CARE.MAX);

		return res.render("game/actions/survive", {
			food_available: foodAvailable,
			food_default: foodDefault,
			food_selectable: foodSelectable,
			food_needed: GAME_RULES.FOOD.NEEDED,
			medical_care_available: medicalCareAvailable,
			medical_care_default: medicalCareDefault,
			medical_care_selectable: medicalCareSelectable,
			medical_care_needed: GAME_RULES.MEDICAL_CARE.NEEDED
		});
	} catch (err) {
		next(err);
	}
};

//--- Show trade page ---//
export const showTrade = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		// Get existing orders
		const [productBuyOrders] = await db.execute(
			`SELECT pbo.product_id AS itemId,
					p.name AS name,
					pbo.quantity AS quantity,
					pbo.max_unit_price AS unitPrice
			 FROM product_buy_orders pbo
			 JOIN products p ON pbo.product_id = p.id
			 WHERE pbo.character_id = ?`,
			[characterId]
		);
		const [productSellOrders] = await db.execute(
			`SELECT pso.product_id AS itemId,
					p.name AS name,
					pso.quantity AS quantity,
					pso.min_unit_price AS unitPrice
			 FROM product_sell_orders pso
			 JOIN products p ON pso.product_id = p.id
			 WHERE pso.character_id = ?`,
			[characterId]
		);
		const [buildingBuyOrders] = await db.execute(
			`SELECT bbo.building_id AS itemId,
					b.name AS name,
					bbo.quantity AS quantity,
					bbo.max_unit_price AS unitPrice
			 FROM building_buy_orders bbo
			 JOIN buildings b ON bbo.building_id = b.id
			 WHERE bbo.character_id = ?`,
			[characterId]
		);
		const [buildingSellOrders] = await db.execute(
			`SELECT bso.building_id AS itemId,
					b.name AS name,
					bso.quantity AS quantity,
					bso.min_unit_price AS unitPrice
			 FROM building_sell_orders bso
			 JOIN buildings b ON bso.building_id = b.id
			 WHERE bso.character_id = ?`,
			[characterId]
		);
		
		// Add frontend id's
		/*const productBuyOrders = addFrontendIds(productBuyOrdersRaw);
		const productSellOrders = addFrontendIds(productSellOrdersRaw);
		const buildingBuyOrders = addFrontendIds(buildingBuyOrdersRaw);
		const buildingSellOrders = addFrontendIds(buildingSellOrdersRaw);*/
		
		// Get possible products and buildings
		const [buyableProducts] = await db.execute(
			`SELECT id,
					name
			 FROM products
			 ORDER BY id`
		);
		const [buyableBuildings] = await db.execute(
			`SELECT id,
					name
			 FROM buildings
			 ORDER BY id`
		);
		
		const [sellableProducts] = await db.execute(
			`SELECT p.id,
					p.name, 
					cp.quantity
			 FROM character_products cp
			 JOIN products p ON cp.product_id = p.id
			 WHERE cp.character_id = ? AND 
				   cp.quantity > 0
			 ORDER BY p.id`,
			[characterId]
		);
		const [sellableBuildings] = await db.execute(
			`SELECT b.id,
					b.name,
					cb.quantity
			 FROM character_buildings cb
			 JOIN buildings b ON cb.building_id = b.id
			 WHERE cb.character_id = ? AND
				   cb.quantity > 0
			 ORDER BY b.id`,
			[characterId]
		);

		// Check if the character has confirmed trade
		const [confirmation] = await db.execute(
			`SELECT has_confirmed_trade
			 FROM characters
			 WHERE id = ?`,
			[characterId]
		);
		const hasConfirmed = confirmation[0].has_confirmed_trade;

		return res.render("game/actions/trade", {
			has_confirmed: hasConfirmed,
			product_buy_orders: productBuyOrders,
			product_sell_orders: productSellOrders,
			building_buy_orders: buildingBuyOrders,
			building_sell_orders: buildingSellOrders,
			buyable_products: buyableProducts,
			sellable_products: sellableProducts,
			buyable_buildings: buyableBuildings,
			sellable_buildings: sellableBuildings
		});
	} catch (err) {
		next(err);
	}
};

//--- Handle trade request ---//
export const handleTrade = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const productBuyOrders = JSON.parse(req.body.productBuyOrders || "[]");
		const productSellOrders = JSON.parse(req.body.productSellOrders || "[]");
		const buildingBuyOrders = JSON.parse(req.body.buildingBuyOrders || "[]");
		const buildingSellOrders = JSON.parse(req.body.buildingSellOrders || "[]");
		
		// Remove existing orders and add new orders for this character
		await replaceOrders(db, characterId, "buy", "product", productBuyOrders);
		await replaceOrders(db, characterId, "sell", "product", productSellOrders);
		await replaceOrders(db, characterId, "buy", "building", buildingBuyOrders);
		await replaceOrders(db, characterId, "sell", "building", buildingSellOrders);
		
		// Orders controleren
		// indien OK --> characters.has_confirmed_trade op TRUE zetten
		await db.execute(
			`UPDATE characters
			 SET has_confirmed_trade = TRUE
			 WHERE id = ?`,
			[characterId]
		);
		// indien niet OK --> characters.has_confirmed_trade op FALSE zetten

		return res.redirect("/game/actions/trade");
	} catch (err) {
		next(err);
	}
};

//--- Show spend time page ---//
export const showSpendTime = async (req, res, next) => {
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
			WHERE ec.employee_id = ?
			ORDER BY ec.hourly_wage DESC`,
			[characterId]
		);
		
		const [[character]] = await db.execute(
			`SELECT hours_available FROM characters WHERE id = ?`,
			[characterId]
		);
		const hours_available = character.hours_available;

		return res.render("game/actions/spend-time", {
			contracts,
			hours_available
		});
	} catch (err) {
		next(err);
	}
};

//--- Show apply page ---//
export const showApply = async (req, res, next) => {
	try {
		return res.render("game/actions/apply");
	} catch (err) {
		next(err);
	}
};

//--- Show resign page ---//
export const showResign = async (req, res, next) => {
	try {
		return res.render("game/actions/resign");
	} catch (err) {
		next(err);
	}
};

//--- Show recruit page ---//
export const showRecruit = async (req, res, next) => {
	try {
		return res.render("game/actions/recruit");
	} catch (err) {
		next(err);
	}
};

//--- Show fire page ---//
export const showFire = async (req, res, next) => {
	try {
		return res.render("game/actions/fire");
	} catch (err) {
		next(err);
	}
};