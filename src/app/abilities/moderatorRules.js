const contentProviderRules = require("./contentProviderRules");
const merchantRules = require("./merchantRules");

// Rules for media moderator
const moderatorRules = (user) => {
  const _contentProviderRules = contentProviderRules(user);
  const _merchantRules = merchantRules(user);
  const actionRules = (can, cannot) => {
    _contentProviderRules.actionRules(can, cannot);
    _merchantRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _contentProviderRules.fieldRules(can, cannot);
    _merchantRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = moderatorRules;
