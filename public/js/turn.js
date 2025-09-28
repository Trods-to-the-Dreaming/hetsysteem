window.turn = window.turn || {};
window.step = window.step || {};

//--- Check access ------------------------------------------------------------------------------//
window.step.checkAccess = function() {
	window.turn.begin = localStorage.getItem('turn.begin');
	
	// Check if the turn has begun
	if (window.turn.begin === null) {
		window.location.replace('/game/turn/begin');
		return;
	}
	
	window.turn.steps = JSON.parse(localStorage.getItem('turn.steps'));
	window.turn.activeStepIndex = parseInt(localStorage.getItem('turn.activeStepIndex'), 10);
	
	// Check if this step is allowed
	if (!window.turn.steps[window.step.index].isRelevant ||
		window.step.index > window.turn.activeStepIndex) {
		window.location.replace(window.turn.steps[window.turn.activeStepIndex].url);
		return;
	}
	
	window.turn.firstStepIndex = parseInt(localStorage.getItem('turn.firstStepIndex'), 10);
	window.turn.lastStepIndex = parseInt(localStorage.getItem('turn.lastStepIndex'), 10);
}

//--- Initialize --------------------------------------------------------------------------------//
window.step.initialize = function() {
	window.step.load();
	window.step.renderUI();
	window.step.bindUIEvents();
	window.step.updateUIState();
}

//--- Render UI ---------------------------------------------------------------------------------//
window.step.renderUI = function() {
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
	UI.nextButton.addEventListener('click', window.turn.navigateNext);
	UI.backButton.addEventListener('click', window.turn.navigatePrevious);
	UI.finishButton.addEventListener('click', window.turn.finish);
	UI.cancelButton.addEventListener('click', window.turn.cancel);
}

//--- Update UI state ---------------------------------------------------------------------------//
window.step.updateUIState = function() {
	const UI = window.step.getUI();
	
	const isFirstStep = (window.step.index === window.turn.firstStepIndex);
	const isLastStep = (window.step.index === window.turn.lastStepIndex);
	const isActiveStep = (window.step.index === window.turn.activeStepIndex);
	
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

//--- Validate ----------------------------------------------------------------------------------//
window.step.validate = function() {
	const UI = window.step.getUI();
	const allValid = UI.formElements.every(el => el.checkValidity());
	
	UI.nextButton.disabled = !allValid;
	UI.finishButton.disabled = !allValid;
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
	
	for (let i = window.step.index + 1; i <= window.turn.lastStepIndex; i++) {
		localStorage.removeItem(`turn.step.${i}`);
	}
	localStorage.setItem('turn.activeStepIndex', window.step.index);
	
	window.turn.activeStepIndex = window.step.index;
}

//--- Load --------------------------------------------------------------------------------------//
window.step.load = function() {
	window.step.data = JSON.parse(
		localStorage.getItem(`turn.step.${window.step.index}`)
	);
	window.step.loadFields();
};

//--- Save --------------------------------------------------------------------------------------//
window.step.save = function() {
	window.step.saveFields();
	localStorage.setItem(
		`turn.step.${window.step.index}`,
		JSON.stringify(window.step.data)
	);
};

//--- Navigate next -----------------------------------------------------------------------------//
window.turn.navigateNext = function() {
	let nextStep = window.step.index + 1;
	
	while (nextStep <= window.turn.lastStepIndex &&
		   !window.turn.steps[nextStep].isRelevant) {
		nextStep++;
	}
	
	if (nextStep <= window.turn.lastStepIndex) {
		if (window.step.index === window.turn.activeStepIndex) {
			window.step.save();
			localStorage.setItem('turn.activeStepIndex', nextStep);
		}
		window.location.assign(window.turn.steps[nextStep].url);
	}
}

//--- Navigate previous -------------------------------------------------------------------------//
window.turn.navigatePrevious = function() {
	let previousStep = window.step.index - 1;
	
	while (previousStep >= window.turn.firstStepIndex &&
		   !window.turn.steps[previousStep].isRelevant) {
		previousStep--;
	}
	
	if (previousStep >= window.turn.firstStepIndex) {
		window.step.save();
		window.location.assign(window.turn.steps[previousStep].url);
	}
}

//--- Finish ------------------------------------------------------------------------------------//
window.turn.finish = function() {
	window.turn.save();
	window.location.assign('/game/turn/finish');
}

//--- Cancel ------------------------------------------------------------------------------------//
window.turn.cancel = function() {
	// andere items ook wissen
	localStorage.removeItem('turn.begin');
	localStorage.removeItem('turn.steps');
	localStorage.removeItem('turn.firstStepIndex');
	localStorage.removeItem('turn.lastStepIndex');
	localStorage.removeItem('turn.activeStepIndex');
	
	window.location.assign('/game');
}

//--- Populate select ---------------------------------------------------------------------------//
window.step.populateSelect = function(select, options) {
	select.innerHTML = "";
	
	const emptyOption = document.createElement("option");
	emptyOption.value = "";
	emptyOption.disabled = true;
	emptyOption.selected = true;
	emptyOption.hidden = true;
	select.appendChild(emptyOption);

	options.forEach(opt => {
		const option = document.createElement("option");
		option.value = opt.id;
		option.textContent = opt.type;
		select.appendChild(option);
	});
}