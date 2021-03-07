const response = require("../libs/response");

const hook = (app) => {
  app.use((req, res, next) => {
    const errorObject = response.error("Not Found", "001", "001", 404);
    return next(errorObject);
  });
};

module.exports = hook;
