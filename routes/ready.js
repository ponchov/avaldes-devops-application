import express from 'express';

import logger from '../utils/logger';
import { healthController } from '../controllers/health';

const router = express('Router');

logger.info('setting up routes for ready');

/**
 * GET ready response
 * @return Returns a ready response
 */
router.get('/', (req, res) => {
  healthController.ready(req, res);
});

/**
 * @return Returns a Method Not Allowed response
 */
router.all('/', (req, res) => {
  healthController.methodNotAllowed(req, res);
});

export default router;
