import { turn } from '/js/turn.js';

//===============================================================================================//

turn.phase = {
//-----------------------------------------------------------------------------------------------//
	...turn.phase,
//-----------------------------------------------------------------------------------------------//
	async checkAccess(phaseKey) {	
		turn.started = turn.storage.load('started');
		
		if (!turn.started) {
			// The user tries to play a phase or finish the turn before starting it
			location.replace('/game/world/turn/start');
			return;
		}

		turn.phases = turn.storage.load('phases');
		turn.currentPhaseIndex = turn.storage.load('currentPhaseIndex');
		
		if (phaseKey === 'finish') {
			if (turn.currentPhaseIndex === turn.phases.length) {
				// The user wants to finish the turn
				return;
			}
			
			// The user tries to finish the turn without playing all the phases
			location.replace(turn.phases[turn.currentPhaseIndex].url);
			return;
		}
		
		this.index = turn.phases.findIndex((p) => p.key === phaseKey);

		if (this.index === -1) {
			// The user tries to play a phase that is not part of the turn
			location.replace(turn.phases[turn.currentPhaseIndex].url);
			return;
		}

		if (this.index <= turn.currentPhaseIndex) {
			// The user tries to play the current phase or view a previous phase
			return;
		}
		
		// The user tries to play a phase without playing the previous ones
		location.replace(turn.phases[turn.currentPhaseIndex].url);
	}
//-----------------------------------------------------------------------------------------------//
} // turn.phase

//===============================================================================================//

export { turn };