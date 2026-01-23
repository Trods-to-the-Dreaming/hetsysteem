import knex from '#utils/db.js';

//===============================================================================================//


export function listConstructActions(trx = knex) {
	return trx('action_construct')
		.select({
			id: 'id',
			worldId: 'world_id',
			characterId: 'character_id',
			buildingId: 'building_id',
			name: 'name',
			size: 'size'
		});
}
//-----------------------------------------------------------------------------------------------//
export function findConstructActions({ characterId, 
									   trx = knex }) {
	return trx('action_construct')
		.select({ 
			id: 'id',
			worldId: 'world_id',
			characterId: 'character_id',
			buildingId: 'building_id',
			name: 'name',
			size: 'size'
		})
		.where({ character_id: characterId });
}
//-----------------------------------------------------------------------------------------------//


export function listDemolishActions(trx = knex) {
	return trx('action_demolish')
		.select({ characterBuildingId: 'character_building_id' });
}
//-----------------------------------------------------------------------------------------------//
export function findDemolishActions({ characterId, 
									  trx = knex }) {
	return trx('action_demolish as ad')
		.select({ characterBuildingId: 'character_building_id' })
		.innerJoin('character_buildings as cb', 'ad.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId });
}
//-----------------------------------------------------------------------------------------------//
/* niet nodige omwille van CASCADE
export function deleteDemolishAction({ characterBuildingId,
									   trx = knex }) {
	return trx('action_demolish')
		.where({ character_building_id: characterBuildingId })
		.del();
}
*/
//-----------------------------------------------------------------------------------------------//
export function upsertDemolishActions({ characterBuildingIds,
									    trx = knex }) {
	return trx('action_demolish')
		.insert({ /*characterBuildingIds is een array */ })
		.onConflict('character_building_id')
		.merge();
}
//-----------------------------------------------------------------------------------------------//

CREATE TABLE action_demolish (
    character_building_id INT UNSIGNED PRIMARY KEY,
	FOREIGN KEY (character_building_id) REFERENCES character_buildings(id) ON DELETE CASCADE
);

CREATE TABLE action_construct (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	world_id TINYINT UNSIGNED NOT NULL,
	character_id INT UNSIGNED NOT NULL,
	building_id TINYINT UNSIGNED NOT NULL,
	name VARCHAR(32) NOT NULL,
	size TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);



export function deleteCharacterBuilding({ characterBuildingId, 
										  trx = knex }) {
	return trx('character_buildings')
		.where('id', characterBuildingId)
		.del();
}
//-----------------------------------------------------------------------------------------------//


export function insertCharacterBuilding({ worldId, 
										  characterId,
										  buildingId,
										  name,
										  size,
										  trx = knex }) {
	return trx('character_buildings').insert({
		world_id: worldId,
		character_id: characterId,
		building_id: buildingId,
		name: name,
		size: size
	});
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterConstructionSite({ characterBuildingId, 
												  buildingId,
												  bricksNeeded,
												  trx = knex }) {
	return trx('character_construction_sites').insert({
		character_building_id: characterBuildingId,
		building_id: buildingId,
		bricks_needed: bricksNeeded
	});
}
//-----------------------------------------------------------------------------------------------//
export function deleteConstructAction({ actionId,
									    trx = knex }) {
	return trx('action_construct')
		.where('id', actionId)
		.del();
}
//-----------------------------------------------------------------------------------------------//







export function insertUser({ username,
							 hashedPassword,
							 trx = knex }) {
	return trx('users').insert({
		name: username,
		password: hashedPassword,
	});
}


CREATE TABLE action_construct (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	world_id TINYINT UNSIGNED NOT NULL,
	character_id INT UNSIGNED NOT NULL,
	building_id TINYINT UNSIGNED NOT NULL,
	name VARCHAR(32) NOT NULL,
	size TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE character_buildings (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	world_id TINYINT UNSIGNED NOT NULL, -- for name uniqueness
	character_id INT UNSIGNED NOT NULL,
	building_id TINYINT UNSIGNED NOT NULL,
	name VARCHAR(32) NOT NULL,
	size TINYINT UNSIGNED NOT NULL DEFAULT 1,
	boosted_working_hours SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	UNIQUE (world_id, name),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE character_construction_sites (
	character_building_id INT UNSIGNED PRIMARY KEY,
	building_id TINYINT UNSIGNED NOT NULL,
	bricks_used TINYINT UNSIGNED NOT NULL DEFAULT 0,
	bricks_needed TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (character_building_id) REFERENCES character_buildings(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

//-----------------------------------------------------------------------------------------------//
export function deleteCharacterBuilding({ characterBuildingId, 
										  trx = knex }) {
	return trx('character_buildings')
		.where('id', characterBuildingId)
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteDemolishAction({ characterBuildingId,
									   trx = knex }) {
	return trx('action_demolish')
		.where('character_building_id', characterBuildingId)
		.del();
}
//-----------------------------------------------------------------------------------------------//