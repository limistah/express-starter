const config = require("config");
const base = require("./base");
const users = require("./users");
const authentication = require("./authentication");

function initializeAppModules(app) {
  // Register all the modules in here
  const modules = [base, users, authentication];

  for (let i = 0; i < modules.length; i++) {
    const { BASE_PATH, router } = modules[i];
    app.use(`/${config.get("pathPrefix")}${BASE_PATH}`, router);
  }
}

module.exports = initializeAppModules;
