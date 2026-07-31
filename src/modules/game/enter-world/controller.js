import { saveSession } from '#utils/session.js';
//-----------------------------------------------------------------------------------------------//
import { 
	prepareEnterWorldOptions,
	enterWorld
} from './service.js';

//===============================================================================================//

export async function showEnterWorld(req, res) {
	delete req.session.world;
	
	const enterWorldOptions = await prepareEnterWorldOptions();
	
	return res.render('game/enter-world', enterWorldOptions );
}
//-----------------------------------------------------------------------------------------------//
export async function handleEnterWorld(req, res) {
	const { user } = req.session;
	const formState = req.validatedData;
	
	const world = await enterWorld({ 
		userId: user.id,
		formState
	});
	
	req.session.world = { 
		id: world.id,
		slug: world.slug,
		name: world.name
	};
	await saveSession(req);
	
	return res.redirect('/game/world/menu');
}