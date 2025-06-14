export class BadRequestError extends Error {
	constructor(message) {
		super(message);
		this.name = "BadRequestError";
		this.statusCode = 400;
		this.expose = true;
	}
}

export class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.name = "UnauthorizedError";
		this.statusCode = 401;
		this.expose = true;
	}
}

export class ForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.name = "ForbiddenError";
		this.statusCode = 403;
		this.expose = true;
	}
}

export class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
		this.statusCode = 404;
		this.expose = true;
	}
}