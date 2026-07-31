import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { uniqueArray } from '#utils/validation.js'

//===============================================================================================//

const resignActionSchema = z.strictObject({
	employmentContractId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const applyActionSchema = z.strictObject({
	jobId: z.coerce.number().int().positive(),
	workingHours: z.coerce.number().int().positive(),
	minHourlyWage: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const dismissActionSchema = z.strictObject({
	employmentContractId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const recruitActionSchema = z.strictObject({
	companyId: z.coerce.number().int().positive(),
	workingHours: z.coerce.number().int().positive(),
	maxHourlyWage: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const closeActionSchema = z.strictObject({
	selfEmploymentContractId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const startActionSchema = z.strictObject({
	companyId: z.coerce.number().int().positive(),
	workingHours: z.coerce.number().int().positive()
});

//===============================================================================================//

export const manageEmploymentContractsSchema = z.strictObject({
	resignActions: uniqueArray({ 
			schema: resignActionSchema, 
			property: 'employmentContractId'
		}),
	applyActions: uniqueArray({ 
			schema: applyActionSchema, 
			property: 'jobId'
		}),
	dismissActions: uniqueArray({ 
			schema: dismissActionSchema, 
			property: 'employmentContractId'
		}),
	recruitActions: uniqueArray({ 
			schema: recruitActionSchema, 
			property: 'companyId'
		}),
	closeActions: uniqueArray({ 
			schema: closeActionSchema, 
			property: 'selfEmploymentContractId'
		}),
	startActions: uniqueArray({ 
			schema: startActionSchema, 
			property: 'companyId'
		})
});