import { turn } from '/js/turn.js';

//===============================================================================================//

turn.phase = {
//-----------------------------------------------------------------------------------------------//
	...turn.phase,
//-----------------------------------------------------------------------------------------------//
	disabled: true,
//-----------------------------------------------------------------------------------------------//
	initialize() {
		this.addElements();
		this.load();
		this.show();
	},
//-----------------------------------------------------------------------------------------------//
	addElements() {
		// Edit turn controls
		const confirmButton = createButton({ 
			btnClass: 'btn--primary', 
			btnText: 'Bevestigen', 
			type: 'submit'
		});
		
		const saveButton = createButton({ 
			btnClass: 'btn--primary', 
			btnText: 'Opslaan', 
			type: 'submit'
		});
		
		const editButton = createButton({ 
			btnClass: 'btn--primary', 
			btnText: 'Bewerken', 
			onClick: () => this.handleEdit()
		});

		// Navigate turn controls
		const nextButton = createButton({ 
			btnClass: 'btn--navigation', 
			btnText: 'Volgende →', 
			onClick: () => turn.handleNext()
		});
		
		const previousButton = createButton({ 
			btnClass: 'btn--navigation', 
			btnText: '← Vorige', 
			onClick: () => turn.handlePrevious()
		});
		
		const cancelButton = createButton({ 
			btnClass: 'btn--navigation', 
			btnText: '↑ Annuleren', 
			onClick: () => turn.handleCancel()
		});
		
		// Edit warning
		const cancelEditButton = createButton({ 
			btnClass: 'btn--modal-cancel', 
			btnText: 'Annuleren'
		});
		cancelEditButton.setAttribute('data-bs-dismiss', 'modal');

		const proceedEditButton = createButton({
			btnClass: 'btn--modal-ok',
			btnText: 'Bewerken',
			onClick: () => this.handleProceedEdit()
		});
		
		const editWarningDiv = createModalDiv({ 
			titleText: 'Waarschuwing',
			icon: '⚠️',
			messageText: 'Alle volgende acties worden gewist, als u deze actie bewerkt.',
			footerButtons: [ cancelEditButton, proceedEditButton ]
		});
		
		// Network error
		const closeNetworkErrorButton = createButton({
			btnClass: 'btn--modal-ok',
			btnText: 'OK',
			onClick: () => turn.handleCloseNetworkError()
		});
		
		const networkErrorDiv = createModalDiv({ 
			titleText: 'Foutmelding',
			icon: '❌',
			messageText: 'De aanvraag kon niet worden verwerkt.',
			footerButtons: [ closeNetworkErrorButton ]
		});
		
		// Layout
		const editDiv = document.createElement('div');
		editDiv.classList.add('mt-lg', 'stack');
		editDiv.append(
			confirmButton, 
			saveButton, 
			editButton
		);
		
		const navigateDiv = document.createElement('div');
		navigateDiv.classList.add('stack');
		navigateDiv.append(
			nextButton,
			previousButton,
			cancelButton
		);
		
		const phaseForm = document.getElementById('phase-form');
		phaseForm.append(
			editDiv,
			document.createElement('hr'),
			navigateDiv
		);
		phaseForm.after(
			editWarningDiv,
			networkErrorDiv
		);
		phaseForm.addEventListener('submit', (event) => {
			event.preventDefault();

			if (event.submitter === confirmButton)
				this.handleConfirm();
			else if (event.submitter === saveButton)
				turn.handleSave();
		});
		
		// Cache
		this.elements = {
			confirmButton,
			saveButton,
			editButton,
			nextButton,
			previousButton,
			cancelButton,
			phaseForm,
			editWarningDiv,
			networkErrorDiv
		};
	},
//-----------------------------------------------------------------------------------------------//
	populateSelect({ select,
					 optionName,
					 items,
					 textField = null }) {
		select.innerHTML = '';
		
		const emptyOption = document.createElement('option');
		emptyOption.value = '';
		emptyOption.textContent = `— kies een ${optionName} —`;
		emptyOption.disabled = true;
		emptyOption.selected = true;
		emptyOption.hidden = true;
		select.appendChild(emptyOption);

		items.forEach((item) => {
			const option = document.createElement('option');
			if (textField !== null) {
				option.value = item.id;
				option.textContent = item[textField];
			} else {
				option.value = item;
				option.textContent = item;
			}
			select.appendChild(option);
		});
	},
//-----------------------------------------------------------------------------------------------//
	show() {
		const isFirstPhase = (this.index === 0);
		const isLastPhase = (this.index === turn.phaseURLs.length - 1);
		const isCurrentPhase = (this.index === turn.currentPhaseIndex);	
		
		this.elements.confirmButton.classList.toggle('d-none', !isCurrentPhase || isLastPhase);
		this.elements.editButton.classList.toggle('d-none', isCurrentPhase);
		this.elements.saveButton.classList.toggle('d-none', !isLastPhase);
		this.elements.nextButton.classList.toggle('d-none', isCurrentPhase);
		this.elements.previousButton.classList.toggle('d-none', isFirstPhase);
		
		this.disabled = !isCurrentPhase;
		
		this.updateUI();
		this.elements.phaseForm.classList.remove('d-none');
	},
//-----------------------------------------------------------------------------------------------//
	handleEdit() {
		const modal = bootstrap.Modal.getOrCreateInstance(this.elements.editWarningDiv);
		modal.show();
	},
//-----------------------------------------------------------------------------------------------//
	handleProceedEdit() {
		const modal = bootstrap.Modal.getInstance(this.elements.editWarningDiv);
		modal.hide();
		
		for (let i = this.index + 1; i < turn.phaseURLs.length; i++) {
			const key = turn.phaseURLs[i].key;
			turn.storage.remove(`phaseActions.${key}Actions`);
		}
		
		turn.storage.save('currentPhaseIndex', this.index);
		turn.currentPhaseIndex = this.index;
		
		this.show();
	},
//-----------------------------------------------------------------------------------------------//
	async handleConfirm() {
		if (this.confirm) {
			const ok = await this.confirm();

			if (!ok)
				return;
		}
		
		this.save();
		turn.storage.save({ key: 'currentPhaseIndex', value: this.index + 1 });
		
		turn.handleNext();
	}
//-----------------------------------------------------------------------------------------------//

} // turn.phase
//-----------------------------------------------------------------------------------------------//
turn.handleLoad = async function() {
	this.isActive = this.storage.load('isActive');
		
	if (this.isActive) {
		// The user is already editing the turn in this browser
		this.phaseURLs = this.storage.load('phaseURLs');
		this.currentPhaseIndex = this.storage.load('currentPhaseIndex');
		
		const targetIndex = turn.currentPhaseIndex < turn.phaseURLs.length
			? turn.currentPhaseIndex	// Not all phases have been confirmed yet
			: 0; 						// All phases have been confirmed yet
		
		location.replace(turn.phaseURLs[targetIndex].url);
		return;
	}
	
	let json;
	
	try {
		const res = await fetch('/game/world/turn/load', {
			method: 'POST'
		});
		
		if (!res.ok)
			throw new Error(`HTTP ${res.status}`);
		
		json = await res.json();
	} catch (err) {
		this.showNetworkError();
		return;
	}
	
	const constants = json.turn.constants;
	const character = json.turn.character;
	const phaseActions = json.turn.phaseActions;
	const phaseURLs = json.turn.phaseURLs;
	const isSaved = json.turn.isSaved;
	
	const currentPhaseIndex = isSaved ? phaseURLs.length : 0;

	this.storage.saveNamespace({ namespace: 'constants', object: constants });
	this.storage.saveNamespace({ namespace: 'character', object: character });
	this.storage.saveNamespace({ namespace: 'phaseActions', object: phaseActions });
	this.storage.save({ key: 'phaseURLs', value: phaseURLs });
	this.storage.save({ key: 'currentPhaseIndex', value: currentPhaseIndex });
	this.storage.save({ key: 'isActive', value: true });

	location.replace(phaseURLs[0].url);
}
//-----------------------------------------------------------------------------------------------//
turn.handleSave = async function() {
	if (this.phase.confirm) {
		const ok = await this.phase.confirm();

		if (!ok)
			return;
	}
	
	this.phase.save();
	this.storage.save({ key: 'currentPhaseIndex', value: this.phase.index + 1 });
	
	const actions = this.storage.loadNamespace('actions');
	
	alert('actions: ' + JSON.stringify(actions));
	
	try {
		const json = await turn.fetchJson({
			url: '/game/world/turn/save', 
			body: { actions }
		});
		
		if (json === null)
			return;
	} catch (err) {
		turn.showNetworkError();
		return;
	}
	
	this.storage.removeAll();
	
	location.assign('/game/world/menu');
}
//-----------------------------------------------------------------------------------------------//
turn.handleCancel = async function() {	
	this.storage.removeAll();
	
	location.assign('/game/world/menu');
}
//-----------------------------------------------------------------------------------------------//
turn.handleNext = function() {
	location.assign(this.phaseURLs[this.phase.index + 1].url);
}
//-----------------------------------------------------------------------------------------------//
turn.handlePrevious = function() {
	location.assign(this.phaseURLs[this.phase.index - 1].url);
}
//-----------------------------------------------------------------------------------------------//
turn.fetchJson = async function({ url, 
								  body = null }) {
    const res = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			...(body !== null && {
				'Content-Type': 'application/json'
			})
		},
		...(body !== null && {
			body: JSON.stringify(body)
		})
    });

    const text = await res.text();
    const json = text ? JSON.parse(text) : undefined;

    if (json?.redirect) {
        location.assign(json.redirect);
        return null;
    }
	
    return json;
}
//-----------------------------------------------------------------------------------------------//
turn.showNetworkError = function() {	
	const modal = bootstrap.Modal.getOrCreateInstance(this.phase.elements.networkErrorDiv);
	modal.show();
}
//-----------------------------------------------------------------------------------------------//
turn.handleCloseNetworkError = function() {
	const modal = bootstrap.Modal.getInstance(this.phase.elements.networkErrorDiv);
	modal.hide();
}

//===============================================================================================//

function createButton({ btnClass,
						btnText = null,
						type = 'button',
						onClick = null }) {
	const btn = document.createElement('button');
	
	btn.classList.add('btn', btnClass);
	btn.type = type;
	
	if (btnText) {
		const span = document.createElement('span');
		span.classList.add('btn-front');
		span.textContent = btnText;
		btn.append(span);
	}
	
	if (onClick) 
		btn.addEventListener('click', onClick);
	
	return btn;
}
//-----------------------------------------------------------------------------------------------//
function createModalDiv({ titleText,
					      icon,
					      messageText,
					      footerButtons }) {
	const modalDiv = document.createElement('div');
	modalDiv.classList.add('modal', 'fade');
	modalDiv.tabIndex = -1;
	modalDiv.setAttribute('role', 'dialog');
	modalDiv.setAttribute('aria-hidden', 'true');

	const dialogDiv = document.createElement('div');
	dialogDiv.classList.add('modal-dialog');

	const contentDiv = document.createElement('div');
	contentDiv.classList.add('modal-content');

	const headerDiv = document.createElement('div');
	headerDiv.classList.add('modal-header');

	const title = document.createElement('h2');
	title.classList.add('modal-title');
	title.textContent = titleText;

	const closeButton = createButton({
		btnClass: 'btn-close'
	});
	closeButton.setAttribute('data-bs-dismiss', 'modal');
	closeButton.setAttribute('aria-label', 'Sluiten');

	const bodyDiv = document.createElement('div');
	bodyDiv.classList.add('modal-body', 'modal-body--alert');

	const iconDiv = document.createElement('div');
	iconDiv.classList.add('modal-icon');
	iconDiv.textContent = icon;

	const message = document.createElement('p');
	message.classList.add('modal-message');
	message.textContent = messageText;

	const footerDiv = document.createElement('div');
	footerDiv.classList.add('modal-footer');
	footerDiv.append(...footerButtons);

	headerDiv.append(title, closeButton);
	bodyDiv.append(iconDiv, message);
	contentDiv.append(headerDiv, bodyDiv, footerDiv);
	dialogDiv.appendChild(contentDiv);
	modalDiv.appendChild(dialogDiv);

	return modalDiv;
}

//===============================================================================================//

export { turn };