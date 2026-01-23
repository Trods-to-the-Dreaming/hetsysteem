import { 
	ACCOUNT
} from './reasons.js';

//===============================================================================================//

export class AccountError extends Error {
	constructor({ status, code, meta = {} }) {
		super(ACCOUNT.MESSAGE[code]);
		this.name = 'AccountError';
		this.status = status;
		this.code = code;
		this.meta = meta;
	}
}