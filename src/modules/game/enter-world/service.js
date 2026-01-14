import knex from '#utils/db.js';
import { 
	ok, 
	fail 
} from '#utils/result.js';
import { 
	BadRequestError 
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	getWorlds 
} from './../static-data/service.js';
import { 
	ok, 
	fail 
} from '#utils/result.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME 
} from './../reasons.js';
import {
	findCharacter,
	findFreeCharacter,
	claimCharacter
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_WORLD = 'Deze wereld bestaat niet.';

//===============================================================================================//

export async function enterWorld({ worldId, 
								   userId }) {
	const worlds = await getWorlds();
	
	const world = worlds.find((w) => w.id === worldId);
	if (!world) 
		throw new BadRequestError(MSG_INVALID_WORLD);
	
	const worldData = {
		id: world.id,
		class: 'world-' + world.slug,
		name: world.type
	};
	
	return await knex.transaction(async (trx) => {
		const existingCharacter = await findCharacter({ 
			worldId, 
			userId, 
			trx
		});
		if (existingCharacter) {
			return ok({ 
				world: worldData, 
				character: existingCharacter
			});
		}
		
		while (true) {
			const freeCharacter = await findFreeCharacter({
				worldId, 
				trx
			});
			if (!freeCharacter)
				return fail({ reason: GAME.REASON.NO_NEW_CHARACTERS });
			
			const updated = await claimCharacter({ 
				characterId: freeCharacter.id, 
				userId, 
				trx
			});
			if (updated === 0) 
				continue;
			
			const newCharacter = await findCharacter({
				worldId, 
				userId, 
				trx
			});
			
			return ok({ 
				world: worldData, 
				character: newCharacter
			});
		}
	});
}