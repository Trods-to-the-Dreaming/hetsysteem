import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { 
	BadRequestError
} from '#utils/errors.js';

//===============================================================================================//

export function validate(schema) {
	function requireValidation(req, res, next) {
		const result = schema.safeParse(req.body);
		if (result.success) {
			req.validatedData = result.data;
			return next();
		}
		throw new BadRequestError(z.prettifyError(result.error));
	}
	return requireValidation;
}