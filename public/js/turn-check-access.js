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

		turn.phaseURLs = turn.storage.load('phaseURLs');
		turn.currentPhaseIndex = turn.storage.load('currentPhaseIndex');		
		
		this.index = turn.phaseURLs.findIndex((p) => p.key === phaseKey);

		if (this.index === -1 ||
			this.index > turn.currentPhaseIndex) {
			const targetIndex = turn.currentPhaseIndex < turn.phaseURLs.length
                ? turn.currentPhaseIndex	// Not all phases have been confirmed yet
                : 0; 						// All phases have been confirmed yet
			
			location.replace(turn.phaseURLs[targetIndex].url);
		}
	}
//-----------------------------------------------------------------------------------------------//
} // turn.phase

//===============================================================================================//

export { turn };