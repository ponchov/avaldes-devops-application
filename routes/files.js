import express from 'express';

import logger from '../utils/logger';
import { filesController } from '../controllers/files/files';

const router = express('Router');

logger.info('setting up routes for files');

/**
 * GET files response
 * @return Returns a files response
 */
router.get('/', (req, res) => {
  filesController.files(req, res);
});


export default router;
