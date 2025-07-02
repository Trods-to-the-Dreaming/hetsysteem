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
	const productId = 1;
	
	const buyers = [
		{ character_id: 1,
		  demand: 3,
		  max_unit_price: 40 },
		{ character_id: 2,
		  demand: 5,
		  max_unit_price: 85 },
		{ character_id: 3,
		  demand: 2,
		  max_unit_price: 90 }];
	const sellers = [
		{ character_id: 4,
		  supply: 4,
		  min_unit_price: 60 },
		{ character_id: 5,
		  supply: 2,
		  min_unit_price: 75 },
		{ character_id: 6,
		  supply: 4,
		  min_unit_price: 90 }];
	
	// Reduce the demand of buyers with insufficient money
	
	
	
	// In a chart with quantity on the horizontal axis and
	// unit price on the vertical axis, buyers and sellers 
	// represent the demand curve and the supply curve.
	// Both curves look like ascending stairs. Each buyer 
	// or seller is a step of the stairs. The width of the 
	// step is given by the quantity. The height of the
	// step is given by the unit price.
	
	// We want to maximize the trade volume. That is
	// accomplished by sliding the demand curve over the 
	// supply curve until they collide.
	
	// When the demand curve and the supply curve collide 
	// the overlap would be the same as when the demand 
	// curve were a step-curve. The step-curve has the 
	// height of the real demand curve at the point of 
	// contact for a demand from zero up to the point of 
	// contact, and an infinite height for the real demand
	// after the point of contact.
	
	// The maximum trade volume can be therefore be 
	// determined by considering a step-curve for each 
	// jump in the real demand curve. The minimum of 
	// all overlaps is the maximum overlap for the real
	// demand curve and the real supply curve.
	let tradeVolume = Number.POSITIVE_INFINITY;
	let higherDemand = 0;
	for (let b = buyers.length - 1; b >=0 ; b--) {
		const buyer = buyers[b];
		
		// Calculate the supply up to the buyer's unit price
		let lowerSupply = 0;
		for (let s = 0; s < sellers.length; s++) {
			const seller = sellers[s];
			if (seller.min_unit_price <= buyer.max_unit_price)
				lowerSupply += seller.supply;
			else
				break;
		}
		
		// Calculate the new trade volume
		const newTradeVolume = higherDemand + lowerSupply;
		if (newTradeVolume < tradeVolume)
			tradeVolume = newTradeVolume;
		
		// Calculate the demand higher than the buyer's unit price
		higherDemand += buyer.demand;
	}
	
	// Now that we know the trade volume and the buyers and 
	// sellers involved, we can create the transactions.
	let transactions = [];
	if (Number.isFinite(tradeVolume)) {
		// Remove excess supply
		let sumSupply = 0;
		let sLast = 0;
		while (sumSupply < tradeVolume &&
			   sLast < sellers.length) {
			sumSupply += sellers[sLast].supply;
			sLast++;
		}
		sLast--;
		if (sLast >= 0) {
			sellers[sLast].supply -= sumSupply - tradeVolume;
		}
		for (let s = sLast + 1; s < sellers.length; s++) {
			sellers.pop();
		}
		
		// Remove excess demand
		let sumDemand = 0;
		let bFirst = buyers.length - 1;
		while (sumDemand < tradeVolume &&
			   bFirst >= 0) {
			sumDemand += buyers[bFirst].demand;
			bFirst--;
		}
		bFirst++;
		if (bFirst < buyers.length) {
			buyers[bFirst].demand -= sumDemand - tradeVolume;
		}
		for (let b = bFirst - 1; b >= 0; b--) {
			buyers.shift();
		}
		
		// Create transactions
		let s = 0;
		let b = 0;
		while (tradeVolume > 0) {
			const buyer = buyers[b];
			const seller = sellers[s];
			
			const quantity = Math.min(buyer.demand, seller.supply);
			const preliminaryUnitPrice = (seller.min_unit_price + buyer.max_unit_price) / 2;
			const price = Math.round(quantity * preliminaryUnitPrice);
			const unitPrice = price / quantity;
			
			transactions.push({
				buyerId: buyer.character_id,
				sellerId: seller.character_id,
				itemId: productId,
				quantity,
				unitPrice,
				price
			});
			
			buyer.demand -= quantity;
			seller.supply -= quantity;
			tradeVolume -= quantity;
			
			if (buyer.demand === 0) b++;
			if (seller.supply === 0) s++;
		}
	}
	
	const headers = Object.keys(transactions[0]);
	const headerRow = headers.map(h => `<th>${h}</th>`).join("");
	const rows = transactions.map(row =>
		"<tr>" + headers.map(h => `<td>${row[h]}</td>`).join("") + "</tr>"
	).join("");
	
	const html = `
		<html>
		<body>
		<h1>Overzicht</h1>
		<table border="1">
			<thead><tr>${headerRow}</tr></thead>
			<tbody>${rows}</tbody>
		  </table>
		 </body>
		</html>`;
	
	res.send(html);
}

/*export const test = async (req, res, next) => {
	try {	
		const productId = 1;
		
		// Get sellers in ascending unit price order
		const [sellers] = await db.execute(
			`SELECT character_id, 
					quantity, 
					min_unit_price 
			 FROM product_sell_orders 
			 WHERE product_id = ?
			 ORDER BY min_unit_price ASC`,
			[productId]
		);
		
		// Get buyers in ascending unit price order
		const [buyers] = await db.execute(
			`SELECT character_id, 
					quantity, 
					max_unit_price 
			 FROM product_buy_orders 
			 WHERE product_id = ?
			 ORDER BY max_unit_price ASC`,
			[productId]
		);
		
		// Calculate supply curve shift
		let shift = 0;
		let noMatchInterval = 0;
		let buyerQuantityBackup = null;
		let sellerQuantityBackup = null;
		let b = 0;
		let s = 0;
		while (b < buyers.length && 
			   s < sellers.length) {
			const buyer = buyers[b];
			const seller = sellers[s];
			
			if (buyerQuantityBackup === null) buyerQuantityBackup = buyer.quantity;
			if (sellerQuantityBackup === null) sellerQuantityBackup = seller.quantity;
			
			const quantity = Math.min(buyer.quantity, seller.quantity);
			
			if (buyer.max_unit_price < seller.min_unit_price) {
				noMatchInterval += quantity;
			} else {
				shift = Math.max(shift, noMatchInterval);
				noMatchInterval = 0;
			}
			
			buyer.quantity -= quantity;
			seller.quantity -= quantity;
			
			if (buyer.quantity === 0) {
				buyer.quantity = buyerQuantityBackup;
				buyerQuantityBackup = null;
				b++;
			}
			if (seller.quantity === 0) {
				seller.quantity = sellerQuantityBackup;
				sellerQuantityBackup = null;
				s++;
			}
		}
		
		
		
		
		
		
		
		// Calculate demand and supply
		const demand = buyers.reduce((sum, o) => sum + o.quantity, 0); 
		const supply = sellers.reduce((sum, o) => sum + o.quantity, 0);
		
		// Calculate supply curve shift
		let shift = 0;
		let interval = 0;
		let b = 0;
		let s = 0;
		const qMax = Math.min(supply, demand);
		let q = 0;
		while (q <= qMax) {
			const buyer = buyers[b];
			const seller = sellers[s];
			
			const quantity = Math.min(buyer.quantity, seller.quantity);
			
			
			
			if (buyer.max_unit_price < seller.min_unit_price) {
				interval += quantity;
			} else {
				shift = Math.max(shift, interval);
				interval = 0;
			}
			
			if (buyer.quantity === quantity) b++;
			if (seller.quantity === quantity) s++;
			
			q += quantity;
		}
		
		
		
		
		
		
		
		// Remove sellers higher than highest buyer
		if (buyers.length > 0) {
			const highestMaxUnitPrice = buyers[0].max_unit_price;
			while (sellers.length > 0 &&
				   sellers[sellers.length - 1].min_unit_price > highestMaxUnitPrice) {
				sellers.pop();
			}
		}
		
		// Remove buyers lower than lowest seller
		if (sellers.length > 0) {
			const lowestMinUnitPrice = sellers[0].min_unit_price;
			while (buyers.length > 0 &&
				   buyers[buyers.length - 1].max_unit_price < lowestMinUnitPrice) {
				buyers.pop();
			}
		}
		
		// Calculate supply and demand
		const supply = sellers.reduce((sum, o) => sum + o.quantity, 0);
		const demand = buyers.reduce((sum, o) => sum + o.quantity, 0);

		// Remove excess supply or demand
		let removedBuyers = [];
		let partialBuyer = {};
		if (supply > demand) {
			let excessSupply = supply - demand;
			while (excessSupply > 0 && 
				   sellers.length > 0) {
				const lastSeller = sellers[sellers.length - 1];
				if (excessSupply < last.quantity) {
					lastSeller.quantity -= excessSupply;
					excessSupply = 0;
				}
				else {
					excessSupply -= lastSeller.quantity;
					sellers.pop();
				}
			}
		} else if (supply < demand) {
			let excessDemand = demand - supply;
			while (excessDemand > 0 && 
				   buyers.length > 0) {
				const lastBuyer = buyers[buyers.length - 1];
				if (excessDemand < lastBuyer.quantity) {
					Object.assign(partialBuyer, lastBuyer);
					partialBuyer.quantity = excessDemand;
					lastBuyer.quantity -= excessDemand;
					excessDemand = 0;
				}
				else {
					excessDemand -= lastBuyer.quantity;
					removedBuyers.push(buyers.pop());
				}
			}
		}
		
		// Start with highest seller and highest buyer
		let s = sellers.length - 1;
		let b = 0;
		let sellerQuantityBackup = null;
		let buyerQuantityBackup = null;
		while (s >= 0 && 
			   b <= buyers.length - 1) {
			const seller = sellers[s];
			const buyer = buyers[b];
			
			if (sellerQuantityBackup === null) sellerQuantityBackup = seller.quantity;
			if (buyerQuantityBackup === null) buyerQuantityBackup = buyer.quantity;
			
			if (buyer.max_unit_price >= seller.min_unit_price) {
				const quantity = Math.min(seller.quantity, buyer.quantity);
				const unitPrice = Math.round((seller.min_unit_price + buyer.max_unit_price) / 2);
				const price = quantity * unitPrice;
				
				if (price <= buyer.balance) { // future: also check if buyer has enough storage capacity?
					// Add transaction
					transactions.push({
						buyerId: buyer.character_id,
						sellerId: seller.character_id,
						itemId: productId,
						quantity,
						price // future: add unit price for statistics?
					});
					
					// Update quantities
					seller.quantity -= quantity;
					if (seller.quantity === 0) {
						seller.quantity = sellerQuantityBackup;
						sellerQuantityBackup = null;
						s--;
					}
					buyer.quantity -= quantity;
					if (buyer.quantity === 0) {
						buyer.quantity = buyerQuantityBackup;
						buyerQuantityBackup = null;
						b++;
					}
				} else {
					// The buyer cannot pay for his order
					// --> Exclude the buyer from the matching algorithm
					
				}
			} else {
				// The seller asks more than the buyer is willing to pay
				// --> Shift the 
			}
		}
		
		
		
		for (let s = sellOrders.length - 1; s >= 0; s--) {
		
			// Start with highest buy order
			for (let b = 0; b < buyOrders.length; b++) {
			}
		}
		
		// Check if buy orders completely match sell orders
		
		// Loop until complete match
			// If no complete match because a buyer can't afford it
			// --> remove buyer and add highest popped buyer(s) (from excess demand) for the same quantity
			// --> try again
		
			// If no complete match because of unit prices
			// --> n = quantity that can't be sold from the seller where the match broke
			// --> remove n quantities from highest sellOrders and from lowest buyOrders
			// --> try again
		
		
		
		
		
		// Create backup of buy orders
		const buyOrdersBackup = JSON.parse(JSON.stringify(buyOrders));
		
		
		
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
};*/