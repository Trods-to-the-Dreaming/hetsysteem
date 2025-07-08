//=== Main ======================================================================================//

//--- Show statistics page ----------------------------------------------------------------------//
export const showStatistics = async (req, res, next) => {
	try {
		return res.render("game/statistics");
	} catch (err) {
		next(err);
	}
};