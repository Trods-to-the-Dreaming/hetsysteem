//=== Imports ===================================================================================//

import knex from '#utils/db.js';
import { 
	BadRequestError, 
	ConflictError 
} from '#utils/errors.js';

import {
	MSG_INVALID_WORLD,
	MSG_NO_CHARACTER_CLAIMED
} from '#constants/game.messages.js';

import { 
	getWorlds
} from '#helpers/game/static.helpers.js';

//=== Main ======================================================================================//

export const getWorld = async (id, 
							   trx = knex) => {
	const world = (await getWorlds(trx)).find(w => w.id === id);
	if (!world) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	return world;
};
//-----------------------------------------------------------------------------------------------//
export const findUserCharacter = async (userId, 
										worldId, 
										trx = knex) => {
	const character = await trx('characters')
		.select(
			'id',
			'first_name as firstName',
			'last_name as lastName',
			'is_customized as isCustomized'
		)
		.where('user_id', userId)
		.andWhere('world_id', worldId)
		.first();
	return character || null;
};
//-----------------------------------------------------------------------------------------------//
export const claimAICharacter = async (userId, 
									   worldId, 
									   trx = knex) => {
	// Find an AI-character
	const freeCharacter = await trx('characters')
		.select('id')
		.where('user_id', null)
		.andWhere('world_id', worldId)
		.forUpdate()
		.first();
	if (!freeCharacter) {
		return null;
	}
	const characterId = freeCharacter.id;

	// Claim the AI-character
	const updatedRows = await trx('characters')
		.where('id', characterId)
		.andWhere('user_id', null)
		.update({
			user_id: userId,
			is_customized: false
		});
	if (updatedRows !== 1) {
		throw new ConflictError(MSG_NO_CHARACTER_CLAIMED);
	}
	
	// Get the claimed character
	const character = await trx('characters')
		.select(
			'id', 
			'first_name as firstName', 
			'last_name as lastName', 
			'is_customized as isCustomized'
		)
		.where('id', characterId)
		.first();
	return character;
};