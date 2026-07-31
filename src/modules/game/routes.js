import express from 'express';
//-----------------------------------------------------------------------------------------------//
import enterWorldRouter from './enter-world/routes.js';
import worldRouter 	 	from './world/routes.js';

//===============================================================================================//

const router = express.Router();
//-----------------------------------------------------------------------------------------------//
router.use('/enter-world', enterWorldRouter);
router.use('/world', 	   worldRouter);

//===============================================================================================//

export default router;