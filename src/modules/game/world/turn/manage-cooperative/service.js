import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import {
	lockCooperative,
	updateCooperative,
	insertCooperative,
	findLeaveAction,
	findJoinAction,
	findFoundAction,
	findInviteActions
} from './repository.js';

//===============================================================================================//

export async function loadManageCooperative({ characterId,
											  trx = knex }) {
	const [
		leaveActionResult,
		joinAction,
		foundAction,
		inviteActions
	] = await Promise.all([
		findLeaveAction({ characterId, trx }),
		findJoinAction({ characterId, trx }),
		findFoundAction({ characterId, trx }),
		findInviteActions({ characterId, trx })
	]);

	return {
		leaveAction: !!leaveActionResult,
		joinAction,
		foundAction,
		inviteActions
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveManageCooperative({ characterId,
											  manageCooperative,
											  trx = knex }) {
	if (!manageCooperative)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processManageCooperative(trx) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function reserveCooperativeName({ userId, 
											   worldId, 
											   cooperativeName }) {
	return knex.transaction(async (trx) => {
		const cooperative = await lockCooperative({ 
			userId, 
			worldId,
			trx 
		});
		
		try {
			if (cooperative) {
				await updateCooperative({ 
					cooperativeId: cooperative.id, 
					cooperativeName, 
					trx 
				});
				return { cooperativeName };
			}
			
			await insertCooperative({
				userId,
				worldId,
				cooperativeName,
				trx
			});
			
			return { cooperativeName };
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY')
				throw new GameError(GAME_ERROR.COOPERATIVE_NAME_TAKEN);
			
			throw err;
		}
	});
}