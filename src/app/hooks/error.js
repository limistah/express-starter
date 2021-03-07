const sendBugEmail = require("../libs/sendBugEmail");
const { error } = require("../libs/response");

const errorHook = (app) => {
  // Dev error handler.
  if (process.env.NODE_ENV == "development") {
    app.use((errorObject, req, res, next) => {
      if (errorObject.statusCode === 404) {
        return res.status(errorObject.statusCode).json(errorObject);
      }

      if (!errorObject.statusCode) {
        errorObject = error(
          errorObject.message,
          "000",
          "000",
          500,
          errorObject.stack,
          "An internal error occured"
        );
      }
      return res.status(errorObject.statusCode || 500).json(errorObject);
    });
  } else {
    // Production error handler.
    app.use((errorObject, req, res, next) => {
      if (process.env.NODE_ENV !== "test") {
        console.error(errorObject);
        sendBugEmail(errorObject.status, errorObject.message, errorObject.error.stack);
      }
      if (errorObject.status === 404) {
        return res.status(errorObject.statusCode).json(errorObject);
      }
      if (!errorObject.statusCode) {
        errorObject = error(
          errorObject.message,
          "000",
          "000",
          500,
          errorObject.stack,
          "An internal error occured"
        );
      }
      return res.status(errorObject.statusCode || 500).json(errorObject);
    });
  }
};

module.exports = errorHook;
