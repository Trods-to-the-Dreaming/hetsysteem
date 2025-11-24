//=== Imports ===================================================================================//

import { turn } from '/js/turn.js';

//=== Main ======================================================================================//

turn.submitActions = async function() {
	const actionPages = JSON.parse(localStorage.getItem('turn.actionPages'));
	const characterActions = [];

	for (let index = 0; index < actionPages.length; index++) {
		const action = localStorage.getItem(`turn.page${index}.data`);
		characterActions.push(JSON.parse(action));
	}

	try {
		const res = await fetch('/game/turn/finish', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ characterActions })
		});
		return await res.json();
	} catch (err) {
		console.error('Netwerkfout bij submitActions:', err);
		throw err;
	}
};