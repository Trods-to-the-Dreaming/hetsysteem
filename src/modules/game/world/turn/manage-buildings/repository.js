import knex from '#utils/db.js';

//===============================================================================================//

export function findBuilding({ slug,
							   trx = knex }) {
	return trx('buildings')
		.select({ id: 'id' })
		.where({ slug })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function listDemolishActions(trx = knex) {
	return trx('demolish_actions')
		.select({ characterBuildingId: 'character_building_id' });
}
//-----------------------------------------------------------------------------------------------//
export function listConstructActions(trx = knex) {
	return trx('construct_actions')
		.select({
			characterBuildingId: 'character_building_id',
			buildingId: 'building_id'
		});
}
//-----------------------------------------------------------------------------------------------//
export function findDemolishActions({ characterId, 
									  trx = knex }) {
	return trx('demolish_actions as da')
		.select({ characterBuildingId: 'da.character_building_id' })
		.innerJoin('character_buildings as cb', 'da.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId });
}
//-----------------------------------------------------------------------------------------------//
export function findConstructActions({ characterId, 
									   trx = knex }) {
	return trx('construct_actions as ca')
		.select({ 
			characterBuildingId: 'ca.character_building_id',
			buildingId: 'ca.building_id'
		})
		.innerJoin('character_buildings as cb', 'ca.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId });
}
//-----------------------------------------------------------------------------------------------//
export function deleteConstructAction({ characterBuildingId,
									    trx = knex }) {
	return trx('construct_actions')
		.where({ character_building_id: characterBuildingId })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteDemolishActions({ characterId,
									    trx = knex }) {
	return trx('demolish_actions')
		.whereIn('character_building_id', function () {
            this.select('id')
                .from('character_buildings')
                .where('character_id', characterId);
        })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteConstructActions({ characterId,
									     trx = knex }) {
	return trx('construct_actions')
		.whereIn('character_building_id', function () {
            this.select('id')
                .from('character_buildings')
                .where('character_id', characterId);
        })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function insertDemolishActions({ demolishActions, 
										trx = knex }) {
    return trx('demolish_actions')
		.insert(
			demolishActions.map((a) => ({
				character_building_id: a.characterBuildingId
			}))
		);
}
//-----------------------------------------------------------------------------------------------//
export function insertConstructActions({ constructActions, 
										 trx = knex }) {
    return trx('construct_actions').insert(
        constructActions.map((a) => ({
            character_building_id: a.characterBuildingId,
            building_id: a.buildingId
        }))
    );
}
//-----------------------------------------------------------------------------------------------//
export function findCharacter({ userId,
								worldId,
								trx = knex }) {
	return trx('characters')
		.select({ 
			id: 'id',
			firstName: 'first_name',
			lastName: 'last_name'
		})
		.where({
			user_id: userId,
			world_id: worldId
		})
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findCharacterState({ characterId,
									 trx = knex }) {
	return trx('character_states')
		.select({ ownedTiles: 'owned_tiles' })
		.where({ character_id: characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findCharacterBuildingsWithState ({ characterId,
												   characterBuildingIds,
												   trx = knex }) {
	return trx('character_buildings as cb')
		.select(1)
		.innerJoin('character_building_states as cbs', 'cbs.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId })
		.whereIn('cb.id', characterBuildingIds);
}
//-----------------------------------------------------------------------------------------------//
export function findCharacterBuildingsWithoutState({ characterId,
												     characterBuildingIds,
												     trx = knex }) {
	return trx('character_buildings as cb')
		.select(1)
		.leftJoin('character_building_states as cbs', 'cbs.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId })
		.whereIn('cb.id', characterBuildingIds)
		.whereNull('cbs.character_building_id');
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterBuilding({ characterId,
										  worldId,
										  characterBuildingName,
										  trx = knex }) {
	return trx('character_buildings')
		.insert({
			character_id: characterId,
			world_id: worldId,
			name: characterBuildingName
		});
}
//-----------------------------------------------------------------------------------------------//
export function deleteCharacterBuilding({ characterBuildingId, 
										  trx = knex }) {
	return trx('character_buildings')
		.where({ id: characterBuildingId })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteUnusedCharacterBuilding({ characterBuildingId,
												characterId,
												trx = knex }) {
	return trx('character_buildings')
		.where({ 
			id: characterBuildingId,
			character_id: characterId
		})
		.whereNotIn('id', function () {
			this.select('character_building_id')
				.from('character_building_states');
		})
		.whereNotIn('id', function () {
			this.select('character_building_id')
				.from('construct_actions');
		})
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterBuildingState({ characterBuildingId,
											   buildingId,
											   trx = knex }) {
	return trx('character_building_states')
		.insert({
			character_building_id: characterBuildingId,
			building_id: buildingId
		});
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterConstructionSite({ characterBuildingId, 
												  targetBuildingId,
												  bricksNeeded,
												  trx = knex }) {
	return trx('character_construction_sites')
		.insert({
			character_building_id: characterBuildingId,
			target_building_id: targetBuildingId,
			bricks_needed: bricksNeeded
		});
}