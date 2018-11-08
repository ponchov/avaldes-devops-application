import _ from 'lodash';

import BaseController from './utils/controller_factory';
import config from '../helpers/config_helper';
import db from '../models';
import logger from '../utils/logger';
import ResponseHelper from '../helpers/response_helper';

// Status codes for ready checks
const StatusCodeError = 'error';
const StatusCodeOk = 'ok';

// All responses needed by this controller
class Responses {
  /**
   * Returns an object to use for health responses
   */
  static health() {
    // Get default response object
    const ret = ResponseHelper.defaultResponse();

    // NOTE: Resets data from array to object
    // Needed for other responses to work with `_.merge`
    ret.data = {
      uptime: Math.round((Date.now() - config.application.start_time) / 1000),
    };

    return ret;
  }

  /**
   * Checks dependencies and outputs a ready response
   */
  static async ready(req, res) {
    // NOTE: Object merge instead of Object.assign because deep copy
    const resp = _.merge({}, this.health(), {
      data: {
        service: StatusCodeOk,
        postgres: await this.checkPostgres(),
      },
    });

    // response code: 500 if any check isn't 'ok', 200 otherwise
    const code = Object.keys(resp.data)
      .filter(status => status !== 'uptime' && resp.data[status] !== StatusCodeOk).length ? 500 : 200;

    res.status(code).json(resp);
  }

  /**
   * checks postgres dependency to ensure connection is working correctly
   */
  static checkPostgres() {
    return new Promise(resolve => {
      db.sequelize.authenticate()
        .then(() => {
          // resolve promise
          resolve(StatusCodeOk);
        })
        .catch(err => {
          // log result
          logger.error('error connecting to PostgreSQL: ', err);

          // resolve promise
          resolve(StatusCodeError);
        });
    });
  }

  /**
   * Returns an object to use for version responses
   */
  static version() {
    // NOTE: Object merge instead of Object.assign because deep copy
    return _.merge({}, this.health(), {
      data: {
        version: config.application.release_version,
      },
    });
  }
}

// Controller to handle all health, ready, and version requests
// NOTE: Using object literal in order to have immutable binding
// Same object will be passed around on every require / import
const HealthController = function HealthController() {
  // Set base for inheritance
  const base = !(this instanceof HealthController) ? new BaseController() : BaseController;

  return Object.assign(Object.create(base), {
    /**
     * Serves all health requests
     */
    health: (req, res) => {
      res.status(200).json(Responses.health());
    },

    /**
     * Serves all ready requests
     */
    ready: (req, res) => {
      // Use async function to check dependencies
      Responses.ready(req, res);
    },

    /**
     * Serves all version requests
     */
    version: (req, res) => {
      res.status(200).json(Responses.version());
    },
  });
};

const healthController = HealthController();

export { healthController, Responses as healthResponses };
