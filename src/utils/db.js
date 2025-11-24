//=== Imports ===================================================================================//

import dotenv from 'dotenv';
import path from 'path';
import Knex from 'knex';

//=== Main ======================================================================================//

dotenv.config({ path: path.join(process.cwd(), '.env')});

const knex = Knex({
	client: 'mysql2',
	connection: {
		host: 	  process.env.DB_HOST,
		port: 	  process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: 	  process.env.DB_USER,
		password: process.env.DB_PASSWORD
	},
	pool: { 
		min: 0, 
		max: 20 
	}
});

//=== Export ====================================================================================//

export default knex;