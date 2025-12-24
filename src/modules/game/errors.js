export class MissingWorldSessionError extends Error {
	constructor(message, redirect) {
		super(message);
		this.name = 'MissingWorldSessionError';
		this.status = 403;
		this.redirect = redirect;
	}
}