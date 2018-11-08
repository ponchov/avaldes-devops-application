import BaseController from './utils/controller_factory';

// Controller to handle all errors
// NOTE: Using object literal in order to have immutable binding
// Same object will be passed around on every require / import
const ErrorController = function ErrorController() {
  // Set base for inheritance
  const base = !(this instanceof ErrorController) ? new BaseController() : BaseController;

  return Object.assign(Object.create(base), {});
};

const errorController = ErrorController();

export default errorController;
