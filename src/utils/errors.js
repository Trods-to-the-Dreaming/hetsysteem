//=== Main ======================================================================================//

//--- Bad request (400) -------------------------------------------------------------------------//
export class BadRequestError extends Error {
	constructor(message) {
		super(message);
		this.name = "BadRequestError";
		this.statusCode = 400;
		this.expose = true;
	}
}

//--- Unauthorized (401) ------------------------------------------------------------------------//
export class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.name = "UnauthorizedError";
		this.statusCode = 401;
		this.expose = true;
	}
}

//--- Forbidden (403) ---------------------------------------------------------------------------//
export class ForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.name = "ForbiddenError";
		this.statusCode = 403;
		this.expose = true;
	}
}

//--- Not found (404) ---------------------------------------------------------------------------//
export class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
		this.statusCode = 404;
		this.expose = true;
	}
}

//--- Conflict (409) ----------------------------------------------------------------------------//
export class ConflictError extends Error {
	constructor(message) {
		super(message);
		this.name = "ConflictError";
		this.statusCode = 409;
		this.expose = true;
	}
}