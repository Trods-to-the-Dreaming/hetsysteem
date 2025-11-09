import { turn } from '/js/turn-submit.js';

//=== Page (begin) ==============================================================================//
turn.page = {
	
//--- Check access ------------------------------------------------------------------------------//
checkAccess() {
	turn.begin = localStorage.getItem('turn.begin');
	
	// Check if the turn has begun
	if (turn.begin === null) {
		location.replace('/game/turn/begin');
		return;
	}
	
	turn.actionPages = JSON.parse(localStorage.getItem('turn.actionPages'));
	turn.currentPageIndex = parseInt(localStorage.getItem('turn.currentPageIndex'), 10);
	
	// Check if this page is allowed
	if (!turn.actionPages[turn.page.index].isRelevant ||
		turn.page.index > turn.currentPageIndex) {
		location.replace(turn.actionPages[turn.currentPageIndex].url);
		return;
	}
	
	turn.firstRelevantPageIndex = parseInt(localStorage.getItem('turn.firstRelevantPageIndex'), 10);
	turn.lastRelevantPageIndex = parseInt(localStorage.getItem('turn.lastRelevantPageIndex'), 10);
},

//--- Initialize --------------------------------------------------------------------------------//
initialize() {
	this.extendUI();
	this.bindEvents();
	this.loadAction();
	this.showUI();
},

//--- Extend UI ---------------------------------------------------------------------------------//
extendUI() {
	const UI = this.getUI();
	
	const buttons = `
		<button id="finish-button" class="button-1" type="button">Voltooien</button>
		<button id="next-button" class="button-1" type="button">Volgende →</button>
		<button id="back-button" class="button-1" type="button">← Vorige</button>
		<button id="edit-button" class="button-1" type="button">Bewerken</button>
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
	UI.containerDiv.insertAdjacentHTML('afterend', editModal);
},

//--- Bind events -------------------------------------------------------------------------------//
bindEvents() {
	const UI = this.getUI();
	
	UI.editButton.addEventListener('click', this.edit.bind(this));
	UI.confirmEditButton.addEventListener('click', this.confirmEdit.bind(this));
	UI.finishButton.addEventListener('click', turn.finish);
	UI.nextButton.addEventListener('click', turn.navigateNext);
	UI.backButton.addEventListener('click', turn.navigatePrevious);
	UI.cancelButton.addEventListener('click', turn.cancel);
},

//--- Show UI -----------------------------------------------------------------------------------//
showUI() {
	const UI = this.getUI();
	
	const isFirstRelevantPage = (this.index === turn.firstRelevantPageIndex);
	const isLastRelevantPage = (this.index === turn.lastRelevantPageIndex);
	const isCurrentPage = (this.index === turn.currentPageIndex);
	
	if (isFirstRelevantPage) {
		UI.backButton.classList.add('d-none');
	}
	
	if (isLastRelevantPage) {
		UI.nextButton.classList.add('d-none');
	} else {
		UI.finishButton.classList.add('d-none');
	}
	
	if (isCurrentPage) {
		UI.editButton.classList.add('d-none');
	} else {
		UI.formElements.forEach(el => el.disabled = true);
	}
	
	UI.containerDiv.classList.remove('d-none');
},

//--- Get UI ------------------------------------------------------------------------------------//
getUI() {
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
},

//--- Validate ----------------------------------------------------------------------------------//
validate() {
	const UI = this.getUI();
	const allValid = UI.formElements.every(el => el.checkValidity());
	
	UI.nextButton.disabled = !allValid;
	UI.finishButton.disabled = !allValid;
},

//--- Edit --------------------------------------------------------------------------------------//
edit() {
	const UI = this.getUI();
	
	const modal = new bootstrap.Modal(UI.editWarningDiv);
	modal.show();
},

//--- Confirm edit ------------------------------------------------------------------------------//
confirmEdit() {
	const UI = this.getUI();
	
	const modal = bootstrap.Modal.getInstance(UI.editWarningDiv);
	modal.hide();
	
	UI.editButton.classList.add('d-none');
	UI.formElements.forEach(el => el.disabled = false);
	
	for (let i = this.index + 1; i <= turn.lastRelevantPageIndex; i++) {
		localStorage.removeItem(`turn.page${i}.action`);
	}
	localStorage.setItem('turn.currentPageIndex', this.index);
	
	turn.currentPageIndex = this.index;
},

//--- Load action -------------------------------------------------------------------------------//
loadAction() {
	this.action = JSON.parse(localStorage.getItem(`turn.page${this.index}.action`));
	this.initializeElements();
},

//--- Save action -------------------------------------------------------------------------------//
saveAction() {
	this.readElements();
	localStorage.setItem(`turn.page${this.index}.action`, JSON.stringify(this.action));
},

//--- Populate select ---------------------------------------------------------------------------//
populateSelect(select, 
			   table,
			   columnName) {
	select.innerHTML = "";
	
	const emptyOption = document.createElement('option');
	emptyOption.value = "";
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

//=== Page (end) ================================================================================//
};

//--- Navigate next -----------------------------------------------------------------------------//
turn.navigateNext = async function() {
	try {
		if (typeof turn.page.beforeNext === 'function') {
			const canNavigateNext = await turn.page.beforeNext();
			if (!canNavigateNext) {
				const UI = turn.page.getUI();
				UI.nextButton.disabled = true;
				UI.finishButton.disabled = true;
				return;
			}
		}
		
		let nextPageIndex = turn.page.index + 1;
		while (nextPageIndex <= turn.lastRelevantPageIndex &&
			   !turn.actionPages[nextPageIndex].isRelevant) {
			nextPageIndex++;
		}
		
		if (turn.page.index === turn.currentPageIndex) {
			turn.page.saveAction();
			localStorage.setItem('turn.currentPageIndex', nextPageIndex);
		}
		
		location.assign(turn.actionPages[nextPageIndex].url);
	} catch (err) {
		console.error('Fout bij navigateNext:', err);
	}
}

//--- Navigate previous -------------------------------------------------------------------------//
turn.navigatePrevious = function() {
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

//--- Finish ------------------------------------------------------------------------------------//
turn.finish = async function() {
	if (turn.page.index === turn.currentPageIndex) {
		turn.page.saveAction();
		localStorage.setItem('turn.currentPageIndex', turn.lastRelevantPageIndex + 1);
	}
	
	try {
        const res = await turn.submitActions();
        
        if (res.redirect) {
            location.assign(res.redirect);
            return;
        }

        location.assign('/game');
    } catch (err) {
        console.error('Fout bij submitActions:', err);
    }
}

//--- Cancel ------------------------------------------------------------------------------------//
turn.cancel = function() {
	// andere items ook wissen
	localStorage.removeItem('turn.begin');
	localStorage.removeItem('turn.actionPages');
	localStorage.removeItem('turn.firstRelevantPageIndex');
	localStorage.removeItem('turn.lastRelevantPageIndex');
	localStorage.removeItem('turn.currentPageIndex');
	
	location.assign('/game');
}

export { turn };