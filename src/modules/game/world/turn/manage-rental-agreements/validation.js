import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { uniqueArray } from '#utils/validation.js'

//===============================================================================================//

const vacateActionSchema = z.strictObject({
	rentalAgreementId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const rentActionSchema = z.strictObject({
	capacity: z.coerce.number().int().positive(),
	maxDailyRent: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const evictActionSchema = z.strictObject({
	rentalAgreementId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const rentOutActionSchema = z.strictObject({
	capacity: z.coerce.number().int().positive(),
	minDailyRent: z.coerce.number().int().positive()
});

//===============================================================================================//

export const manageRentalAgreementsSchema = z.strictObject({
	vacateAction: vacateActionSchema,
	rentAction: rentActionSchema,
	evictActions: uniqueArray({ 
			schema: evictActionSchema, 
			property: 'rentalAgreementId'
		}),
	rentOutActions: uniqueArray({ 
			schema: rentOutActionSchema, 
			property: 'residenceId'
		})
});