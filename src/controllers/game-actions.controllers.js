//=== Imports ===================================================================================//
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import { 
	getFoodInfo,
	getMedicalCareInfo,
	getProductBuyOrders,
	getProductSellOrders,
	getBuildingBuyOrders,
	getBuildingSellOrders,
	getBuyableProducts,
	getSellableProducts,
	getBuyableBuildings,
	getSellableBuildings,
	getOrderConfirmation,
	validateOrders,
	updateOrders,
	confirmOrders,
	getAvailableHours,
	getContracts
} from "../helpers/game-actions.helpers.js";

//=== Constants =================================================================================//


//=== Main ======================================================================================//

//--- Show actions page -------------------------------------------------------------------------//
export const showActions = async (req, res, next) => {
	try {
		return res.render("game/actions/actions");
	} catch (err) {
		next(err);
	}
};

//--- Show survive page -------------------------------------------------------------------------//
export const showSurvive = async (req, res, next) => {
	try {
		const { characterId } = req.session;

		const food = await getFoodInfo(characterId);
		const medicalCare = await getMedicalCareInfo(characterId);

		return res.render("game/actions/survive", {
			food_available: food.available,
			food_default: food.default,
			food_selectable: food.selectable,
			food_needed: food.needed,
			medical_care_available: medicalCare.available,
			medical_care_default: medicalCare.default,
			medical_care_selectable: medicalCare.selectable,
			medical_care_needed: medicalCare.needed
		});
	} catch (err) {
		next(err);
	}
};

//--- Show trade page ---------------------------------------------------------------------------//
export const showTrade = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const [
			productBuyOrders,
			productSellOrders,
			buildingBuyOrders,
			buildingSellOrders,
			buyableProducts,
			sellableProducts,
			buyableBuildings,
			sellableBuildings,
			hasConfirmedOrders
		] = await Promise.all([
			getProductBuyOrders(characterId),
			getProductSellOrders(characterId),
			getBuildingBuyOrders(characterId),
			getBuildingSellOrders(characterId),
			getBuyableProducts(),
			getSellableProducts(characterId),
			getBuyableBuildings(),
			getSellableBuildings(characterId),
			getOrderConfirmation(characterId)
		]);
		
		return res.render("game/actions/trade", {
			product_buy_orders: productBuyOrders,
			product_sell_orders: productSellOrders,
			building_buy_orders: buildingBuyOrders,
			building_sell_orders: buildingSellOrders,
			buyable_products: buyableProducts,
			sellable_products: sellableProducts,
			buyable_buildings: buyableBuildings,
			sellable_buildings: sellableBuildings,
			has_confirmed_orders: hasConfirmedOrders
		});
	} catch (err) {
		next(err);
	}
};

//--- Handle trade request ----------------------------------------------------------------------//
export const handleTrade = async (req, res, next) => {
	const connection = await db.getConnection();
	try {
		const { characterId } = req.session;
		
		const productBuyOrders   = JSON.parse(req.body.productBuyOrders   || "[]");
		const productSellOrders  = JSON.parse(req.body.productSellOrders  || "[]");
		const buildingBuyOrders  = JSON.parse(req.body.buildingBuyOrders  || "[]");
		const buildingSellOrders = JSON.parse(req.body.buildingSellOrders || "[]");
		
		await validateOrders(productBuyOrders, productSellOrders);
		await validateOrders(buildingBuyOrders, buildingSellOrders);
		
		await connection.beginTransaction();
		
		await updateOrders(characterId, "buy",  "product",  productBuyOrders,   connection);
		await updateOrders(characterId, "sell", "product",  productSellOrders,  connection);
		await updateOrders(characterId, "buy",  "building", buildingBuyOrders,  connection);
		await updateOrders(characterId, "sell", "building", buildingSellOrders, connection);
		
		await confirmOrders(characterId, connection);
		
		await connection.commit();
		
		return res.redirect("/game/actions/trade");
	} catch (err) {
		await connection.rollback(); 
		next(err);
	}
};

//--- Show spend time page ----------------------------------------------------------------------//
export const showSpendTime = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const [
			availableHours,
			contracts
		] = await Promise.all([
			getAvailableHours(characterId),
			getContracts(characterId)
		]);
		
		return res.render("game/actions/spend-time", {
			hours_available: availableHours,
			contracts
		});
	} catch (err) {
		next(err);
	}
};

//--- Show apply page ---------------------------------------------------------------------------//
export const showApply = async (req, res, next) => {
	try {
		return res.render("game/actions/apply");
	} catch (err) {
		next(err);
	}
};

//--- Show resign page --------------------------------------------------------------------------//
export const showResign = async (req, res, next) => {
	try {
		return res.render("game/actions/resign");
	} catch (err) {
		next(err);
	}
};

//--- Show recruit page -------------------------------------------------------------------------//
export const showRecruit = async (req, res, next) => {
	try {
		return res.render("game/actions/recruit");
	} catch (err) {
		next(err);
	}
};

//--- Show fire page ----------------------------------------------------------------------------//
export const showFire = async (req, res, next) => {
	try {
		return res.render("game/actions/fire");
	} catch (err) {
		next(err);
	}
};