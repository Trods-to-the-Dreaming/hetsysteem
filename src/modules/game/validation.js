import { z } from 'zod';

//===============================================================================================//

export const enterWorldSchema = z.object({
	worldId: z.coerce.number().int().positive()
});

export const finishTurnSchema = z.object({
});