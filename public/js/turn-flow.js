//=== Imports ===================================================================================//

import { turn } from '/js/turn.js';

//=== Main ======================================================================================//

turn.page = { // turn.page begin
//-----------------------------------------------------------------------------------------------//
...turn.page,
//-----------------------------------------------------------------------------------------------//
disabled: true,
//-----------------------------------------------------------------------------------------------//
initialize() {
	this.addTurnFlowControls();
	this.bindTurnFlowEvents();
	this.loadAction();
	this.show();
},
//-----------------------------------------------------------------------------------------------//
addTurnFlowControls() {
	const controls = this.getTurnFlowControls();
	const containerDiv = controls.containerDiv;
	
	const buttons = `
		<button id="finish-button" class="button-1" type="button">Voltooien</button>
		<button id="next-button" class="button-1" type="button">Volgende →</button>
		<button id="back-button" class="button-1" type="button">← Vorige</button>
		<button id="edit-button" class="button-1" type="button">Bewerken</button>
		<button id="cancel-button" class="button-up" type="button">↑ Annuleren</button>`;
	containerDiv.insertAdjacentHTML('beforeend', buttons);
	
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
						Alle volgende acties worden gewist, 
						wanneer u deze actie bewerkt.
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
	containerDiv.insertAdjacentHTML('afterend', editModal);
},
//-----------------------------------------------------------------------------------------------//
bindTurnFlowEvents() {
	const controls = this.getTurnFlowControls();
	
	controls.editButton.addEventListener('click', this.edit.bind(this));
	controls.confirmEditButton.addEventListener('click', this.confirmEdit.bind(this));
	controls.finishButton.addEventListener('click', turn.finish);
	controls.nextButton.addEventListener('click', turn.nextPage);
	controls.backButton.addEventListener('click', turn.previousPage);
	controls.cancelButton.addEventListener('click', turn.cancel);
},
//-----------------------------------------------------------------------------------------------//
show() {
	const controls = this.getTurnFlowControls();
	
	const isFirstRelevantPage = (this.index === turn.firstRelevantPageIndex);
	const isLastRelevantPage = (this.index === turn.lastRelevantPageIndex);
	const isCurrentPage = (this.index === turn.currentPageIndex);
	
	if (isFirstRelevantPage) {
		controls.backButton.classList.add('d-none');
	}
	
	if (isLastRelevantPage) {
		controls.nextButton.classList.add('d-none');
	} else {
		controls.finishButton.classList.add('d-none');
	}
	
	if (isCurrentPage) {
		controls.editButton.classList.add('d-none');
		this.disabled = false;
	}	
	
	this.updateUI();
	controls.containerDiv.classList.remove('d-none');	
},
//-----------------------------------------------------------------------------------------------//
getTurnFlowControls() {
	const containerDiv = document.getElementById('container-div');
	const nextButton = document.getElementById('next-button');
	const backButton = document.getElementById('back-button');
	const editButton = document.getElementById('edit-button');
	const finishButton = document.getElementById('finish-button');
	const cancelButton = document.getElementById('cancel-button');
	
	const editWarningDiv = document.getElementById('edit-warning-div');
	const confirmEditButton = document.getElementById('confirm-edit-button');
	
	return {
		containerDiv,
		nextButton,
		backButton,
		editButton,
		finishButton,
		cancelButton,
		editWarningDiv,
		confirmEditButton
	};
},
//-----------------------------------------------------------------------------------------------//
setNextDisabled(isDisabled) {
	const controls = this.getTurnFlowControls();
	
	controls.nextButton.disabled = isDisabled;
	controls.finishButton.disabled = isDisabled;
},
//-----------------------------------------------------------------------------------------------//
edit() {
	const controls = this.getTurnFlowControls();
	
	const modal = new bootstrap.Modal(controls.editWarningDiv);
	modal.show();
},
//-----------------------------------------------------------------------------------------------//
confirmEdit() {
	const controls = this.getTurnFlowControls();
	
	const modal = bootstrap.Modal.getInstance(controls.editWarningDiv);
	modal.hide();
	
	controls.editButton.classList.add('d-none');
	
	this.disabled = false;
	this.updateUI();
	
	for (let i = this.index + 1; i <= turn.lastRelevantPageIndex; i++) {
		localStorage.removeItem(`turn.page${i}.action`);
	}
	localStorage.setItem('turn.currentPageIndex', JSON.stringify(this.index));
	localStorage.setItem('turn.areActionsSubmitted', JSON.stringify(false));
	
	turn.currentPageIndex = this.index;
},
//-----------------------------------------------------------------------------------------------//
populateSelect(select, 
			   table,
			   columnName) {
	select.innerHTML = '';
	
	const emptyOption = document.createElement('option');
	emptyOption.value = '';
	emptyOption.disabled = true;
	emptyOption.selected = true;
	emptyOption.hidden = true;
	select.appendChild(emptyOption);

	table.forEach(row => {
		const option = document.createElement('option');
		option.value = row.id;
		option.textContent = row[columnName];
		select.appendChild(option);
	});
}
//-----------------------------------------------------------------------------------------------//
} // turn.page end
//-----------------------------------------------------------------------------------------------//
turn.nextPage = async function() {
	try {
		if (typeof turn.page.preventNext === 'function') {
			const prevent = await turn.page.preventNext();
			if (prevent) return;
		}
		
		let nextPageIndex = turn.page.index + 1;
		while (nextPageIndex <= turn.lastRelevantPageIndex &&
			   !turn.actionPages[nextPageIndex].isRelevant) {
			nextPageIndex++;
		}
		
		if (turn.page.index === turn.currentPageIndex) {
			turn.page.saveAction();
			localStorage.setItem('turn.currentPageIndex', JSON.stringify(nextPageIndex));
		}
		
		location.assign(turn.actionPages[nextPageIndex].url);
	} catch (err) {
		console.error('Fout bij nextPage:', err);
	}
}
//-----------------------------------------------------------------------------------------------//
turn.previousPage = function() {
	let previousPageIndex = turn.page.index - 1;
	
	while (previousPageIndex >= turn.firstRelevantPageIndex &&
		   !turn.actionPages[previousPageIndex].isRelevant) {
		previousPageIndex--;
	}
	
	if (turn.page.index === turn.currentPageIndex) {
		turn.page.saveAction();
	}
	
	location.assign(turn.actionPages[previousPageIndex].url);
}
//-----------------------------------------------------------------------------------------------//
turn.finish = async function() {
	if (turn.page.index === turn.currentPageIndex) {
		turn.page.saveAction();
		localStorage.setItem('turn.currentPageIndex', JSON.stringify(turn.lastRelevantPageIndex + 1));
	}
	
	const characterActions = [];

	for (let index = 0; index < turn.actionPages.length; index++) {
		const action = JSON.parse(localStorage.getItem(`turn.page${index}.action`));
		characterActions.push(action);
	}
	
	//console.log('characterActions:', JSON.stringify(characterActions, null, 2));
	
	try {
        const res = await fetch('/game/turn/finish', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ characterActions })
		});
		
		const json = await res.json();
		if (json.redirect) {
			location.assign(json.redirect);
			return;
		} else {
			location.assign('/game');
		}
    } catch (err) {
        console.error('Fout bij finish:', err);
    }
}
//-----------------------------------------------------------------------------------------------//
turn.cancel = function() {
	// andere items ook wissen
	localStorage.removeItem('turn.begin');
	localStorage.removeItem('turn.actionPages');
	localStorage.removeItem('turn.firstRelevantPageIndex');
	localStorage.removeItem('turn.lastRelevantPageIndex');
	localStorage.removeItem('turn.currentPageIndex');
	
	location.assign('/game');
}
//-----------------------------------------------------------------------------------------------//
export { turn };