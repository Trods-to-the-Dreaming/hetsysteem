import { processActions } from 'service.js';

//===============================================================================================//

export async function triggerProcessActions(req, res) {
	await processActions();
	return res.sendStatus(204);
};