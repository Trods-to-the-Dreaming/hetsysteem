//=== Main ======================================================================================//

export class BadRequestError extends Error {
	constructor(message, redirect = '/') {
		super(message);
		this.name = 'BadRequestError';
		this.status = 400;
		this.expose = true;
		this.redirect = redirect;
	}
}
//-----------------------------------------------------------------------------------------------//
export class UnauthorizedError extends Error {
	constructor(message, redirect = '/') {
		super(message);
		this.name = 'UnauthorizedError';
		this.status = 401;
		this.expose = true;
		this.redirect = redirect;
	}
}
//-----------------------------------------------------------------------------------------------//
export class ForbiddenError extends Error {
	constructor(message, redirect = '/') {
		super(message);
		this.name = 'ForbiddenError';
		this.status = 403;
		this.expose = true;
		this.redirect = redirect;
	}
}
//-----------------------------------------------------------------------------------------------//
export class NotFoundError extends Error {
	constructor(message, redirect = '/') {
		super(message);
		this.name = 'NotFoundError';
		this.status = 404;
		this.expose = true;
		this.redirect = redirect;
	}
}
//-----------------------------------------------------------------------------------------------//
export class ConflictError extends Error {
	constructor(message, info = {}) {
		super(message);
		this.name = 'ConflictError';
		this.status = 409;
		this.expose = true;
		this.info = info;
	}
}