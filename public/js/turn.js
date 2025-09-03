//--- Ensure begin turn -------------------------------------------------------------------------//
function ensureBeginTurn() {
	const beginTurn = localStorage.getItem('beginTurn');
	if (beginTurn === null) {
		window.location.replace('/game/turn/begin');
	}
}

//--- Ensure valid step -------------------------------------------------------------------------//
function ensureValidStep(stepData) {
	if (stepData.thisStep === stepData.currentStep) {
		// This step is the current step --> show
		return; 
	}
	
	if (stepData.thisStep > stepData.currentStep) {
		// This step is a future step --> prevent
		window.location.replace(stepData.steps[stepData.currentStep].url);
		return; 
	}
	
	// This step is a previous step --> show if applicable
	let previousStep = thisStep;
	while (previousStep < currentStep &&
		   !stepData.steps[previousStep].show) {
		previousStep++;
	}
	window.location.replace(stepData.steps[previousStep].url);
}

//--- Go to next step ---------------------------------------------------------------------------//
function goToNextStep(stepData) {
	let nextStep = stepData.currentStep + 1;
	
	while (nextStep <= stepData.lastStep &&
		   !stepData.steps[nextStep].show) {
		nextStep++;
	}
	
	if (nextStep <= stepData.lastStep) {
		localStorage.setItem('currentStep', nextStep);
		window.location.assign(stepData.steps[nextStep].url);
	}
}

//--- Go to previous step -----------------------------------------------------------------------//
function goToPreviousStep(stepData) {
	let previousStep = stepData.currentStep - 1;
	
	while (previousStep >= stepData.firstStep &&
		   !stepData.steps[previousStep].show) {
		previousStep--;
	}
	
	if (previousStep >= stepData.firstStep) {
		localStorage.setItem('currentStep', previousStep);
		window.location.assign(stepData.steps[previousStep].url);
	}
}