import db from "../utils/db.js";

/*export const processOrders = async (req, res, next) => {
	try {
		const logFile = path.join(process.cwd(), "logs", "cron.log");
		fs.appendFileSync(logFile, `${new Date().toISOString()} - processOrders gestart\n`);
	
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];
		fs.appendFileSync(logFile, `Token ontvangen: ${token}\n`);

		if (token !== process.env.CRON_TOKEN) {
			fs.appendFileSync(logFile, `Toegang geweigerd\n`);
			return res.status(403).send("Toegang geweigerd");
		}
		
		const newQuantity = 321;
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
		
		fs.appendFileSync(logFile, `Query uitgevoerd\n`);
		res.status(200).send("Cron job succesvol uitgevoerd");
	} catch (err) {
		const logFile = path.join(process.cwd(), "logs", "cron.log");
		fs.appendFileSync(logFile, `Fout: ${err.message}\n`);
		next(err);
	}
}*/

export const test = async (req, res, next) => {
	try {
		const fs = await import("fs/promises");
		const path = "./public/test-cron.txt"; // tijdelijk ok, maar zie opmerking hierboven
		const content = `${new Date().toISOString()} - Cron test uitgevoerd\n`;
		
		const newQuantity = 321;
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

		await fs.appendFile(path, content);
		res.send("Cron test uitgevoerd");
	} catch (err) {
		console.error("Fout bij cron test:", err);
		res.status(500).send("Fout bij cron test");
	}
};