//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	BadRequestError,
	NotFoundError 
} from "../utils/errors.js";

import { getProductIds } from "./game-products.helpers.js";

import GAME_RULES from "../constants/game.rules.js";

//=== Constants =================================================================================//
const MSG_INVALID_TYPE		 = "Het gevraagde ordertype bestaat niet.";
const MSG_INVALID_CATEGORY   = "De gevraagde ordercategorie bestaat niet.";
const MSG_INVALID_CHARACTER	 = "Het gevraagde personage bestaat niet.";
const MSG_MULTIPLE_ORDERS	 = "Voor ieder product of gebouw is slechts één order toegestaan.";
const MSG_INVALID_QUANTITY	 = "De hoeveelheid moet een positief getal zijn.";
const MSG_INVALID_UNIT_PRICE = "De eenheidsprijs moet een positief getal zijn.";

//=== Main ======================================================================================//

//--- Get food information ----------------------------------------------------------------------//
export const getFoodInfo = async (characterId, 
								  connection = db) => {
	const productIds = await getProductIds(connection);
	const foodId = productIds["food"];
	
	const [result] = await connection.execute(
		`SELECT COALESCE(
			(SELECT quantity 
			 FROM character_products 
			 WHERE character_id = ? AND 
				   product_id = ?),
			0
		) AS quantity`,
		[characterId,
		 foodId]
	);
	const available = result[0].quantity;
	
	return {
		available,
		default: Math.min(available, GAME_RULES.FOOD.NEEDED),
		selectable: Math.min(available, GAME_RULES.FOOD.MAX),
		needed: GAME_RULES.FOOD.NEEDED
	};
};

//--- Get medical care information --------------------------------------------------------------//
export const getMedicalCareInfo = async (characterId, 
										 connection = db) => {
	const productIds = await getProductIds(connection);
	const medicalCareId = productIds["medical-care"];
	
	const [result] = await connection.execute(
		`SELECT COALESCE(
			(SELECT quantity 
			 FROM character_products 
			 WHERE character_id = ? AND 
				   product_id = ?),
			0
		) AS quantity`,
		[characterId,
		 medicalCareId]
	);
	const available = result[0].quantity;
	
	return {
		available,
		default: Math.min(available, GAME_RULES.MEDICAL_CARE.NEEDED),
		selectable: Math.min(available, GAME_RULES.MEDICAL_CARE.MAX),
		needed: GAME_RULES.MEDICAL_CARE.NEEDED
	};
};

//--- Get product buy orders --------------------------------------------------------------------//
export const getProductBuyOrders = async (characterId, 
										  connection = db) => {
	const [productBuyOrders] = await connection.execute(
		`SELECT pbo.product_id AS itemId,
				p.name AS itemName,
				pbo.demand AS quantity,
				pbo.max_unit_price AS unitPrice
		 FROM product_buy_orders pbo
		 INNER JOIN products p ON pbo.product_id = p.id
		 WHERE pbo.character_id = ?`,
		[characterId]
	);
	return productBuyOrders;
};

//--- Get product sell orders -------------------------------------------------------------------//
export const getProductSellOrders = async (characterId, 
										   connection = db) => {
	const [productSellOrders] = await connection.execute(
		`SELECT pso.product_id AS itemId,
				p.name AS itemName,
				pso.supply AS quantity,
				pso.min_unit_price AS unitPrice
		 FROM product_sell_orders pso
		 INNER JOIN products p ON pso.product_id = p.id
		 WHERE pso.character_id = ?`,
		[characterId]
	);
	return productSellOrders;
};

//--- Get building buy orders -------------------------------------------------------------------//
export const getBuildingBuyOrders = async (characterId, 
										   connection = db) => {
	const [buildingBuyOrders] = await connection.execute(
		`SELECT bbo.building_id AS itemId,
				b.name AS itemName,
				bbo.demand AS quantity,
				bbo.max_unit_price AS unitPrice
		 FROM building_buy_orders bbo
		 INNER JOIN buildings b ON bbo.building_id = b.id
		 WHERE bbo.character_id = ?`,
		[characterId]
	);
	return buildingBuyOrders;
};

//--- Get building sell orders ------------------------------------------------------------------//
export const getBuildingSellOrders = async (characterId, 
											connection = db) => {
	const [buildingSellOrders] = await connection.execute(
		`SELECT bso.building_id AS itemId,
				b.name AS itemName,
				bso.supply AS quantity,
				bso.min_unit_price AS unitPrice
		 FROM building_sell_orders bso
		 INNER JOIN buildings b ON bso.building_id = b.id
		 WHERE bso.character_id = ?`,
		[characterId]
	);
	return buildingSellOrders;
};

//--- Get buyable products ----------------------------------------------------------------------//
export const getBuyableProducts = async (connection = db) => {
	const [buyableProducts] = await connection.execute(
		`SELECT id AS itemId,
				name AS itemName
		 FROM products
		 ORDER BY id`
	);
	return buyableProducts;
};

//--- Get sellable products ---------------------------------------------------------------------//
export const getSellableProducts = async (characterId, 
										  connection = db) => {
	const [sellableProducts] = await connection.execute(
		`SELECT p.id AS itemId,
				p.name AS itemName, 
				cp.quantity
		 FROM character_products cp
		 INNER JOIN products p ON cp.product_id = p.id
		 WHERE cp.character_id = ? AND 
			   cp.quantity > 0
		 ORDER BY p.id`,
		[characterId]
	);
	return sellableProducts;
};

//--- Get buyable buildings ---------------------------------------------------------------------//
export const getBuyableBuildings = async (connection = db) => {
	const [buyableBuildings] = await connection.execute(
		`SELECT id AS itemId,
				name AS itemName
		 FROM buildings
		 ORDER BY id`
	);
	return buyableBuildings;
};

//--- Get sellable buildings --------------------------------------------------------------------//
export const getSellableBuildings = async (characterId, 
										   connection = db) => {
	const [sellableBuildings] = await connection.execute(
		`SELECT b.id AS itemId,
				b.name AS itemName,
				cb.quantity
		 FROM character_buildings cb
		 INNER JOIN buildings b ON cb.building_id = b.id
		 WHERE cb.character_id = ? AND
			   cb.quantity > 0
		 ORDER BY b.id`,
		[characterId]
	);
	return sellableBuildings;
};

//--- Get order confirmation --------------------------------------------------------------------//
export const getOrderConfirmation = async (characterId, 
										   connection = db) => {
	const [character] = await connection.execute(
		`SELECT has_confirmed_orders
		 FROM characters
		 WHERE id = ?`,
		[characterId]
	);
	if (character.length === 0) {
		throw new NotFoundError("Personage niet gevonden.");
	}
	return character[0].has_confirmed_orders;
};

//--- Validate orders ---------------------------------------------------------------------------//
export const validateOrders = async (buyOrders,
									 sellOrders) => {
	const seenIds = new Set();

	for (const order of [...buyOrders, ...sellOrders]) {
		const { itemId,
				quantity,
				unitPrice } = order;

		if (seenIds.has(itemId)) {
			throw new BadRequestError(MSG_MULTIPLE_ORDERS);
		}
		seenIds.add(itemId);
		
		if (typeof quantity !== "number" || quantity <= 0) {
			throw new BadRequestError(MSG_INVALID_QUANTITY);
		}
		
		if (typeof unitPrice !== "number" || unitPrice <= 0) {
			throw new BadRequestError(MSG_INVALID_UNIT_PRICE);
		}
	}
};

//--- Update orders -----------------------------------------------------------------------------//
export const updateOrders = async (characterId, 
								   type, 
								   category, 
								   orders,
								   connection = db) => {
	const validTypes = ["buy", "sell"];
	if (!validTypes.includes(type)) {
		throw new BadRequestError(MSG_INVALID_TYPE);
	}
	
	const validCategories = ["product", "building"];
	if (!validCategories.includes(category)) {
		throw new BadRequestError(MSG_INVALID_CATEGORY);
	}
	
	await connection.execute(
		`DELETE FROM ${category}_${type}_orders
		 WHERE character_id = ?`,
		[characterId]
	);

	if (orders.length === 0) {
		return;
	}

	const valuePlaceholders = orders.map(() => "(?, ?, ?, ?)").join(", ");
	const valueParams = orders.flatMap(order => [
		characterId,
		order.itemId,
		order.quantity,
		order.unitPrice,
	]);

	await connection.execute(
		`INSERT INTO ${category}_${type}_orders
		 (character_id, 
		  ${category}_id, 
		  ${type === "buy" ? "demand" : "supply"}, 
		  ${type === "buy" ? "max" : "min"}_unit_price)
		 VALUES ${valuePlaceholders}`,
		valueParams
	);
};

//--- Confirm orders ----------------------------------------------------------------------------//
export const confirmOrders = async (characterId, 
								    connection = db) => {
	await connection.execute(
		`UPDATE characters
		 SET has_confirmed_orders = TRUE
		 WHERE id = ?`,
		[characterId]
	);
};

//--- Get available hours -----------------------------------------------------------------------//+
export const getAvailableHours = async (characterId, 
										connection = db) => {
	const [character] = await connection.execute(
		`SELECT hours_available
		 FROM characters
		 WHERE id = ?`,
		[characterId]
	);
	if (character.length === 0) {
		throw new NotFoundError("Personage niet gevonden.");
	}
	return character[0].hours_available;
};

//--- Get contracts -----------------------------------------------------------------------------//
export const getContracts = async (characterId, 
								   connection = db) => {
	const [contracts] = await connection.execute(
		`SELECT ec.id, 
				ec.hours, 
				ec.hourly_wage, 
				emp.first_name AS employer_first_name, 
				emp.last_name AS employer_last_name, 
				j.name AS job_name
		 FROM employment_contracts ec
		 INNER JOIN characters emp ON ec.employer_id = emp.id
		 INNER JOIN jobs j ON ec.job_id = j.id
		 WHERE ec.employee_id = ?
		 ORDER BY ec.hourly_wage DESC`,
		[characterId]
	);
	return contracts;
};