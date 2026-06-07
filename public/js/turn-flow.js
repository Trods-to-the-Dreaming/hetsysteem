import { turn } from '/js/turn.js';

//===============================================================================================//

turn.phase = {
//-----------------------------------------------------------------------------------------------//
	...turn.phase,
//-----------------------------------------------------------------------------------------------//
	disabled: true,
	cleanupRunning: false,
//-----------------------------------------------------------------------------------------------//
	initialize() {
		this.addTurnFlowControls();
		this.load();
		this.show();
	},
//-----------------------------------------------------------------------------------------------//
	addTurnFlowControls() {
		function createButton({ btnId, 
								btnClass, 
								btnText, 
								onClick }) {
			const btn = document.createElement('button');
			btn.id = btnId;
			btn.classList.add('btn', btnClass);
			btn.type = 'button';
			if (onClick) btn.addEventListener('click', onClick);
			const span = document.createElement('span');
			span.classList.add('btn-front');
			span.textContent = btnText;
			btn.append(span);
			return btn;
		}
		
		// Game buttons
		const confirmButton = createButton({ 
			btnId: 'confirm-button', 
			btnClass: 'btn--primary', 
			btnText: 'Bevestigen', 
			onClick: turn.handleConfirm
		});
		
		const finishButton = createButton({ 
			btnId: 'finish-button', 
			btnClass: 'btn--primary', 
			btnText: 'Opslaan', 
			onClick: turn.handleFinish
		});
		
		const editButton = createButton({ 
			btnId: 'edit-button', 
			btnClass: 'btn--primary', 
			btnText: 'Bewerken', 
			onClick: this.handleEdit.bind(this)
		});
		
		const nextButton = createButton({ 
			btnId: 'next-button', 
			btnClass: 'btn--navigation', 
			btnText: 'Volgende →', 
			onClick: turn.handleNext
		});
		
		const backButton = createButton({ 
			btnId: 'back-button', 
			btnClass: 'btn--navigation', 
			btnText: '← Vorige', 
			onClick: turn.handleBack
		});
		
		const cancelButton = createButton({ 
			btnId: 'cancel-button', 
			btnClass: 'btn--navigation', 
			btnText: '↑ Annuleren', 
			onClick: turn.handleCancel
		});
		
		const actionDiv = document.createElement('div');
		actionDiv.classList.add('mt-lg');
		actionDiv.append(
			confirmButton, 
			finishButton, 
			editButton
		);
		
		const navigationDiv = document.createElement('div');
		navigationDiv.classList.add('stack');
		navigationDiv.append(
			nextButton,
			backButton,
			cancelButton
		);
		
		const containerDiv = document.getElementById('container-div');
		containerDiv.append(
			actionDiv,
			document.createElement('hr'),
			navigationDiv
		);
		
		// Edit warning modal
		const editWarningDiv = document.createElement('div');
		editWarningDiv.id = 'edit-warning-div';
		editWarningDiv.classList.add('modal', 'fade');
		editWarningDiv.tabIndex = -1;
		editWarningDiv.setAttribute('role', 'dialog');
		editWarningDiv.setAttribute('aria-hidden', 'true');

		const dialogDiv = document.createElement('div');
		dialogDiv.classList.add('modal-dialog');
		dialogDiv.setAttribute('role', 'document');

		const contentDiv = document.createElement('div');
		contentDiv.classList.add('modal-content');

		const headerDiv = document.createElement('div');
		headerDiv.classList.add('modal-header');
		
		const title = document.createElement('h2');
		title.classList.add('modal-title');
		title.textContent = 'Werknemers ontslaan';
		
		const closeButton = createButton({ btnClass: 'btn-close' });
		closeButton.setAttribute('data-bs-dismiss', 'modal');
		closeButton.setAttribute('aria-label', 'Sluiten');

		const bodyDiv = document.createElement('div');
		bodyDiv.classList.add('modal-body', 'modal-body--warning');
		
		const iconDiv = document.createElement('div');
		iconDiv.classList.add('modal-icon');
		iconDiv.textContent = '⚠️';
		
		const message = document.createElement('p');
		message.classList.add('modal-message');
		message.textContent = 'Alle volgende acties worden gewist, als u deze actie bewerkt.';

		const footerDiv = document.createElement('div');
		footerDiv.classList.add('modal-footer');
		
		const cancelEditButton = createButton({ 
			btnClass: 'btn--modal-cancel', 
			btnText: 'Annuleren'
		});
		cancelEditButton.setAttribute('data-bs-dismiss', 'modal');

		const confirmEditButton = createButton({
			btnId: 'confirm-edit-button',
			btnClass: 'btn--modal-ok',
			btnText: 'Bewerken',
			type: 'button',
			onClick: this.handleConfirmEdit.bind(this)
		});

		headerDiv.append(title, closeButton);
		bodyDiv.append(iconDiv, message);
		footerDiv.append(cancelEditButton, confirmEditButton);
		contentDiv.append(headerDiv, bodyDiv, footerDiv);
		dialogDiv.appendChild(contentDiv);
		editWarningDiv.appendChild(dialogDiv);
		
		containerDiv.after(editWarningDiv);
		
		this.controls = {
			confirmButton,
			finishButton,
			editButton,
			confirmEditButton,
			nextButton,
			backButton,
			cancelButton,
			containerDiv,
			editWarningDiv
		};
	},
//-----------------------------------------------------------------------------------------------//
	show() {
		const c = this.controls;
		
		const isFirstPhase = (this.index === 0);
		const isLastPhase = (this.index === turn.phases.length - 1);
		const isCurrentPhase = (this.index === turn.currentPhaseIndex);
		
		c.confirmButton.classList.toggle('d-none', !isCurrentPhase);
		c.finishButton.classList.toggle('d-none', !isLastPhase);
		c.editButton.classList.toggle('d-none', isCurrentPhase);
		c.nextButton.classList.toggle('d-none', isCurrentPhase);
		c.backButton.classList.toggle('d-none', isFirstPhase);
		
		this.disabled = !isCurrentPhase;
		
		this.updateUI();
		c.containerDiv.classList.remove('d-none');
	},
//-----------------------------------------------------------------------------------------------//
	handleEdit() {
		const c = this.controls;
		
		const modal = new bootstrap.Modal(c.editWarningDiv);
		modal.show();
	},
//-----------------------------------------------------------------------------------------------//
	handleConfirmEdit() {
		const c = this.controls;
		
		const modal = bootstrap.Modal.getInstance(c.editWarningDiv);
		modal.hide();
		
		c.confirmButton.classList.remove('d-none');
		c.editButton.classList.add('d-none');
		c.nextButton.classList.add('d-none');
		
		for (let i = this.index + 1; i < turn.phases.length; i++) {
			const key = turn.phases[i].key;
			turn.storage.remove(`phases.${key}`);
		}
		
		turn.storage.save('currentPhaseIndex', this.index);
		turn.currentPhaseIndex = this.index;
		
		this.disabled = false;
		this.updateUI();
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
	}
//-----------------------------------------------------------------------------------------------//
} // turn.phase
//-----------------------------------------------------------------------------------------------//
turn.handleConfirm = function() {
	turn.phase.save();
	turn.storage.save('currentPhaseIndex', turn.phase.index + 1);
	
	turn.handleNext();
}
//-----------------------------------------------------------------------------------------------//
turn.handleNext = function() {
	location.assign(turn.phases[turn.phase.index + 1].url);
}
//-----------------------------------------------------------------------------------------------//
turn.handleBack = async function() {
	if (turn.phase.cleanup) {
		await turn.phase.cleanup();
	}
	
	location.assign(turn.phases[turn.phase.index - 1].url);
}
//-----------------------------------------------------------------------------------------------//
turn.handleFinish = function() {
	turn.phase.save();
	turn.storage.save('currentPhaseIndex', turn.phases.length);
	
	location.assign('/game/turn/finish');
}
//-----------------------------------------------------------------------------------------------//
turn.handleCancel = async function() {
	if (turn.phase.cleanup) {
		await turn.phase.cleanup();
	}
	
	turn.storage.removeAll();
	
	location.assign('/game');
}

//===============================================================================================//

export { turn };