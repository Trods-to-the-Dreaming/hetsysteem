//=== Imports ===================================================================================//
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import { 
	validateCharacterId,
	hasConfirmedAction,
	confirmAction,
	getFoodInfo,
	getMedicalCareInfo,
	validateConsumption,
	updateConsumption,
	getProductBuyOrders,
	getProductSellOrders,
	getBuildingBuyOrders,
	getBuildingSellOrders,
	getBuyableProducts,
	getSellableProducts,
	getBuyableBuildings,
	getSellableBuildings,
	validateOrders,
	updateOrders,
	getAvailableHours,
	getContracts,
	validateHours,
	updateJobHours,
	updateCourseHours,
	updateActivityHours
} from "../helpers/game-actions.helpers.js";

//=== Constants =================================================================================//
const ACTIONS = ["manage-buildings", "manage-contracts", "spend_time", "trade", "survive"];

//=== Main ======================================================================================//

//--- Show current action page ------------------------------------------------------------------//
export const showCurrentAction = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const currentAction = ACTIONS[currentActionIndex];
		return res.redirect(`/game/actions/${currentAction}`);
	} catch (err) {
		next(err);
	}
};

//--- Show manage buildings page ----------------------------------------------------------------//
export const showManageBuildings = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const expectedActionIndex = 0;
		if (currentActionIndex < expectedActionIndex) {
			const currentAction = ACTIONS[currentActionIndex];
			return res.redirect(`/game/actions/${currentAction}`);
		}
		
		const [
			buildings,
			products,
			boosts
		] = await Promise.all([
			getBuildings(characterId),
			getProducts(characterId),
			getBoosts(characterId)
		]);
		
		const isConfirmed = currentActionIndex > expectedActionIndex;
		
		return res.render("game/actions/manage-buildings", {
			buildings,
			products,
			boosts,
			isConfirmed
		});
	} catch (err) {
		next(err);
	}
};

//--- Show manage contracts page ----------------------------------------------------------------//
export const showManageContracts = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const expectedActionIndex = 2;
		if (currentActionIndex != expectedActionIndex) {
			const currentAction = ACTIONS[currentActionIndex];
			return res.redirect(`/game/actions/${currentAction}`);
		}
		
		const [
			contracts,
			balance,
			buildings
		] = await Promise.all([
			getContracts(characterId),
			getBalance(characterId),
			getBuildings(characterId)
		]);
		
		return res.render("game/actions/manage-contracts", {
			contracts,
			balance,
			buildings
		});
	} catch (err) {
		next(err);
	}
};

//--- Show spend time page ----------------------------------------------------------------------//
export const showSpendTime = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const expectedActionIndex = 3;
		if (currentActionIndex != expectedActionIndex) {
			const currentAction = ACTIONS[currentActionIndex];
			return res.redirect(`/game/actions/${currentAction}`);
		}
		
		const [
			availableHours,
			courses,
			contracts,
			recreation
		] = await Promise.all([
			getAvailableHours(characterId),
			getContracts(characterId),
			getCourses(characterId),
			getRecreation(characterId)
		]);
		
		return res.render("game/actions/spend-time", {
			available_hours: availableHours,
			contracts,
			courses,
			recreation
		});
	} catch (err) {
		next(err);
	}
};

//--- Show trade page ---------------------------------------------------------------------------//
export const showTrade = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const expectedActionIndex = 4;
		if (currentActionIndex != expectedActionIndex) {
			const currentAction = ACTIONS[currentActionIndex];
			return res.redirect(`/game/actions/${currentAction}`);
		}
		
		const [
			balance,
			productBuyOrders,
			productSellOrders,
			buildingBuyOrders,
			buildingSellOrders,
			buyableProducts,
			sellableProducts,
			buyableBuildings,
			sellableBuildings
		] = await Promise.all([
			getBalance(characterId),
			getProductBuyOrders(characterId),
			getProductSellOrders(characterId),
			getBuildingBuyOrders(characterId),
			getBuildingSellOrders(characterId),
			getBuyableProducts(),
			getSellableProducts(characterId),
			getBuyableBuildings(),
			getSellableBuildings(characterId)
		]);
		
		return res.render("game/actions/trade", {
			balance,
			product_buy_orders:   productBuyOrders,
			product_sell_orders:  productSellOrders,
			building_buy_orders:  buildingBuyOrders,
			building_sell_orders: buildingSellOrders,
			buyable_products: 	  buyableProducts,
			sellable_products: 	  sellableProducts,
			buyable_buildings: 	  buyableBuildings,
			sellable_buildings:   sellableBuildings
		});
	} catch (err) {
		next(err);
	}
};

//--- Show survive page -------------------------------------------------------------------------//
export const showSurvive = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const expectedActionIndex = 5;
		if (currentActionIndex != expectedActionIndex) {
			const currentAction = ACTIONS[currentActionIndex];
			return res.redirect(`/game/actions/${currentAction}`);
		}
		
		const [
			food,
			medicalCare
		] = await Promise.all([
			getFoodInfo(characterId),
			getMedicalCareInfo(characterId)
		]);

		return res.render("game/actions/survive", {
			food_available: 		 food.available,
			food_default: 			 food.default,
			food_selectable: 		 food.selectable,
			food_needed: 			 food.needed,
			medical_care_available:  medicalCare.available,
			medical_care_default: 	 medicalCare.default,
			medical_care_selectable: medicalCare.selectable,
			medical_care_needed: 	 medicalCare.needed
		});
	} catch (err) {
		next(err);
	}
};










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

		const [
			food,
			medicalCare,
			hasConfirmed
		] = await Promise.all([
			getFoodInfo(characterId),
			getMedicalCareInfo(characterId),
			hasConfirmedAction(characterId, "survive")
		]);

		return res.render("game/actions/survive", {
			food_available: 		 food.available,
			food_default: 			 food.default,
			food_selectable: 		 food.selectable,
			food_needed: 			 food.needed,
			medical_care_available:  medicalCare.available,
			medical_care_default: 	 medicalCare.default,
			medical_care_selectable: medicalCare.selectable,
			medical_care_needed: 	 medicalCare.needed,
			has_confirmed: 			 hasConfirmed
		});
	} catch (err) {
		next(err);
	}
};

//--- Handle survive request --------------------------------------------------------------------//
export const handleSurvive = async (req, res, next) => {
	const connection = await db.getConnection();
	try {
		const { characterId } = req.session;

		const foodConsumed = Number(req.body.foodConsumed);
		const medicalCareConsumed = Number(req.body.medicalCareConsumed);
		await validateConsumption(foodConsumed, medicalCareConsumed);
		
		await connection.beginTransaction();
		
		await validateCharacterId(characterId);
		await updateConsumption(characterId, foodConsumed, medicalCareConsumed, connection);
		await confirmAction(characterId, "survive", connection);
		
		await connection.commit();
		
		return res.redirect("/game/actions/survive");
	} catch (err) {
		await connection.rollback();
		err.redirect = "/game/actions/survive";
		next(err);
	} finally {
		connection.release();
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
			hasConfirmed
		] = await Promise.all([
			getProductBuyOrders(characterId),
			getProductSellOrders(characterId),
			getBuildingBuyOrders(characterId),
			getBuildingSellOrders(characterId),
			getBuyableProducts(),
			getSellableProducts(characterId),
			getBuyableBuildings(),
			getSellableBuildings(characterId),
			hasConfirmedAction(characterId, "trade")
		]);
		
		return res.render("game/actions/trade", {
			product_buy_orders:   productBuyOrders,
			product_sell_orders:  productSellOrders,
			building_buy_orders:  buildingBuyOrders,
			building_sell_orders: buildingSellOrders,
			buyable_products: 	  buyableProducts,
			sellable_products: 	  sellableProducts,
			buyable_buildings: 	  buyableBuildings,
			sellable_buildings:   sellableBuildings,
			has_confirmed: 		  hasConfirmed
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
		
		await validateCharacterId(characterId);
		await updateOrders(characterId, "buy",  "product",  productBuyOrders,   connection);
		await updateOrders(characterId, "sell", "product",  productSellOrders,  connection);
		await updateOrders(characterId, "buy",  "building", buildingBuyOrders,  connection);
		await updateOrders(characterId, "sell", "building", buildingSellOrders, connection);
		await confirmAction(characterId, "trade", connection);
		
		await connection.commit();
		
		return res.redirect("/game/actions/trade");
	} catch (err) {
		await connection.rollback();
		err.redirect = "/game/actions/trade";
		next(err);
	} finally {
		connection.release();
	}
};

//--- Show spend time page ----------------------------------------------------------------------//
export const showSpendTime = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const [
			availableHours,
			contracts,
			hasConfirmed
		] = await Promise.all([
			getAvailableHours(characterId),
			getContracts(characterId),
			hasConfirmedAction(characterId, "spend_time")
		]);
		
		return res.render("game/actions/spend-time", {
			hours_available: availableHours,
			contracts,
			has_confirmed: hasConfirmed
		});
	} catch (err) {
		next(err);
	}
};

//--- Handle spend time request -----------------------------------------------------------------//
export const handleSpendTime = async (req, res, next) => {
	const connection = await db.getConnection();
	try {
		const { characterId } = req.session;
		
		const jobHours =	  JSON.parse(req.body.jobHours		|| "[]");
		const courseHours =	  JSON.parse(req.body.courseHours	|| "[]");
		const activityHours = JSON.parse(req.body.activityHours	|| "[]");
		
		await validateHours(characterId, jobHours, courseHours, activityHours, connection);
		
		await connection.beginTransaction();
		
		await validateCharacterId(characterId);
		await updateHours(characterId, "job",	   jobHours,	  connection);
		await updateHours(characterId, "course",   courseHours,	  connection);
		await updateHours(characterId, "activity", activityHours, connection);
		await confirmAction(characterId, "spend_time", connection);
		
		await connection.commit();
		
		return res.redirect("/game/actions/spend-time");
	} catch (err) {
		await connection.rollback();
		err.redirect = "/game/actions/spend-time";
		next(err);
	} finally {
		connection.release();
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