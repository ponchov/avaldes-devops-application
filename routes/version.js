import express from 'express';

import logger from '../utils/logger';
import { healthController } from '../controllers/health';

const router = express('Router');

logger.info('setting up routes for version');

/**
 * GET version response
 * @return Returns a version response
 */
router.get('/', (req, res) => {
  healthController.version(req, res);
});

/**
 * @return Returns a Method Not Allowed response
 */
router.all('/', (req, res) => {
  healthController.methodNotAllowed(req, res);
});

export default router;
