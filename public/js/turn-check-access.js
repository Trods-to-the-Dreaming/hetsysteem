import { turn } from '/js/turn.js';

//=== Page (begin) ==============================================================================//
turn.page = { ...turn.page,
	
//--- Check access ------------------------------------------------------------------------------//
checkAccess() {
	turn.begin = localStorage.getItem('turn.begin');
	
	// Check if the turn has begun
	if (turn.begin === null) {
		location.replace('/game/turn/begin');
		return;
	}
	
	turn.actionPages = JSON.parse(localStorage.getItem('turn.actionPages'));
	turn.currentPageIndex = Number(localStorage.getItem('turn.currentPageIndex'));
	
	// Check if this page is allowed
	if (!turn.actionPages[turn.page.index].isRelevant ||
		turn.page.index > turn.currentPageIndex) {
		location.replace(turn.actionPages[turn.currentPageIndex].url);
		return;
	}
	
	turn.firstRelevantPageIndex = Number(localStorage.getItem('turn.firstRelevantPageIndex'));
	turn.lastRelevantPageIndex = Number(localStorage.getItem('turn.lastRelevantPageIndex'));
}

//=== Page (end) ================================================================================//
}

export { turn };