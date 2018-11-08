// Helper for model use throughout the application
class ModelHelper {
  /**
   * Returns an object containing a set of attributes that can be saved
   * on a given model based on a request and a set of errors that may have
   * occurred during field validation
   *
   * @param  {object} model The Sequelize model to be used when forming return values
   * @param  {object} req   The HTTP request object used to form attribute values
   *                        from the based on the request body
   *
   * @return {object}       An object containing attributes and possibly validation errors
   */
  static getCreateAttributesAndValidate(model, req) {
    // Set default return value
    const ret = { attributes: {}, errors: [] };

    // Loop through model attributes, handling each
    Object.keys(model.attributes).forEach(key => {
      // Store attribute
      const attribute = model.attributes[key];

      // Add attribute to creation attributes object if it's defined
      if (req.body[key] !== undefined) {
        ret.attributes[key] = req.body[key];
      // If attribute is not defined, but is required, add an error
      } else if (attribute.requiredDuringCreate !== undefined && attribute.requiredDuringCreate === true) {
        // Add error to response
        ret.errors.push({
          field: key,
          message: 'A required field is missing from the request body.',
        });
      }
    });

    return ret;
  }

  /**
   * Returns an object containing a set of attributes that can be saved
   * on a given model based on a request
   *
   * @param  {object} model The Sequelize model to be used when forming return values
   * @param  {object} req   The HTTP request object used to form attribute values
   *                        from the based on the request body
   *
   * @return {object}       An object containing attributes that can be saved
   */
  static getUpdateAttributes(model, req) {
    // Set default return value
    const ret = {};

    // Loop through model attributes, handling each
    Object.keys(model.attributes).forEach(key => {
      // Add attribute to update attributes object if it's defined
      if (req.body[key] !== undefined) {
        ret[key] = req.body[key];
      }
    });

    return ret;
  }

  /**
   * Create to handle request with more than one object within the body
   *
   * @param  {object} model The Sequelize model to be used when forming return values
   * @param  {object} req   The HTTP request object used to form attribute values
   *                        from the based on the request body
   *
   * @return {object}       An object containing attributes and possibly validation errors
   */
  static getCreateAttributesAndValidateCustom(model, req, attributeKey, errorKey) {
    // Set default return value
    const ret = {};

    // add object properties key dinamically
    ret[attributeKey] = {};
    ret[errorKey] = [];

    // Loop through model attributes, handling each
    Object.keys(model.attributes).forEach(key => {
      // Store attribute
      const attribute = model.attributes[key];

      // Add attribute to creation attributes object if it's defined
      if (req[key] !== undefined) {
        ret[attributeKey][key] = req[key];
      // If attribute is not defined, but is required, add an error
      } else if (attribute.requiredDuringCreate !== undefined && attribute.requiredDuringCreate === true) {
        // Add error to response
        ret[errorKey].push({
          field: key,
          message: 'A required field is missing from the request.',
        });
      }
    });

    return ret;
  }
}

export default ModelHelper;
