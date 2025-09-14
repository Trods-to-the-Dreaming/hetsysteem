window.turn = window.turn || {};
window.step = window.step || {};



//--- Ensure validity ---------------------------------------------------------------------------//
window.step.ensureValidity = function() {
	window.turn.begin = localStorage.getItem('turn.begin');
	
	// Check if the turn has begun
	if (window.turn.begin === null) {
		window.location.replace('/game/turn/begin');
		return;
	}
	
	window.turn.steps = JSON.parse(localStorage.getItem('turn.steps'));
	window.turn.activeStepIndex = parseInt(localStorage.getItem('turn.activeStepIndex'), 10);
	
	// Check if this step is allowed
	if (!window.turn.steps[window.turn.thisStep].isRelevant ||
		window.turn.thisStep > window.turn.activeStep) {
		window.location.replace(window.turn.steps[window.turn.activeStep].url);
		return;
	}
	
	window.turn.firstStep = parseInt(localStorage.getItem('turn.firstStep'), 10);
	window.turn.lastStep = parseInt(localStorage.getItem('turn.lastStep'), 10);
}




//--- Ensure valid step -------------------------------------------------------------------------//
window.step.ensureValidStep = function() {
	window.turn.begin = localStorage.getItem('turn.begin');
	
	// Check if the turn has begun
	if (window.turn.begin === null) {
		window.location.replace('/game/turn/begin');
		return;
	}
	
	window.turn.steps = JSON.parse(localStorage.getItem('turn.steps'));
	window.turn.activeStep = parseInt(localStorage.getItem('turn.activeStep'), 10);
	
	// Check if this step is allowed
	if (!window.turn.steps[window.turn.thisStep].isRelevant ||
		window.turn.thisStep > window.turn.activeStep) {
		window.location.replace(window.turn.steps[window.turn.activeStep].url);
		return;
	}
	
	window.turn.firstStep = parseInt(localStorage.getItem('turn.firstStep'), 10);
	window.turn.lastStep = parseInt(localStorage.getItem('turn.lastStep'), 10);
}

//--- Initialize --------------------------------------------------------------------------------//
window.step.initialize = function() {
	windowstep.loadData();
	windowstep.insertUI();
	windowstep.bindUIEvents();
	windowstep.setVisibility();
}

//--- Insert UI ---------------------------------------------------------------------------------//
window.step.insertUI = function() {
	const UI = window.step.getUI();
	
	const buttons = `
		<button id="next-button" class="button-1" type="button">Volgende →</button>
		<button id="back-button" class="button-1" type="button">← Vorige</button>
		<button id="edit-button" class="button-1" type="button">Bewerken</button>
		<button id="finish-button" class="button-1" type="button">Voltooien</button>
		<button id="cancel-button" class="button-up" type="button">↑ Annuleren</button>`;
	UI.containerDiv.insertAdjacentHTML('beforeend', buttons);
	
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
	UI.containerDiv.insertAdjacentHTML('afterend', editModal);
}

//--- Bind UI events ----------------------------------------------------------------------------//
window.step.bindUIEvents = function() {
	const UI = window.step.getUI();
	
	UI.editButton.addEventListener('click', window.step.edit);
	UI.confirmEditButton.addEventListener('click', window.step.confirmEdit);
	UI.nextButton.addEventListener('click', window.turn.goToNextStep);
	UI.backButton.addEventListener('click', window.turn.goToPreviousStep);
	UI.finishButton.addEventListener('click', window.turn.finish);
	UI.cancelButton.addEventListener('click', window.turn.cancel);
}

//--- Set visibility ----------------------------------------------------------------------------//
window.step.setVisibility = function() {
	const UI = window.step.getUI();
	
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

//--- Get UI ------------------------------------------------------------------------------------//
window.step.getUI = function() {
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

//--- Edit --------------------------------------------------------------------------------------//
window.step.edit = function() {
	const UI = window.step.getUI();
	
	const modal = new bootstrap.Modal(UI.editWarningDiv);
	modal.show();
}

//--- Confirm edit ------------------------------------------------------------------------------//
window.step.confirmEdit = function() {
	const UI = window.step.getUI();
	
	const modal = bootstrap.Modal.getInstance(UI.editWarningDiv);
	modal.hide();
	
	UI.editButton.classList.add('d-none');
	UI.formElements.forEach(el => el.disabled = false);
	
	window.turn.activeStep = window.turn.thisStep;
}

//--- Load data ---------------------------------------------------------------------------------//
window.step.loadData = function() {
	window.step.data = JSON.parse(
		localStorage.getItem(`turn.step.${window.turn.thisStep}`)
	);
	window.step.loadFields();
};

//--- Save data ---------------------------------------------------------------------------------//
window.step.saveData = function() {
	window.step.saveFields();
	localStorage.setItem(
		`turn.step.${window.turn.thisStep}`,
		JSON.stringify(window.step.data)
	);
};

//--- Go to next step ---------------------------------------------------------------------------//
window.turn.goToNextStep = function() {
	console.log('goToNextStep');
	let nextStep = window.turn.thisStep + 1;
	
	while (nextStep <= window.turn.lastStep &&
		   !window.turn.steps[nextStep].isRelevant) {
		nextStep++;
	}
	
	if (nextStep <= window.turn.lastStep) {
		if (window.turn.thisStep === window.turn.activeStep) {
			window.turn.saveStepData();
			localStorage.setItem('turn.activeStep', nextStep);
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
		window.turn.saveStepData();
		window.location.assign(window.turn.steps[previousStep].url);
	}
}

//--- Finish ------------------------------------------------------------------------------------//
window.turn.finish = function() {
	window.turn.saveStepData();
	window.location.assign('/game/turn/finish');
}

//--- Cancel ------------------------------------------------------------------------------------//
window.turn.cancel = function() {
	localStorage.removeItem('turn.begin');
	localStorage.removeItem('turn.steps');
	localStorage.removeItem('turn.firstStep');
	localStorage.removeItem('turn.lastStep');
	localStorage.removeItem('turn.activeStep');
	window.location.assign('/game');
}


//--- Populate select ---------------------------------------------------------------------------//
window.turn.populateSelect = function(select, options) {
	select.innerHTML = "";
	options.forEach(opt => {
		const option = document.createElement("option");
		option.value = opt;
		option.textContent = opt;
		select.appendChild(option);
	});
}