import knex from '#utils/db.js';

//===============================================================================================//

export function listDemolishActions(trx = knex) {
	return trx('actions_demolish')
		.select({ characterBuildingId: 'character_building_id' });
}
//-----------------------------------------------------------------------------------------------//
export function listConstructActions(trx = knex) {
	return trx('actions_construct')
		.select({
			characterBuildingId: 'character_building_id',
			buildingId: 'building_id',
			size: 'size'
		});
}
//-----------------------------------------------------------------------------------------------//
export function findDemolishActions({ characterId, 
									  trx = knex }) {
	return trx('actions_demolish as ad')
		.select({ characterBuildingId: 'ad.character_building_id' })
		.innerJoin('character_buildings as cb', 'ad.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId });
}
//-----------------------------------------------------------------------------------------------//
export function findConstructActions({ characterId, 
									   trx = knex }) {
	return trx('actions_construct as ac')
		.select({ 
			characterBuildingId: 'ac.character_building_id',
			buildingId: 'ac.building_id',
			size: 'ac.size'
		})
		.innerJoin('character_buildings as cb', 'ac.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId });
}
//-----------------------------------------------------------------------------------------------//
export function deleteConstructAction({ characterBuildingId,
									    trx = knex }) {
	return trx('actions_construct')
		.where({ character_building_id: characterBuildingId })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteDemolishActions({ characterId,
									    trx = knex }) {
	return trx('actions_demolish')
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
	return trx('actions_construct')
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
    return trx('actions_demolish')
		.insert(
			demolishActions.map(a => ({
				character_building_id: a.characterBuildingId
			}))
		);
}
//-----------------------------------------------------------------------------------------------//
export function insertConstructActions({ constructActions, 
										 trx = knex }) {
    return trx('actions_construct').insert(
        constructActions.map(a => ({
            character_building_id: a.characterBuildingId,
            building_id: a.buildingId,
            size: a.size
        }))
    );
}
//-----------------------------------------------------------------------------------------------//
export function findCharacter({ characterId,
								trx = knex }) {
	return trx('characters')
		.select({ ownedTiles: 'owned_tiles' })
		.where({ id: characterId })
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
export function deleteCharacterBuilding({ characterBuildingId, 
										  trx = knex }) {
	return trx('character_buildings')
		.where('id', characterBuildingId)
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterBuildingState({ characterBuildingId,
											   buildingId,
											   size,
											   trx = knex }) {
	return trx('character_building_states')
		.insert({
			character_building_id: characterBuildingId,
			building_id: buildingId,
			size: size
		});
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterConstructionSite({ characterBuildingId, 
												  buildingId,
												  bricksNeeded,
												  trx = knex }) {
	return trx('character_construction_sites')
		.insert({
			character_building_id: characterBuildingId,
			building_id: buildingId,
			bricks_needed: bricksNeeded
		});
}