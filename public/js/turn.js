window.turn = window.turn || {};

//--- Insert edit modal -------------------------------------------------------------------------//
window.turn.insertEditModal = function() {
	const editModal = `
		<div id="edit-warning-div" class="modal fade" tabindex="-1" role="dialog" 
			 aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Waarschuwing</h5>
						<button class="btn-close" type="button" data-bs-dismiss="modal" 
							    aria-label="Sluiten"></button>
					</div>
					<div class="modal-body">
						Om uw beurt vanaf deze stap bewerken,  
						moeten alle volgende stappen worden gewist.
					</div>
					<div class="modal-footer">
						<button class="button-cancel" type="button" data-bs-dismiss="modal">
							Annuleren
						</button>
						<button id="confirm-edit-button" class="button-ok" type="button">
							Bewerken
						</button>
					</div>
				</div>
			</div>
		</div>`;
	
	document.body.insertAdjacentHTML('beforeend', editModal);
}

//--- Ensure valid step -------------------------------------------------------------------------//
window.turn.ensureValidStep = function() {
	window.turn.begin = localStorage.getItem('begin');
	
	if (window.turn.begin === null) {
		window.location.replace('/game/turn/begin');
		return;
	}
	
	window.turn.steps = JSON.parse(localStorage.getItem('steps'));
	window.turn.firstStep = parseInt(localStorage.getItem('firstStep'), 10);
	window.turn.lastStep = parseInt(localStorage.getItem('lastStep'), 10);
	window.turn.activeStep = parseInt(localStorage.getItem('activeStep'), 10);
	
	// Case 1: This is the active step -> show
	if (window.turn.thisStep === window.turn.activeStep) {
		return; 
	}
	
	// Case 2: this is a previous relevant step -> show
	if (window.turn.thisStep < window.turn.activeStep &&
		window.turn.steps[window.turn.thisStep].isRelevant) {
		return;
	}
	
	// Case 3: This step is irrelevant, or another step must be handled first -> do not show
	window.location.replace(window.turn.steps[window.turn.activeStep].url);
}

//--- Get UI ------------------------------------------------------------------------------------//
window.turn.getUI = function() {
	const containerDiv = document.getElementById('container-div');
	const formElements = Array.from(containerDiv.querySelectorAll('input, select'));
	const nextButton = document.getElementById('next-button');
	const backButton = document.getElementById('back-button');
	const editButton = document.getElementById('edit-button');
	const finishButton = document.getElementById('finish-button');
	const cancelButton = document.getElementById('cancel-button');
	
	const editWarningDiv = document.getElementById('edit-warning-div');
	const confirmEditButton = document.getElementById('confirm-edit-button');
	
	return {
		containerDiv,
		formElements,
		nextButton,
		backButton,
		editButton,
		finishButton,
		cancelButton,
		editWarningDiv,
		confirmEditButton
	};
}

//--- Set up UI ---------------------------------------------------------------------------------//
window.turn.setupUI = function() {
	const UI = window.turn.getUI();
	
	const isFirstStep = (window.turn.thisStep === window.turn.firstStep);
	const isLastStep = (window.turn.thisStep === window.turn.lastStep);
	const isActiveStep = (window.turn.thisStep === window.turn.activeStep);
	
	if (isFirstStep) {
		UI.backButton.classList.add('d-none');
	} else {
		UI.backButton.classList.remove('d-none');
	}
	
	if (isLastStep) {
		UI.nextButton.classList.add('d-none');
		UI.finishButton.classList.remove('d-none');
	} else {
		UI.nextButton.classList.remove('d-none');
		UI.finishButton.classList.add('d-none');
	}
	
	if (isActiveStep) {
		UI.editButton.classList.add('d-none');
		UI.formElements.forEach(el => el.disabled = false);
	} else {
		UI.editButton.classList.remove('d-none');
		UI.formElements.forEach(el => el.disabled = true);
	}
	
	UI.containerDiv.classList.remove('d-none');
};

//--- Bind UI events ----------------------------------------------------------------------------//
window.turn.bindUIEvents = function() {
	const UI = window.turn.getUI();
	
	UI.nextButton.addEventListener('click', window.turn.goToNextStep);
	UI.backButton.addEventListener('click', window.turn.goToPreviousStep);
	UI.editButton.addEventListener('click', window.turn.editStep);
	UI.confirmEditButton.addEventListener('click', window.turn.confirmEditStep);
	UI.finishButton.addEventListener('click', window.turn.finishTurn);
	UI.cancelButton.addEventListener('click', window.turn.cancelTurn);
}

//--- Go to next step ---------------------------------------------------------------------------//
window.turn.goToNextStep = function() {
	let nextStep = window.turn.thisStep + 1;
	
	while (nextStep <= window.turn.lastStep &&
		   !window.turn.steps[nextStep].isRelevant) {
		nextStep++;
	}
	
	if (nextStep <= window.turn.lastStep) {
		if (window.turn.thisStep === window.turn.activeStep) {
			localStorage.setItem('activeStep', nextStep);
		}
		window.location.assign(window.turn.steps[nextStep].url);
	}
}

//--- Go to previous step -----------------------------------------------------------------------//
window.turn.goToPreviousStep = function() {
	let previousStep = window.turn.thisStep - 1;
	
	while (previousStep >= window.turn.firstStep &&
		   !window.turn.steps[previousStep].isRelevant) {
		previousStep--;
	}
	
	if (previousStep >= window.turn.firstStep) {
		window.location.assign(window.turn.steps[previousStep].url);
	}
}

//--- Finish turn -------------------------------------------------------------------------------//
window.turn.finishTurn = function() {
	window.location.assign('/game/turn/finish');
}

//--- Cancel turn -------------------------------------------------------------------------------//
window.turn.cancelTurn = function() {
	window.location.assign('/game');
}

//--- Edit step ---------------------------------------------------------------------------------//
window.turn.editStep = function() {
	const UI = window.turn.getUI();
	
	const modal = new bootstrap.Modal(UI.editWarningDiv);
	modal.show();
}

//--- Confirm edit step -------------------------------------------------------------------------//
window.turn.confirmEditStep = function() {
	const UI = window.turn.getUI();
	
	const modal = bootstrap.Modal.getInstance(UI.editWarningDiv);
	modal.hide();
	
	UI.editButton.classList.add('d-none');
	UI.formElements.forEach(el => el.disabled = false);
	
	window.turn.activeStep = window.turn.thisStep;
}