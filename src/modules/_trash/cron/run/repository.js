import knex from '#utils/db.js';

//===============================================================================================//

export function startCronRun(trx = knex) {
	return trx('cron_runs').insert({
		status: 'running'
	});
}
//-----------------------------------------------------------------------------------------------//
export async function finishCronRun({ runId, 
									  status, 
									  errorMessage = null, 
									  trx = knex }) {
	await trx('cron_runs')
		.where({ id: runId })
		.update({
			status,
			error_message: errorMessage,
			finished_at: knex.fn.now()
		});
}