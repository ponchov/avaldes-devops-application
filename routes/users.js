import express from 'express';

import logger from '../utils/logger';
import { usersController } from '../controllers/users/users';

const router = express('Router');

logger.info('setting up routes for users');

/**
 * GET Collection of users
 * @return Returns a collection of users objects
 */
router.get('/', (req, res) => {
  usersController.getCollection(req, res);
});


export default router;
