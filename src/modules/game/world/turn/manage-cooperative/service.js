import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import {
	findCooperative,
	insertCooperative,
	hasLeaveAction,
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
		hasLeaveAction({ characterId, trx }),
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
export async function getCooperative({ worldId, 
									   cooperativeName }) {
	const cooperative = await findCooperative({ 
		worldId,
		cooperativeName
	});
	
	if (!cooperative)
		throw new GameError(GAME_ERROR.COOPERATIVE_NOT_FOUND);
	
	return cooperative;
}
//-----------------------------------------------------------------------------------------------//
export async function reserveCooperativeName({ userId,
											   worldId,
											   cooperativeName }) {
	const character = await findCharacter({
		userId,
		worldId
	});
	
	let cooperativeId;
	try {
		[cooperativeId] = await insertCooperative({
			founderId: character.id,
			worldId,
			cooperativeName
		});
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY')
			throw new GameError(GAME_ERROR.COOPERATIVE_NAME_TAKEN);
		
		throw err;
	}
	
	return { 
		cooperativeId, // of beter id noemen?
		cooperativeName // of beter name noemen?
	};
}
//-----------------------------------------------------------------------------------------------//
export async function cancelCooperativeName({ userId,
											  worldId,
											  cooperativeId }) {
	const character = await findCharacter({
		userId,
		worldId
	});
	
	await deleteUnusedCooperative({
		founderId: character.id,
		cooperativeId
	});
}