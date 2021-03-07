const moderatorRules = require("./moderatorRules");

// Rules for administrators
// Inherits all the moderator rules
const adminRules = (user) => {
  const _moderatorRules = moderatorRules(user);
  const actionRules = (can, cannot) => {
    _moderatorRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _moderatorRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = adminRules;
