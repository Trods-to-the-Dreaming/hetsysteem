import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { 
	firstNameSchema,
	lastNameSchema
} from '#modules/game/world/turn/create-character/validation.js'

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
export const getCooperativeSchema = z.strictObject({
	cooperativeName: cooperativeNameSchema
});
//-----------------------------------------------------------------------------------------------//
export const reserveCooperativeNameSchema = z.strictObject({
	cooperativeName: cooperativeNameSchema
});
//-----------------------------------------------------------------------------------------------//
export const getCharacterSchema = z.strictObject({
	firstName: firstNameSchema,
	lastName: lastNameSchema
});