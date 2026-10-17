import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import {
	findCharacter,
	findCharacterByName,
	findCooperativeByName,
	insertCooperative,
	deleteUnusedCooperative,
	hasLeaveAction,
	findJoinAction,
	findFoundAction,
	findInviteActions
} from './repository.js';

//===============================================================================================//

export const url = {
	key: 'manageCooperative',
	url: '/game/world/turn/manage-cooperative'
}
//-----------------------------------------------------------------------------------------------//
export async function loadActions({ characterId,
									trx = knex }) {
	if (characterId === null) {
		return {
            leaveAction: false,
            joinAction: null,
            foundAction: null,
            inviteActions: []
        };
	}
	
	const [
		leaveActionExists,
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
		leaveAction: Boolean(leaveActionExists),
		joinAction: joinAction ?? null,
		foundAction: foundAction ?? null,
		inviteActions
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveActions({ characterId,
									actions,
									trx = knex }) {
	if (!actions)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processActions(trx) {
	
}

//===============================================================================================//

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
		id: cooperativeId,
		name: cooperativeName
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
//-----------------------------------------------------------------------------------------------//
export async function getCooperative({ worldId, 
									   cooperativeName }) {
	const cooperative = await findCooperativeByName({ 
		worldId,
		cooperativeName
	});
	
	if (!cooperative)
		throw new GameError(GAME_ERROR.COOPERATIVE_NOT_FOUND);
	
	return cooperative;
}
//-----------------------------------------------------------------------------------------------//
export async function getCharacter({ worldId, 
									 firstName,
									 lastName }) {
	const character = await findCharacterByName({ 
		worldId,
		firstName,
		lastName
	});
	
	if (!character)
		throw new GameError(GAME_ERROR.CHARACTER_NOT_FOUND);
	
	return character;
}