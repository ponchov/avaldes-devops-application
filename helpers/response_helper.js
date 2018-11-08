import _ from 'lodash';
import logger from '../utils/logger';
import httpConstants from '../config/http_constants';


// Helper for responses throughout the application
class ResponseHelper {
  /**
   * Converts a given Error, Exception, etc into a String to show in the error response
   *
   * @param {Object|String|*} err the error that want to be represented
   * @returns {String} a String representation of the error given
   */
  static findErrorMessage(err) {
    if (err.constructor === String) {
      return err;
    }
    if (err.constructor === Error) {
      if (err.errors && (err.errors.constructor === Array || err.errors.constructor === String)) {
        return err.errors.toString();
      }
    }
    if (err.response) {
      if (err.response.data) {
        if (err.response.data.errors) {
          if (err.response.data.errors.length > 0) {
            return err.response.data.errors[0].message;
          }
        }
      }
      if (err.response.message) {
        return err.response.message;
      }
      return err.response;
    }
    if (err.message) {
      return err.message;
    }
    if (err.description) {
      return err.description;
    }
    if (_.isArray(err)) {
      let errors = '';
      err.map(el => {  // eslint-disable-line
        errors += el.message + ' ';
      });
      return errors;
    }
    if (_.isObject(err)) {
      let errorMessage = null;
      try {
        errorMessage = JSON.stringify(err);
      } catch (error) {
        // nothing
      }
      if (errorMessage) {
        return errorMessage;
      }
    }
    return err.toString();
  }

  static _buildResponseObject(data = null, meta = null, errors = []) {
    const resp = {
      ok: true,
      meta: null,
      data: null,
      errors: [],
    };
    if (errors.length > 0) {
      resp.ok = false;
      resp.errors = errors;
    } else {
      resp.ok = true;
      if (data !== null) {
        resp.data = data;
      }
      if (meta !== null) {
        resp.meta = {};
        if (typeof (meta.page) !== 'undefined' && meta.page !== null) {
          resp.meta.page = meta.page;
        }
        if (typeof (meta.pageSize) !== 'undefined' && meta.pageSize !== null) {
          resp.meta.pageSize = meta.pageSize;
        }
        if (typeof (meta.totalCount) !== 'undefined' && meta.totalCount !== null) {
          resp.meta.totalCount = meta.totalCount;
        }
      }
    }

    return resp;
  }

  /**
   * Sends a Single Result, building the correct response in the meanwhile
   *
   * @param {Object} res the HTTP response object
   * @param data the data that should be a single object to be parsed
   */
  static sendSingleResult(res = null, data = null) {
    if (res === null) {
      throw new Error('Unable to locate response object trying to build a response, please contact support.');
    }
    if (data === null) {
      ResponseHelper.sendCustomError(
        res,
        httpConstants.INTERNAL_ERROR,
        'Trying to send a null single value. Please send \'OK\' or an empty object.',
      );
      return;
    }

    const resp = ResponseHelper._buildResponseObject(data);
    return res.status(httpConstants.OK).json(resp);
  }

  /**
   *
   * @param {Object} res the HTTP response object
   * @param {Object} meta
   * @param {Object|Array} data
   */
  static sendPaginatedResult(res = null, meta = null, data = null) {
    if (res === null) {
      throw new Error('Unable to locate response object trying to build a response, please contact support.');
    }
    if (data === null || data.constructor !== Array) {
      return ResponseHelper.sendCustomError(
        res,
        httpConstants.INTERNAL_ERROR,
        'Trying to send a null paginated value. Please send an array of objects. Even if its empty.',
      );
    }
    if (meta === null || meta.constructor !== Object) {
      return ResponseHelper.sendCustomError(res, httpConstants.INTERNAL_ERROR, 'Pagination information is missing.');
    } else {
      if (typeof (meta.page) === 'undefined' || meta.page === null) {
        return ResponseHelper.sendCustomError(res, httpConstants.INTERNAL_ERROR, 'Pagination information is missing.');
      }
      if (typeof (meta.pageSize) === 'undefined' || meta.pageSize === null) {
        return ResponseHelper.sendCustomError(res, httpConstants.INTERNAL_ERROR, 'Pagination information is missing.');
      }
      if (typeof (meta.totalCount) === 'undefined' || meta.totalCount === null) {
        return ResponseHelper.sendCustomError(res, httpConstants.INTERNAL_ERROR, 'Pagination information is missing.');
      }
    }
    const resp = ResponseHelper._buildResponseObject(data, meta);
    return res.status(httpConstants.OK).json(resp);
  }

  /**
   * Builds an error message and sends it using the specified error code.
   *
   * @param {Object} res the HTTP response object
   * @param {Number} code
   * @param {String | Error | Array} message
   */
  static sendCustomError(res = null, code = null, message = null) {
    if (res === null) {
      throw new Error('Unable to locate response object trying to build a response, please contact support.');
    }
    if (isNaN(code)) { // eslint-disable-line no-restricted-globals
      code = httpConstants.INTERNAL_ERROR;
    }
    if (message === null) {
      message = 'Unspecified error message';
    }
    const errorList = [];
    if (message.constructor !== Array) {
      message = [message];
    }
    for (let i = 0; i < message.length; i += 1) {
      errorList.push({
        code,
        message: ResponseHelper.findErrorMessage(message[i]),
      });
    }
    const resp = ResponseHelper._buildResponseObject(null, null, errorList);
    return res.status(code).json(resp);
  }

  // ///////// OLD METHODS ///////////////

  /**
   * Returns a default response object for use in controller handlers
   *
   * @param  {string} key The object key to use for response data
   *                      Default: 'data'
   *
   * @return {object}     Default response object
   */
  static defaultResponse(key) {
    // Set default return value
    const ret = {
      meta: {
        count: 0,
      },
    };

    // Set items key
    ret[key || 'data'] = [];

    return ret;
  }

  /**
   * internalError Helper method for sending a Internal Server Error response code and default JSON output
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {Error} error - Error object for runtime and internal error
   */
  static internalError(req, res, error) {
    // Log error is present
    if (error) {
      logger.error('internal server error', error);
    }
    // FIXME This is just wrong
    res.status(httpConstants.INTERNAL_ERROR).json(ResponseHelper.defaultResponse());
  }

  /**
   * methodNotAllowed Helper method for sending a Method Not Allowed response code and default JSON output
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json}
   */
  static methodNotAllowed(req, res) {
    // FIXME This is just wrong
    res.status(405).json(ResponseHelper.defaultResponse());
  }

  /**
   * methodNotImplemented Helper method for sending a Method Not Implemented response code and default JSON output
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json}
   */
  static methodNotImplemented(req, res) {
    // FIXME This is just wrong
    res.status(httpConstants.NOT_IMPLEMENTED).json(ResponseHelper.defaultResponse());
  }

  /**
   * notFound Helper method for sending a Not Found response code and default JSON output
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json}
   */
  static notFound(req, res) {
    // FIXME This is just wrong
    res.status(httpConstants.NOT_FOUND).json(ResponseHelper.defaultResponse());
  }

  static buildResponse(result, response) {
    const output = {};
    output.status = httpConstants.OK;

    if (result.status === 'error') {
      output.status = 400;
      response.errors = {
        status: 400,
        message: result.response,
      };
    } else {
      response.data = result.response;
    }

    output.response = response;

    return output;
  }
}

export default ResponseHelper;
