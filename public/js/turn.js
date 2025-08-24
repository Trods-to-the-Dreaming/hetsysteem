function checkTurnStep(thisTurnStep) {
	const turnSteps = JSON.parse(localStorage.getItem('turnSteps'));
	const currentTurnStep = parseInt(localStorage.getItem('currentTurnStep'), 10);

	if (currentTurnStep !== thisTurnStep) {
		window.location.replace(turnSteps[currentTurnStep]);
		return false;
	}

	return true;
}
