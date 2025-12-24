export class BadRequestError extends Error {
	constructor(message, redirect) {
		super(message);
		this.name = 'BadRequestError';
		this.status = 400;
		this.redirect = redirect;
	}
}
//-----------------------------------------------------------------------------------------------//
/*export class UnauthenticatedError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UnauthenticatedError';
		this.status = 401;
	}
}*/
//-----------------------------------------------------------------------------------------------//
export class ForbiddenError extends Error {
	constructor(message, redirect) {
		super(message);
		this.name = 'ForbiddenError';
		this.status = 403;
		this.redirect = redirect;
	}
}
//-----------------------------------------------------------------------------------------------//
export class ConflictError extends Error {
	constructor(message, redirect) {
		super(message);
		this.name = 'ConflictError';
		this.status = 409;
		this.redirect = redirect;
	}
}