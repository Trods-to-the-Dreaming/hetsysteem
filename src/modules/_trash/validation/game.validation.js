//=== Imports ===================================================================================//

import { z } from 'zod';

//=== Main ======================================================================================//

export const enterWorldSchema = z.object({
	worldId: z.coerce.number().int().positive()
});