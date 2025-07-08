//=== Imports ===================================================================================//
import { 
	getCharacter
} from "../helpers/game-character.helpers.js";

//=== Main ======================================================================================//

//--- Show character page -----------------------------------------------------------------------//
export const showCharacter = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const character = await getCharacter(characterId);
		
		return res.render("game/character", { 
			character
		});
	} catch (err) {
		next(err);
	}
};