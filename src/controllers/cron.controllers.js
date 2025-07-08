//=== Imports ===================================================================================//
import {
	processCategoryOrders
} from "../helpers/cron.helpers.js";

//=== Constants =================================================================================//

//=== Main ======================================================================================//

//--- Process orders ----------------------------------------------------------------------------//
export const processOrders = async (req, res, next) => {
	try {
		await processCategoryOrders("product");
		await processCategoryOrders("building");
		
		const html = `<html>
					  <body>
					  <h1>Gelukt?</h1>
					  </body>
					  </html>`;
	
		res.send(html);
	} catch (err) {
		next(err);
	}
};