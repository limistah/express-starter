const basicUserRules = require("./userRules");
const contentManagerRules = require("./contentManagerRules");

// Rules for content provider
const contentProviderRules = (user) => {
  const _basicUserRules = basicUserRules(user);
  const _contentManagerRules = contentManagerRules(user);
  const actionRules = (can, cannot) => {
    _basicUserRules.actionRules(can, cannot);
    _contentManagerRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _basicUserRules.fieldRules(can, cannot);
    _contentManagerRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = contentProviderRules;
