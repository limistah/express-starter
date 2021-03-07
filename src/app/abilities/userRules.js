const guestRules = require("./guestRules");

// Rules for basic user
// Inherits all guest rules
const basicUserRules = (user) => {
  const _guestRules = guestRules(user);

  const actionRules = (can, cannot) => {
    _guestRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _guestRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = basicUserRules;
