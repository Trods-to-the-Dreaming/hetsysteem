//=== Imports ===================================================================================//
import { z } from 'zod';

//=== Main ======================================================================================//

const regex = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+)*$/;

//--- Customize character schema ----------------------------------------------------------------//
export const customizeCharacterSchema = z.object({
	firstName: z.string().min(2).max(32).regex(regex),
	lastName: z.string().min(2).max(32).regex(regex),
	jobPreference1: z.coerce.number().int().positive(),
	jobPreference2: z.coerce.number().int().positive(),
	jobPreference3: z.coerce.number().int().positive(),
	recreationPreference: z.coerce.number().int().positive()
});

const constructSchema = z.object({
	buildingId: z.coerce.number().int().positive(),
	name: z.string().min(2).max(32),
	sizeFactor: z.coerce.number().int().refine(
					(val) => [1, 2, 4].includes(val),
					{ message: 'Invalid input: expected 1, 2 or 4' }
				)
});

export const manageBuildingsSchema = z.object({
	demolish: z.array(z.coerce.number().int().positive()).default([]),
	construct: z.array(constructSchema).default([])
})