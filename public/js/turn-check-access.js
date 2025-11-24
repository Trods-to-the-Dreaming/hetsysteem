//=== Imports ===================================================================================//

import { turn } from '/js/turn.js';

//=== Main ======================================================================================//

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
	
	turn.actionPages = JSON.parse(localStorage.getItem('turn.actionPages'));
	turn.currentPageIndex = JSON.parse(localStorage.getItem('turn.currentPageIndex'));
	
	// Check if this page is allowed
	if (!turn.actionPages[turn.page.index].isRelevant ||
		turn.page.index > turn.currentPageIndex) {
		location.replace(turn.actionPages[turn.currentPageIndex].url);
		return;
	}
	
	turn.firstRelevantPageIndex = JSON.parse(localStorage.getItem('turn.firstRelevantPageIndex'));
	turn.lastRelevantPageIndex = JSON.parse(localStorage.getItem('turn.lastRelevantPageIndex'));
}
//-----------------------------------------------------------------------------------------------//
} // turn.page end
//-----------------------------------------------------------------------------------------------//
export { turn };