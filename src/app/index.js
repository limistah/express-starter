const express = require("express");
const { ingressHooks, egressHooks } = require("./hooks");
const { ingressMiddlewares, egressMiddlewares } = require("./middlewares");
// Configure ObjectId
const Objectid = require("joi-objectid");
const Joi = require("joi");
Joi.objectId = Objectid(Joi);

const initModules = require("./modules");

// Exports Express Application
module.exports = () => {
  const app = express();

  ingressHooks(app);
  ingressMiddlewares(app);

  // Bootstrap All Modules of the application Routes
  initModules(app);

  egressMiddlewares(app);
  egressHooks(app);

  return app;
};
