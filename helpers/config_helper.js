import path from 'path';

import logger from '../utils/logger';
import program from './command_helper';

// Default config object for export
let config = {};

// Example config file path and possible local developer config file path
const configFileExample = path.join(__dirname, '../', 'config/config.js.example');
// config file from commandline argument if provided
const configFile = program.config || path.join(__dirname, '../', 'config/config.js');

/*
 * load a configuration file
 * @param  {string} filePath  file path to the config file that will be attempted to load
 */
function loadConfig(filePath) {
  try {
    // Attempt to load a config file from path
    config = require(filePath);
    logger.debug(` - filePath: ${filePath}`);
  } catch (e) {
    // Fall back to example config file, which defines the default structure
    // and recursively call this function again
    logger.debug('configuration file specified in loadConfig was not found');
    if (filePath !== configFileExample) {
      logger.debug('fall back to example config file');
      logger.debug(` - configFileExample: ${configFileExample}`);
      loadConfig(configFileExample);
    }
  }

  logger.info('Configuration loaded');
}

// Attempt to load defined config file
loadConfig(configFile);

export default config;
