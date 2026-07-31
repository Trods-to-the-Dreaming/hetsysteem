import { 
	listDemolishActions,
	deleteCharacterBuilding,
	deleteDemolishAction,
	listConstructActions,
	insertCharacterBuilding,
	deleteConstructAction
} from './repository.js';

//===============================================================================================//

async function processDemolishActions(trx) {
	const demolishActions = await listDemolishActions(trx);

	for (const action of demolishActions) {
		await deleteCharacterBuilding({
			...action,
			trx
		});

		await deleteDemolishAction({ characterBuildingId: action.characterBuildingId, 
									 trx });
	}
}
//-----------------------------------------------------------------------------------------------//
async function processConstructActions(trx) {
	const constructActions = await listConstructActions(trx);

	for (const action of constructActions) {
		await insertCharacterBuilding({
			...action, // replace building id with the id of a construction site
			trx
		});
		// get character building id to give to construction site
		// calculate needed bricks
		
		await insertCharacterConstructionSite({
			...action,
			trx
		});

		await deleteConstructAction({ characterBuildingId: action.characterBuildingId, 
									  trx });
	}
}

//===============================================================================================//

export async function processManageBuildings(trx) {
	await processDemolishActions(trx);
	await processConstructActions(trx);
}