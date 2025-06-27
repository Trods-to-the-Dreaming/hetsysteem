//--- Load dependencies ---//
import dotenv from "dotenv";
import path from "path";
import { pathToFileURL } from "url";

// --- Environmental variables ---//
dotenv.config({ path: path.join(process.cwd(), ".env")});

const { default: db } = await import("./src/utils/db.js");

async function processOrders() {
	const newQuantity = 5;
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
}

processOrders().catch(err => {
  console.error("Fout bij verwerken van orders:", err);
});