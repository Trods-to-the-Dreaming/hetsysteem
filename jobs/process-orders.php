<?php
// URL naar je beveiligde cron-route
$url = 'https://www.hetsysteem.site/cron/process-orders'; //'http://localhost:3000/cron/process-orders'; //

$options = [
  'http' => [
    'method' => 'GET',
    'header' => "Authorization: Bearer 4321\r\n"
  ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
  http_response_code(500);
  echo "Cron job mislukt.";
} else {
  echo "Cron job succesvol uitgevoerd.";
}
?>



<!--//--- Load dependencies ---//
import dotenv from "dotenv";
import path from "path";
import { pathToFileURL } from "url";

// --- Environmental variables ---//
dotenv.config({ path: path.join(process.cwd(), ".env")});

async function processOrders() {
	const { default: db } = await import("../src/utils/db.js");
	
	const newQuantity = 3;
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	processOrders().catch(err => {
		console.error("Fout bij verwerken van orders:", err);
	});
}-->