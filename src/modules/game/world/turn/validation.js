import { z } from 'zod';
//-----------------------------------------------------------------------------------------------//
import { BadRequestError } from '#utils/errors.js';
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

export const birthTurnSchema = z.strictObject({
	createCharacter:   createCharacterSchema,
	manageCooperative: manageCooperativeSchema
});
//-----------------------------------------------------------------------------------------------//
export const normalTurnSchema = z.strictObject({
	manageBuildings: 		   manageBuildingsSchema,
	manageEmploymentContracts: manageEmploymentContractsSchema,
	manageRentalAgreements:    manageRentalAgreementsSchema,
	produce: 				   produceSchema,
	trade:					   tradeSchema,
	share:					   shareSchema,
	manageTime: 			   manageTimeSchema,
	consume: 				   consumeSchema,
	manageCooperative: 		   manageCooperativeSchema
});

//===============================================================================================//

export function validateActions({ turnSchema,
								  actions }) {
	const result = turnSchema.safeParse(actions);
			
	if (!result.success) 
		throw new BadRequestError(z.prettifyError(result.error));
	
	return result.data;
}

//===============================================================================================//

export const saveTurnSchema = z.strictObject({
	actions: z.record(z.unknown())
});