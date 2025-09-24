//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import { 
	BadRequestError 
} from '../utils/errors.js';

import { 
	MSG_INVALID_CHARACTER,
	MSG_INVALID_WORLD
} from '../constants/game.messages.js';
import { 
	YEARS_PER_TURN,
	HOURS_FULLTIME,
	EDUCATION_LEVEL
} from '../constants/game.rules.js';

//=== Main ======================================================================================//

//--- Get character state -----------------------------------------------------------------------//
export const getCharacterState = async (characterId,
										trx = knex) => {
	const state = await knex('characters')
		.select(
			'is_customized as isCustomized',
			'owned_tiles as ownedTiles',
			'hours_available as hoursAvailable'
		)
		.where('id', characterId)
		.first();

	if (!state) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	return state;
};

//--- Get character products --------------------------------------------------------------------//
export const getCharacterProducts = async (characterId,
										   trx = knex) => {
	const products = await knex('character_products')
		.select(
			'product_id as productId',
			'quantity'
		)
		.where('owner_id', characterId);
	
	return products;
};

//--- Get character buildings -------------------------------------------------------------------//
export const getCharacterBuildings = async (characterId,
											trx = knex) => {
	const buildings = await knex('character_buildings')
		.select(
			'id',
			'name',
			'size',
			'building_id as buildingId'
		)
		.where('owner_id', characterId);
	
	return buildings;
};

//--- Get employee contracts --------------------------------------------------------------------//
export const getEmployeeContracts = async (characterId,
										   trx = knex) => {
	const contracts = await knex('employment_contracts as ec')
		.select(
			'ec.id as id',
			'cb.name as buildingName',
			'ec.working_hours as workingHours',
			'ec.hourly_wage as hourlyWage',
			'c.first_name as employerFirstName',
			'c.last_name as employerLastName'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.innerJoin('characters as c', 'c.id', 'cb.owner_id')
		.where('ec.employee_id', characterId);
	
	return contracts;
};

//--- Get employer contracts --------------------------------------------------------------------//
export const getEmployerContracts = async (characterId, 
										   trx = knex) => {
	const contracts = await knex('employment_contracts as ec')
		.select(
			'ec.id as id',
			'cb.name as buildingName',
			'ec.working_hours as workingHours',
			'ec.hourly_wage as hourlyWage',
			'c.first_name as employeeFirstName',
			'c.last_name as employeeLastName'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.innerJoin('characters as c', 'c.id', 'ec.employee_id')
		.where('cb.owner_id', characterId);
	
	return contracts;
};









//--- Is character customized? ------------------------------------------------------------------//
export const isCharacterCustomized = async (characterId,
											trx = knex) => {
	const data = await trx('characters')
		.select(
			'is_customized as isCustomized'
		)
		.where('id', characterId)
		.first();
	if (!data) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	return data.isCustomized;
};

//--- Get character state -----------------------------------------------------------------------//
export const getCharacterState = async (characterId,
										trx = knex) => {
	const buildings = await knex('character_buildings as cb')
		.select(
			'cb.id as characterBuildingId',
			'cb.name as characterBuildingName',
			'cb.size as characterBuildingSize',
			'b.id as buildingId',
			'b.type as buildingType',
			'b.tile_size as buildingTileSize',
			'j.type as jobType',
			'j.output_id as jobOutputId',
			'j.max_working_hours as jobMaxHours'
		)
		.leftJoin('buildings as b', 'b.id', 'cb.building_id')
		.where('cb.owner_id', characterId);

	if (!data) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	return data.isCustomized;
};

//--- Is name available? ------------------------------------------------------------------------//
export const isNameAvailable = async (selfId,
									  worldId, 
									  firstName, 
									  lastName,
									  trx = knex) => {
	const duplicate = await trx('characters')
		.select(1)
		.where('id', '!=', selfId)
		.andWhere('world_id', worldId)
		.andWhereRaw('LOWER(first_name) = ?', firstName.toLowerCase())
		.andWhereRaw('LOWER(last_name) = ?', lastName.toLowerCase())
		.first();
	return !duplicate;
};

//--- Get data customized character -------------------------------------------------------------//
export const getDataCustomizeCharacter = async (characterId,
												trx = knex) => {
	const data = await trx('characters as c')
		.select(
			'c.first_name as firstName',
			'c.last_name as lastName',
			'j1.type as jobPreference1',
			'j2.type as jobPreference2',
			'j3.type as jobPreference3',
			'p.type as recreationPreference'
		)
		.leftJoin('jobs as j1', 'c.job_preference_1_id', 'j1.id')
		.leftJoin('jobs as j2', 'c.job_preference_2_id', 'j2.id')
		.leftJoin('jobs as j3', 'c.job_preference_3_id', 'j3.id')
		.leftJoin('recreations as r', 'c.recreation_preference_id', 'r.id')
		.leftJoin('products as p', 'r.product_id', 'p.id')
		.where('c.id', characterId)
		.first();
	if (!data) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	return data;
};

//--- Build character view ----------------------------------------------------------------------//
export const buildCharacterView = async (characterId,
										 worldId,
										 trx = knex) => {
	const character = await trx('characters as c')
		.select(
			'c.first_name as firstName',
			'c.last_name as lastName',
			'j1.type as jobPreference1',
			'j2.type as jobPreference2',
			'j3.type as jobPreference3',
			'p.type as recreationPreference',
			'c.birth_date as birthDate',
			'c.health',
			'c.life_expectancy as lifeExpectancy',
			'c.happiness',
			'c.education',
			'c.balance',
			'c.owned_tiles as ownedTiles'
		)
		.innerJoin('jobs as j1', 'c.job_preference_1_id', 'j1.id')
		.innerJoin('jobs as j2', 'c.job_preference_2_id', 'j2.id')
		.innerJoin('jobs as j3', 'c.job_preference_3_id', 'j3.id')
		.innerJoin('recreations as r', 'c.recreation_preference_id', 'r.id')
		.innerJoin('products as p', 'r.product_id', 'p.id')
		.where('c.id', characterId)
		.first();
	if (!character) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	const world = await trx('world_state')
		.select('current_turn as currentTurn')
		.where('world_id', worldId)
		.first();
	if (!world) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	
	// Calculate age
	character.age = (world.currentTurn - character.birthDate) * YEARS_PER_TURN;
	
	// Calculate education level
	const educationIndex = Math.floor(character.education); // TO DO: change formula
	character.education_level = EDUCATION_LEVEL[educationIndex];
	delete character.education;
	
	// Job experience
	const jobExperience = await trx('character_experience as ce')
		.select(
			'j.type as job',
			'ce.experience AS experienceHours')
		.innerJoin('jobs as j', 'ce.job_id', 'j.id')
		.where('ce.character_id', characterId);
	character.experience = jobExperience.map((row) => ({
		job: row.job,
		experienceYears: convertHoursToYears(row.experienceHours),
	}));

	return character;
};

//=== Extra =====================================================================================//

//--- Convert hours to years --------------------------------------------------------------------//
function convertHoursToYears(hours) {
	return Math.round((hours / HOURS_FULLTIME) * 10) / 10; // TO DO: change formula
}

/*//--- Calculate life expectancy -------------------------------------------------------
function calculateLifeExpectancy(age, 
								 gain,
								 loss) {
	return Math.max(
		age + GAME_RULES.YEARS_PER_TURN - 1,
		GAME_RULES.MAX_AGE + gain * GAME_RULES.HEALTH_GAIN_FACTOR
						   - loss * GAME_RULES.HEALTH_LOSS_FACTOR
	);
}*/