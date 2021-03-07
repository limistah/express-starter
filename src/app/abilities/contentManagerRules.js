const basicUserRules = require("./userRules");

// Rules for media moderator
const contentManagerRules = (user) => {
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

module.exports = contentManagerRules;
