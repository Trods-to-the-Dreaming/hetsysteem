import { z } from 'zod';

//===============================================================================================//

const MIN_COOPERATIVE_NAME_LENGTH = 2;
const MAX_COOPERATIVE_NAME_LENGTH = 32;
const COOPERATIVE_NAME_REGEX = /^[\p{L}\p{N}]+(?:[ '\-.:?!&][\p{L}\p{N}]+)*$/u

//===============================================================================================//

const cooperativeNameSchema = z
	.string()
	.min(MIN_COOPERATIVE_NAME_LENGTH)
	.max(MAX_COOPERATIVE_NAME_LENGTH)
	.regex(COOPERATIVE_NAME_REGEX)
	.refine((ln) => ln === ln.trim());

//===============================================================================================//

export const manageCooperativeSchema = z.strictObject({
});
//-----------------------------------------------------------------------------------------------//
export const reserveCooperativeNameSchema = z.strictObject({
	cooperativeName: cooperativeNameSchema
});