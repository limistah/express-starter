/**
 *
 * @param {string} msg The message to explain the error
 * @param {number} statusCode The response status code
 * @param {string} errorCode The Application Error Code
 * @param {string} errorSuffix The controller suffix
 * @param {string} stack The error stack trace
 * @param {string} status Status message for all response
 */
function errorResponse(
  errorMessage,
  errorCode = "001",
  errorSuffix = "001",
  statusCode = 422,
  errorStack = null,
  status = "An Error Occurred"
) {
  return {
    error: { message: errorMessage, code: `${errorSuffix}${errorCode}`, stack: errorStack },
    statusCode,
    status
  };
}

// { total: 0, limit: 0, page: 0 } => meta
function successResponse(data, statusCode, meta, status = "Operation Successful") {
  return { data, statusCode, meta, status };
}

exports.error = errorResponse;
exports.success = successResponse;
