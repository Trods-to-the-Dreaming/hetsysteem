import { z } from 'zod';

//===============================================================================================//

const MIN_FIRST_NAME_LENGTH = 3;
const MAX_FIRST_NAME_LENGTH = 20;
const FIRST_NAME_REGEX = /^\p{L}+(?:[ '-]\p{L}+)*$/u;

const MIN_LAST_NAME_LENGTH = 3;
const MAX_LAST_NAME_LENGTH = 20;
const LAST_NAME_REGEX = /^\p{L}+(?:[ '-]\p{L}+)*$/u;

//===============================================================================================//

const jobPreferenceSchema = z.strictObject({
	buildingId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const recreationPreferenceSchema = z.strictObject({
	productId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const firstNameSchema = z
	.string()
	.min(MIN_FIRST_NAME_LENGTH)
	.max(MAX_FIRST_NAME_LENGTH)
	.regex(FIRST_NAME_REGEX)
	.refine((fn) => fn === fn.trim());
//-----------------------------------------------------------------------------------------------//
const lastNameSchema = z
	.string()
	.min(MIN_LAST_NAME_LENGTH)
	.max(MAX_LAST_NAME_LENGTH)
	.regex(LAST_NAME_REGEX)
	.refine((ln) => ln === ln.trim());

//===============================================================================================//

export const createCharacterSchema = z.strictObject({
	jobPreferences: uniqueArray({ 
			schema: jobPreferenceSchema, 
			property: 'buildingId',
			length: 3
		}),
	recreationPreference: recreationPreferenceSchema
});
//-----------------------------------------------------------------------------------------------//
export const reserveCharacterNameSchema = z.strictObject({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
});