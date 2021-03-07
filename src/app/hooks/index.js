const cors = require("./cors");
const notFound = require("./notFound");
const error = require("./error");

const ingress = (app) => {
  // Register all hooks for incoming requests here
  const hooks = [cors];

  // Initialize the middlewares
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (typeof hook == "function") {
      hook(app);
    }
  }
};

const egress = (app) => {
  // Register hooks before emitting a response here
  const hooks = [notFound, error];

  // Initialize the hooks
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (typeof hook == "function") {
      hook(app);
    }
  }
};

module.exports = { ingressHooks: ingress, egressHooks: egress };
