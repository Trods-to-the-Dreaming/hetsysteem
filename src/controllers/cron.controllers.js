//=== Imports ===================================================================================//

import knex from '#utils/db.js';

import {
	processCustomizeCharacter,
	processManageBuildings,
	processManageEmploymentContracts,
	processManageRentalAgreements,
	processProduce,
	processTrade,
	processShare,
	processConsume,
	processManageGroup,
	processFinishTurn
} from '#helpers/cron.helpers.js';

//=== Main ======================================================================================//

export const processActions = async (req, res, next) => {
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
		
		const html = `<html>
					  <body>
					  <h1>Gelukt?</h1>
					  </body>
					  </html>`;
	
		res.send(html);
	} catch (err) {
		next(err);
	}
};