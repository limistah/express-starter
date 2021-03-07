const merchantRules = require("./merchantRules");

// Rules for content provider
const contentProviderRules = (user) => {
  const _merchantRules = merchantRules(user);
  const actionRules = (can, cannot) => {
    _merchantRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _merchantRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = contentProviderRules;
