import { turn } from '/js/turn.js';

//===============================================================================================//

turn.phase = {
//-----------------------------------------------------------------------------------------------//
	...turn.phase,
//-----------------------------------------------------------------------------------------------//
	checkAccess(phaseKey) {
		turn.started = turn.storage.load('started');
		
		if (!turn.started) {
			if (phaseKey === 'start') {
				// The user wants to start the turn
				return;
			}

			// The user tries to play a phase or finish the turn before starting it
			location.replace('/game/turn/start');
			return;
		}
		
		turn.phases = turn.storage.load('phases');
		turn.currentPhaseIndex = turn.storage.load('currentPhaseIndex');
		
		if (phaseKey === 'start') {
			// The user tries to restart the turn without cancelling it
			location.replace(turn.phases[turn.currentPhaseIndex].url);
			return;
		}
		
		if (phaseKey === 'finish') {
			if (turn.currentPhaseIndex === turn.phases.length) {
				// The user wants to finish the turn
				return;
			}
			
			// The user tries to finish the turn without playing all the phases
			location.replace(turn.phases[turn.currentPhaseIndex].url);
			return;
		}
		
		const phaseIndex = turn.phases.findIndex((p) => p.key === phaseKey);

		if (phaseIndex === -1) {
			// This should never happen
			location.replace('/game');
			return;
		}

		this.index = phaseIndex;
		
		if (phaseIndex <= turn.currentPhaseIndex) {
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