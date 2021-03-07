const { validationResult } = require("express-validator/check");
const { error } = require("../libs/response");
const logger = require("../libs/logger");

function handleValidation(suffix = "001") {
  return (req, res, next) => {
    // 1. Validate the request coming in
    const result = validationResult(req);

    const hasErrors = !result.isEmpty();
    if (hasErrors) {
      const firstError = result.array({ onlyFirstError: true })[0];

      const errorObject = error(firstError.msg, "001", suffix, 422, firstError, "Validation Error");
      logger.error(
        `Validation Failed: ${req.baseUrl + req.route.path} ${JSON.stringify(result.array())}`
      );
      next(errorObject);
    } else {
      next();
    }
  };
}

module.exports = handleValidation;
