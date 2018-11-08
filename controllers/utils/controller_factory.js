import _ from 'lodash';

import ModelHelper from '../../helpers/model_helper';
import ResponseHelper from '../../helpers/response_helper';

// Base controller all other controllers can extend
class Controller {
  constructor(params = {}) {
    // Set up class params, with defaults
    this.params = _.extend({}, {
      version: 1,
      model: null,
      findIncludes: [],
      findOrder: [['createdat', 'ASC']],
      allowedFilters: [],
    }, params);
  }

  _buildFilters(query) {
    if (query === undefined) {
      return;
    }

    const filters = {};

    Object.keys(query).forEach(function (key) {
      if (this.params.allowedFilters.indexOf(key) > -1) {
        filters[key] = query[key];
      }
    }, this);

    return filters;
  }

  /**
   * CRUD Methods
   */

  /**
   * getCollection
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json} a collection from a particular resource or error
   */
  getCollection(req, res) {
    // Set up response
    const resp = ResponseHelper.defaultResponse();

    const where = this._buildFilters(req.query);

    this.params.model.findAndCountAll({
      limit: parseInt(req.query.limit || 10, 10),
      offset: parseInt(req.query.offset || 0, 10),
      order: this.params.findOrder,
      include: this.params.findIncludes,
      where,
    }).then(result => {
      // Reset response values
      resp.meta.count = result.count;
      resp.data = result.rows;

      // Output response
      res.status(200).json(resp);
    }).catch(e => ResponseHelper.internalError(req, res, e));
  }

  /**
   * getSingle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json} a single object from a particular resource or error
   */
  getSingle(req, res) {
    // Set up response and status code
    const resp = ResponseHelper.defaultResponse();
    let status = 404;

    this.params.model.findOne({
      where: { id: req.params.id },
      include: this.params.findIncludes,
    }).then(result => {
      // Reset response values if anything was found
      if (result) {
        resp.meta.count = 1;
        resp.data = result;
        status = 200;
      }

      // Output response
      res.status(status).json(resp);
    }).catch(e => ResponseHelper.internalError(req, res, e));
  }

  /**
   * createSingle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json} a single object from a particular resource or error
   */
  createSingle(req, res) {
    // Set up response and status code
    let resp = ResponseHelper.defaultResponse('errors');
    let status = 400;

    // Set up model attributes to use in creation
    const { attributes, errors } = ModelHelper.getCreateAttributesAndValidate(this.params.model, req);

    // Check if there were validation errors
    if (errors.length) {
      // Set errors
      resp.errors = errors;

      // Output response
      res.status(status).json(resp);
      return;
    }

    // Attempt to create model
    this.params.model.create(attributes).then(result => {
      // Reset response values
      resp = ResponseHelper.defaultResponse();
      resp.meta.count = 1;
      resp.data = result;
      status = 201;

      // Output response
      res.status(status).json(resp);
    }).catch(e => {
      // Add error to response
      resp.errors.push({
        error: e, // TO-DO: This may leak sensitive info. Figure out sanitization
        message: 'An error occurred attempting to save this item in the database.',
      });

      // Output response
      res.status(status).json(resp);
    });
  }

  /**
   * updateSingle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json} a single object updated from a particular resource or error
   */
  updateSingle(req, res) {
    // Set up response and status code
    const resp = ResponseHelper.defaultResponse();
    let status = 404;

    // Set up model attributes to use in creation
    const attributes = ModelHelper.getUpdateAttributes(this.params.model, req);

    this.params.model.update(attributes, {
      where: { id: req.params.id },
      returning: true,
    }).then(result => {
      // Cache results
      const affectedCount = result[0];
      const affectedRows = result[1];

      // Check if operation was successful and reset response values if needed
      if (affectedCount !== 0) {
        resp.meta.count = affectedCount;
        resp.data = affectedCount === 1 ? affectedRows[0] : affectedRows;
        status = 200;
      }

      // Output response
      res.status(status).json(resp);
    }).catch(e => ResponseHelper.internalError(req, res, e));
  }

  /**
   * deleteSingle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json} 200 if deleted or error
   */
  deleteSingle(req, res) {
    // Set up response and status code
    const resp = ResponseHelper.defaultResponse();
    let status = 404;

    this.params.model.destroy({
      where: { id: req.params.id },
    }).then(rowsDeleted => {
      // Check if operation was successful and reset response values if needed
      if (rowsDeleted !== 0) {
        resp.meta.count = rowsDeleted;
        resp.data = { id: req.params.id };
        status = 200;
      }

      // Output response
      res.status(status).json(resp);
    }).catch(e => ResponseHelper.internalError(req, res, e));
  }

  /**
   * Response methods
   */

  /**
   * methodNotAllowed Sends a Method Not Allowed response code and default JSON output
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json}
   */
  methodNotAllowed(req, res) {
    ResponseHelper.methodNotAllowed(req, res);
  }

  /**
   * notFound Sends a Not Found response code and default JSON output
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {json}
   */
  notFound(req, res) {
    ResponseHelper.notFound(req, res);
  }
}

export default Controller;
