import { z } from 'zod';

//===============================================================================================//

const MIN_FIRST_NAME_LENGTH = 3;
const MAX_FIRST_NAME_LENGTH = 20;

const MIN_LAST_NAME_LENGTH = 3;
const MAX_LAST_NAME_LENGTH = 20;

const MIN_BUILDING_NAME_LENGTH = 3;
const MAX_BUILDING_NAME_LENGTH = 20;

const NAME_REGEX = /^\p{L}+(?:[ '-]\p{L}+)*$/u;

//===============================================================================================//

function uniqueArray({ schema, 
					   key = null,
					   length = null }) {
	let arraySchema = z.array(schema);
	if (length !== null) {
		arraySchema = arraySchema.length(length);
	}
	
	return arraySchema.superRefine((items, ctx) => {
		const seen = new Set();

		items.forEach((item, index) => {
			const value = key ? item[key] : item;

			if (seen.has(value)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: key ? [index, key] : [index]
				});
			}

			seen.add(value);
		});
	});
}

//===============================================================================================//

const demolishActionSchema = z.strictObject({
	characterBuildingId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const constructActionSchema = z.strictObject({
	characterBuildingId: z.coerce.number().int().positive(),
	buildingId: z.coerce.number().int().positive(),
	size: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const applySchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const recruitSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const acquireProjectsSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const rentSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const rentOutSchema = z.strictObject({
});

//===============================================================================================//

const manageBuildingsSchema = z.strictObject({
	demolishActions: uniqueArray({ 
			schema: demolishActionSchema, 
			key: 'characterBuildingId'
		}),
	constructActions: uniqueArray({ 
			schema: constructActionSchema, 
			key: 'characterBuildingId'
		})
});
//-----------------------------------------------------------------------------------------------//
const manageEmploymentContractsSchema = z.strictObject({
	resign: uniqueArray({ schema: z.coerce.number().int().positive() }),
	apply: z.array(applySchema),
	dismiss: uniqueArray({ schema: z.coerce.number().int().positive() }),
	recruit: z.array(recruitSchema),
	acquireProjects: z.array(acquireProjectsSchema)
});
//-----------------------------------------------------------------------------------------------//
const manageRentalAgreementsSchema = z.strictObject({
	rent: rentSchema,
	rentOut: uniqueArray({ 
			schema: rentOutSchema, 
			key: 'residenceId'
		})
});
//-----------------------------------------------------------------------------------------------//
const produceSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const tradeSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const shareSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const consumeSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
const manageGroupSchema = z.strictObject({
});

//===============================================================================================//

const firstNameSchema = z
	.string()
	.min(MIN_FIRST_NAME_LENGTH)
	.max(MAX_FIRST_NAME_LENGTH)
	.regex(NAME_REGEX)
	.refine((fn) => fn === fn.trim());
//-----------------------------------------------------------------------------------------------//
const lastNameSchema = z
	.string()
	.min(MIN_LAST_NAME_LENGTH)
	.max(MAX_LAST_NAME_LENGTH)
	.regex(NAME_REGEX)
	.refine((ln) => ln === ln.trim());
//-----------------------------------------------------------------------------------------------//
const buildingNameSchema = z
	.string()
	.min(MIN_BUILDING_NAME_LENGTH)
	.max(MAX_BUILDING_NAME_LENGTH)
	.regex(NAME_REGEX)
	.refine((bn) => bn === bn.trim());
//-----------------------------------------------------------------------------------------------//
const phasesSchema = z.strictObject({
	manageBuildings: manageBuildingsSchema.optional().default(undefined),
	manageEmploymentContracts: manageEmploymentContractsSchema.optional().default(undefined),
	manageRentalAgreements: manageRentalAgreementsSchema.optional().default(undefined),
	produce: produceSchema.optional().default(undefined),
	trade: tradeSchema.optional().default(undefined),
	share: shareSchema.optional().default(undefined),
	consume: consumeSchema.optional().default(undefined),
	manageGroup: manageGroupSchema.optional().default(undefined)
});

//===============================================================================================//

export const enterWorldSchema = z.strictObject({
	worldId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
export const createCharacterSchema = z.strictObject({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	jobPreferenceIds: uniqueArray({
			schema: z.coerce.number().int().positive(),
			length: 3
		}),
	recreationPreferenceId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
export const reserveBuildingNameSchema = z.strictObject({
	characterBuildingName: buildingNameSchema
});
//-----------------------------------------------------------------------------------------------//
export const cancelBuildingNameSchema = z.strictObject({
	characterBuildingId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
export const finishTurnSchema = z.strictObject({
	phases: phasesSchema
});