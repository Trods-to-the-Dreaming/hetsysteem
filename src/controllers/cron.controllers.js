import db from "../utils/db.js";

export const processOrders = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];

		if (token !== process.env.CRON_TOKEN) {
			return res.status(403).send("Toegang geweigerd");
		}
		
		const newQuantity = 9;
		const characterId = 1;
		const productId = 4;
	  
		await db.execute(
			`UPDATE character_products 
			 SET quantity = ? 
			 WHERE character_id = ? AND
				   product_id = ?`,
			[newQuantity, 
			 characterId,
			 productId]
		);
		
		res.status(200).send("Cron job succesvol uitgevoerd");
	} catch (err) {
		next(err); 
	}
}