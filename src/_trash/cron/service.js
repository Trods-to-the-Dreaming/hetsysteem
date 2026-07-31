import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import {
	startCronRun,
	finishCronRun
} from './run/repository.js';

import { processCustomizeCharacter } from './customize-character/service.js';
import { processManageBuildings } from './manage-buildings/service.js';

//===============================================================================================//

export async function processActions() {
	const [runId] = await startCronRun();
	
	try {
		await knex.transaction(async (trx) => {
			await processCustomizeCharacter(trx);
			await processManageBuildings(trx);
			await processManageEmploymentContracts(trx);
			await processManageRentalAgreements(trx);
			await processProduce(trx);
			await processTrade(trx);
			await processShare(trx);
			await processConsume(trx);
			await processManageGroup(trx);
			await processFinishTurn(trx);
		});

		await finishCronRun(runId, 'success');
	} catch (err) {
		await finishCronRun(runId, 'failed', err.message);
		throw err;
	}
}