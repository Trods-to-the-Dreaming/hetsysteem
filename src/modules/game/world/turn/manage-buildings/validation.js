import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { uniqueArray } from '#utils/validation.js'

//===============================================================================================//

const MIN_BUILDING_NAME_LENGTH = 2;
const MAX_BUILDING_NAME_LENGTH = 32;
const BUILDING_NAME_REGEX = /^[\p{L}\p{N}]+(?:[ '\-.:?!&][\p{L}\p{N}]+)*$/u

//===============================================================================================//

const demolishActionSchema = z.strictObject({
	characterBuildingId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const constructActionSchema = z.strictObject({
	characterBuildingId: z.coerce.number().int().positive(),
	buildingId: z.coerce.number().int().positive()
});
//-----------------------------------------------------------------------------------------------//
const buildingNameSchema = z
	.string()
	.min(MIN_BUILDING_NAME_LENGTH)
	.max(MAX_BUILDING_NAME_LENGTH)
	.regex(BUILDING_NAME_REGEX)
	.refine((bn) => bn === bn.trim());

//===============================================================================================//

export const manageBuildingsSchema = z.strictObject({
	demolishActions: uniqueArray({ 
			schema: demolishActionSchema, 
			property: 'characterBuildingId'
		}),
	constructActions: uniqueArray({ 
			schema: constructActionSchema, 
			property: 'characterBuildingId'
		})
});
//-----------------------------------------------------------------------------------------------//
export const reserveBuildingNameSchema = z.strictObject({
	characterBuildingName: buildingNameSchema
});
//-----------------------------------------------------------------------------------------------//
export const cancelBuildingNameSchema = z.strictObject({
	characterBuildingId: z.coerce.number().int().positive()
});