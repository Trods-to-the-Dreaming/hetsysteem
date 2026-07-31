import { z } from 'zod';

//===============================================================================================//

export const enterWorldSchema = z.strictObject({
	worldId: z.coerce.number().int().positive()
});