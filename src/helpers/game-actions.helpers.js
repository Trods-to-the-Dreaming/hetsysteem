//=== Imports ===================================================================================//
import knex from '../utils/db.js';

//=== Main ======================================================================================//

//--- Get character customization ---------------------------------------------------------------//
export const getCharacterCustomization = async (characterId,
												trx = knex) => {
	const actions = await trx('action_customize')
		.select(
			'id',
			'first_name as firstName',
			'last_name as lastName',
			'job_preference_1_id as jobPreference1',
			'job_preference_2_id as jobPreference2',
			'job_preference_3_id as jobPreference3',
			'recreation_preference_id as recreationPreference'
		)
		.where('character_id', characterId)
		.first();
	
	return actions;
};

//--- Set character customization ---------------------------------------------------------------//
export const setCharacterCustomization = async (characterId,
												trx = knex) => {
	const actions = await trx('action_customize')
		.select(
			'id',
			'first_name as firstName',
			'last_name as lastName',
			'job_preference_1_id as jobPreference1',
			'job_preference_2_id as jobPreference2',
			'job_preference_3_id as jobPreference3',
			'recreation_preference_id as recreationPreference'
		)
		.where('character_id', characterId)
		.first();
	
	return actions;
};

//--- Get buildings management ------------------------------------------------------------------//
export const getBuildingsManagement = async (characterId,
											 trx = knex) => {
	const demolish = await trx('action_demolish as ad')
		.select(
			'ad.id as id',
			'cb.id as buildingId'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ad.building_id')
		.where('cb.owner_id', characterId)
	
	const construct = await trx('action_construct')
		.select(
			'id',
			'name',
			'building_id as buildingId',
			'size'
		)
		.where('owner_id', characterId)
	
	return { demolish,
			 construct };
};

//--- Get employment contracts management -------------------------------------------------------//
export const getEmploymentContractsManagement = async (characterId,
													   trx = knex) => {
	const apply = await trx('action_apply')
		.select(
			'id',
			'job_id as jobId',
			'working_hours as workingHours',
			'min_hourly_wage as minHourlyWage'
		)
		.where('applicant_id', characterId);
	
	const resign = await trx('action_resign as ar')
		.select(
			'ar.id',
			'ar.contract_id as contractId'
		)
		.innerJoin('employment_contracts as ec', 'ec.id', 'ar.contract_id')
		.where('ec.employee_id', characterId);
	
	const recruit = await trx('action_recruit as ar')
		.select(
			'ar.id',
			'ar.job_id as jobId',
			'ar.working_hours as workingHours',
			'ar.max_hourly_wage as maxHourlyWage'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ar.job_id')
		.where('cb.owner_id', characterId);
	
	const dismiss = await trx('action_dismiss as ad')
		.select(
			'ad.id',
			'ad.contract_id as contractId'
		)
		.innerJoin('employment_contracts as ec', 'ec.id', 'ad.contract_id')
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.where('cb.owner_id', characterId);
	
	return { apply,
			 resign,
			 recruit,
			 dismiss };
};

//--- Get rental agreements management ----------------------------------------------------------//
export const getRentalAgreementsManagement = async (characterId,
													trx = knex) => {
	
	/*const rent = await trx('action_rent as ad')
		.select(
			'ad.id as id',
			'cb.id as buildingId'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ad.building_id')
		.where('cb.owner_id', characterId)
	
	const rentOut = await trx('action_rent_out')
		.select(
			'id',
			'name',
			'building_id as buildingId',
			'size'
		)
		.where('owner_id', characterId)
	
	return { rent,
			 rentOut };*/
			 
	return ;
};

//--- Get production ----------------------------------------------------------------------------//
export const getProduction = async (characterId,
									trx = knex) => {
	
	return ;
};

//--- Get trading -------------------------------------------------------------------------------//
export const getTrading = async (characterId,
								 trx = knex) => {
	
	return ;
};

//--- Get sharing -------------------------------------------------------------------------------//
export const getSharing = async (characterId,
								 trx = knex) => {
	
	return ;
};

//--- Get consumption ---------------------------------------------------------------------------//
export const getConsumption = async (characterId,
									 trx = knex) => {
	
	return ;
};

//--- Get group management ----------------------------------------------------------------------//
export const getGroupManagement = async (characterId,
										 trx = knex) => {
	
	return ;
};