import { BadRequestError } from '#utils/errors.js';

//===============================================================================================//

export function validate(schema, redirect) {
	function validationMiddleware(req, res, next) {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			throw new BadRequestError(z.prettifyError(result.error), redirect);
		}
		req.validatedData = result.data;
		next();
	}
	return validationMiddleware;
}