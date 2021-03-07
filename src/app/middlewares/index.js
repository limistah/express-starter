const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const paginate = require("./paginate");
const authenticate = require("./authenticate");
const authorize = require("./authorize");
const handleValidation = require("./handleValidation");
const userAgent = require("express-useragent");

const ingress = (app) => {
  const middlewares = [
    morgan("dev"),
    helmet(),
    compression(),
    express.json(),
    paginate(),
    userAgent.express()
  ];

  // Initialize the middlewares
  for (let i = 0; i < middlewares.length; i++) {
    const middleware = middlewares[i];
    if (typeof middleware == "function") {
      app.use(middleware);
    }
  }
};

const egress = (app) => {
  const middlewares = [];

  // Initialize the middlewares
  for (let i = 0; i < middlewares.length; i++) {
    const middleware = middlewares[i];
    if (typeof middleware == "function") {
      app.use(middleware);
    }
  }
};

module.exports = {
  ingressMiddlewares: ingress,
  egressMiddlewares: egress,
  authenticate,
  authorize,
  handleValidation
};
