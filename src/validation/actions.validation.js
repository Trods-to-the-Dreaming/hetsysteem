//=== Imports ===================================================================================//
import { z } from 'zod';

//=== Main ======================================================================================//

//--- Customize character schema ----------------------------------------------------------------//
export const customizeCharacterSchema = z.object({
	firstName: z.string().min(2).max(32),
	lastName: z.string().min(2).max(32),
	jobPreference1: z.coerce.number().int().positive(),
	jobPreference2: z.coerce.number().int().positive(),
	jobPreference3: z.coerce.number().int().positive(),
	recreationPreference: z.coerce.number().int().positive()
})/*.refine(data => {
	const jobs = [data.jobPreference1, data.jobPreference2, data.jobPreference3];
	return new Set(jobs).size === 3;
}, { message: "Jobvoorkeuren moeten verschillend zijn." })*/;
