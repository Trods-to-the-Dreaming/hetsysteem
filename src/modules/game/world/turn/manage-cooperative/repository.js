import knex from '#utils/db.js';

//===============================================================================================//

export function findCharacter({ userId,
								worldId,
								trx = knex }) {
	return trx('characters')
		.select({ id: 'id' })
		.where({
			user_id: userId,
			world_id: worldId
		})
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findCooperative({ worldId,
								  cooperativeName,
								  trx = knex }) {
	return trx('cooperatives')
		.select({ 
			id: 'id',
			name: 'name'
		})
		.where({ world_id: worldId })
		.whereRaw('LOWER(name) = LOWER(?)', [cooperativeName])
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function insertCooperative({ founderId,
									worldId,
								    cooperativeName,
								    trx = knex }) {
	return trx('cooperatives').insert({
			founder_id: founderId,
			world_id: worldId,
			name: cooperativeName
		});
}
//-----------------------------------------------------------------------------------------------//
export function deleteUnusedCooperative({ founderId,
										  cooperativeId,
										  trx = knex }) {
	return trx('cooperatives')
		.where({ 
			id: cooperativeId,
			founder_id: founderId
		})
		.whereNotIn('id', function () {
			this.select('cooperative_id')
				.from('cooperative_states');
		})
		.whereNotIn('id', function () {
			this.select('cooperative_id')
				.from('found_actions');
		})
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function hasLeaveAction({ characterId, 
								 trx = knex }) {
	return trx('leave_actions')
		.select(1)
		.where({ member_id: characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findJoinAction({ characterId, 
								 trx = knex }) {
	return trx('join_actions as ja')
		.select({ 
			cooperativeId: 'ja.cooperative_id',
			cooperativeName: 'c.name'
		})
		.leftJoin('cooperatives as c', 'ja.cooperative_id', 'c.id') // cooperative_id can be NULL
		.where({ 'ja.applicant_id': characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findFoundAction({ characterId, 
								  trx = knex }) {
	return trx('found_actions as fa')
		.select({ 
			cooperativeId: 'fa.cooperative_id',
			cooperativeName: 'c.name',
			isOpen: 'fa.is_open',
			maxMembers: 'fa.max_members'
		})
		.innerJoin('cooperatives as c', 'fa.cooperative_id', 'c.id')
		.where({ 'fa.founder_id': characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findInviteActions({ characterId, 
									trx = knex }) {
	return trx('invite_actions as ia')
		.select({ 
			inviteeId: 'ia.invitee_id',
			inviteeFirstName: 'c.first_name',
			inviteeLastName: 'c.last_name',
			inviteeUsername: 'u.name'
		})
		.innerJoin('characters as c', 'ia.invitee_id', 'c.id')
		.innerJoin('users as u', 'c.user_id', 'u.id')
		.where({ 'ia.inviter_id': characterId })
		.orderBy('inviteeLastName')
		.orderBy('inviteeFirstName');
}