//=== Main ======================================================================================//

//--- Bad request (400) -------------------------------------------------------------------------//
export class BadRequestError extends Error {
	constructor(message, redirect = "/") {
		super(message);
		this.name = "BadRequestError";
		this.status = 400;
		this.expose = true;
		this.redirect = redirect;
	}
}

//--- Unauthorized (401) ------------------------------------------------------------------------//
export class UnauthorizedError extends Error {
	constructor(message, redirect = "/") {
		super(message);
		this.name = "UnauthorizedError";
		this.status = 401;
		this.expose = true;
		this.redirect = redirect;
	}
}

//--- Forbidden (403) ---------------------------------------------------------------------------//
export class ForbiddenError extends Error {
	constructor(message, redirect = "/") {
		super(message);
		this.name = "ForbiddenError";
		this.status = 403;
		this.expose = true;
		this.redirect = redirect;
	}
}

//--- Not found (404) ---------------------------------------------------------------------------//
export class NotFoundError extends Error {
	constructor(message, redirect = "/") {
		super(message);
		this.name = "NotFoundError";
		this.status = 404;
		this.expose = true;
		this.redirect = redirect;
	}
}

//--- Conflict (409) ----------------------------------------------------------------------------//
export class ConflictError extends Error {
	constructor(message, redirect = "/") {
		super(message);
		this.name = "ConflictError";
		this.status = 409;
		this.expose = true;
		this.redirect = redirect;
	}
}