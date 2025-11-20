import { turn } from '/js/turn.js';

//=== Page (begin) ==============================================================================//
turn.page = { ...turn.page,
	
//--- Check access ------------------------------------------------------------------------------//
checkAccess() {
	turn.begin = JSON.parse(localStorage.getItem('turn.begin'));
	
	// Check if the turn has begun
	if (turn.begin === null) {
		location.replace('/game/turn/begin');
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
	turn.areActionsSubmitted = JSON.parse(localStorage.getItem('turn.areActionsSubmitted'));
}

//=== Page (end) ================================================================================//
}

export { turn };