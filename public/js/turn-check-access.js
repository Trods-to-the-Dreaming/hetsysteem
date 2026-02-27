import { turn } from '/js/turn.js';

//===============================================================================================//

turn.page = { // turn.page begin
//-----------------------------------------------------------------------------------------------//
...turn.page,
//-----------------------------------------------------------------------------------------------//
checkAccess() {
	turn.started = JSON.parse(localStorage.getItem('turn.started'));
	
	// Check if the turn has started
	if (turn.started === null) {
		location.replace('/game/turn/start');
		return;
	}
	
	turn.phasePages = JSON.parse(localStorage.getItem('turn.phasePages'));
	turn.currentPageIndex = JSON.parse(localStorage.getItem('turn.currentPageIndex'));
	this.index = turn.phasePages.findIndex(p => p.key === this.key)
	
	// Check if this page is allowed
	if (this.index > turn.currentPageIndex) {
		location.replace(turn.phasePages[turn.currentPageIndex].url);
		return;
	}
}
//-----------------------------------------------------------------------------------------------//
} // turn.page end
//-----------------------------------------------------------------------------------------------//
export { turn };