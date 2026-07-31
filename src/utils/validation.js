import { z } from 'zod';

//===============================================================================================//

export function uniqueArray({ schema, 
							  property = null,
							  length = null }) {
	let arraySchema = z.array(schema);
	if (length !== null) {
		arraySchema = arraySchema.length(length);
	}
	
	return arraySchema.superRefine((items, ctx) => {
		const seen = new Set();

		items.forEach((item, index) => {
			const value = property ? item[property] : item;

			if (seen.has(value)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: property ? [index, property] : [index]
				});
			}

			seen.add(value);
		});
	});
}