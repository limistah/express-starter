const basicUserRules = require("./userRules");

// Rules for merchant managers
const merchantManagerRules = (user) => {
  const _basicUserRules = basicUserRules(user);
  const actionRules = (can, cannot) => {
    _basicUserRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _basicUserRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = merchantManagerRules;
