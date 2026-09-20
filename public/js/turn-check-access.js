import { turn } from '/js/turn.js';

//===============================================================================================//

turn.phase = {
//-----------------------------------------------------------------------------------------------//
	...turn.phase,
//-----------------------------------------------------------------------------------------------//
	checkAccess(phaseKey) {	
		turn.isActive = turn.storage.load('isActive');
		
		if (!turn.isActive) {
			// The user has not loaded the turn yet
			location.replace('/game/world/menu');
			return;
		}

		turn.phases = turn.storage.load('phases');
		turn.currentPhaseIndex = turn.storage.load('currentPhaseIndex');		
		
		this.index = turn.phases.findIndex((p) => p.key === phaseKey);

		if (this.index === -1 ||
			this.index > turn.currentPhaseIndex) {
			// The user tries to edit a phase that does not exist or has not been reached yet
			if (turn.currentPhaseIndex < turn.phases.length) {
				// Redirect to the current phase
				location.replace(turn.phases[turn.currentPhaseIndex].url);
				return;
			} else {
				// Redirect to the first phase, because all phases have been confirmed
				location.replace(turn.phases[0].url);
				return;
			}
		}
	}
//-----------------------------------------------------------------------------------------------//
} // turn.phase

//===============================================================================================//

export { turn };