const router = require("./router");
const controller = require("./controller");
const service = require("./service");

// Base path for all the routes in here
const BASE_PATH = "/";

module.exports = {
  BASE_PATH,
  router,
  controller,
  service
};
