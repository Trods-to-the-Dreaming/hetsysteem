import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { createCharacterSchema }		   from './create-character/validation.js'
import { manageBuildingsSchema }		   from './manage-buildings/validation.js'
import { manageEmploymentContractsSchema } from './manage-employment-contracts/validation.js'
import { manageRentalAgreementsSchema }    from './manage-rental-agreements/validation.js'
import { produceSchema }                   from './produce/validation.js'
import { tradeSchema }                     from './trade/validation.js'
import { shareSchema }                     from './share/validation.js'
import { manageTimeSchema }				   from './manage-time/validation.js'
import { consumeSchema }                   from './consume/validation.js'
import { manageCooperativeSchema }         from './manage-cooperative/validation.js'

//===============================================================================================//

const phasesSchema = z.strictObject({
	createCharacter: 		   createCharacterSchema.optional().default(undefined),
	manageBuildings: 		   manageBuildingsSchema.optional().default(undefined),
	manageEmploymentContracts: manageEmploymentContractsSchema.optional().default(undefined),
	manageRentalAgreements:    manageRentalAgreementsSchema.optional().default(undefined),
	produce: 				   produceSchema.optional().default(undefined),
	trade: 					   tradeSchema.optional().default(undefined),
	share: 					   shareSchema.optional().default(undefined),
	manageTime: 			   manageTimeSchema.optional().default(undefined),
	consume: 				   consumeSchema.optional().default(undefined),
	manageCooperative: 		   manageCooperativeSchema.optional().default(undefined)
});

//===============================================================================================//

export const startTurnSchema = z.strictObject({
	overrule: z.coerce.boolean()
});
//-----------------------------------------------------------------------------------------------//
export const finishTurnSchema = z.strictObject({
	characterPhases: phasesSchema
});
//-----------------------------------------------------------------------------------------------//
export const checkTurnVersionSchema = z.strictObject({
	turnVersion: z.coerce.number().int().positive()
});