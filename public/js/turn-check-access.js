import { turn } from '/js/turn.js';

//===============================================================================================//

turn.phase = {
//-----------------------------------------------------------------------------------------------//
	...turn.phase,
//-----------------------------------------------------------------------------------------------//
	async checkTurnEditVersion() {
		try {
			const res = await fetch('/game/turn/check-edit-version', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': 'application/json' 
				},
				body: JSON.stringify({ turnEditVersion: turn.editVersion })
			});

			const json = await res.json();
			
			if (json.redirect) {
				location.replace(json.redirect);
				return;
			}
		} catch (err) {
			alert('De server is momenteel niet bereikbaar.');
		}
	},	
//-----------------------------------------------------------------------------------------------//
	async startTurn() {
		try {
			const res = await fetch('/game/turn/start', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': 'application/json' 
				}
			});
			
			const json = await res.json();
			
			if (json.redirect) {
				location.replace(json.redirect);
				return;
			}

			turn.storage.save('editVersion', json.data.turnEditVersion);
		} catch (err) {
			alert('De server is momenteel niet bereikbaar.');
		}
	},	
//-----------------------------------------------------------------------------------------------//
	async checkAccess(phaseKey) {	
		turn.editVersion = turn.storage.load('editVersion');
		
		if (turn.editVersion === null) {
			if (phaseKey === 'start') {
				// The user wants to start the turn
				await this.startTurn();
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
				await this.checkTurnEditVersion();
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
			await this.checkTurnEditVersion();
			return;
		}
		
		// The user tries to play a phase without playing the previous ones
		location.replace(turn.phases[turn.currentPhaseIndex].url);
	}
//-----------------------------------------------------------------------------------------------//
} // turn.phase

//===============================================================================================//

export { turn };