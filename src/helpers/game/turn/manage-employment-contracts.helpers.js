//=== Imports ===================================================================================//

import knex from '#utils/db.js';

//=== Main ======================================================================================//

export const getManageEmploymentContracts = async (characterId,
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
//-----------------------------------------------------------------------------------------------//
export const setManageEmploymentContracts = async (action,
												   characterId,
												   trx = knex) => {
	
};