const adminRules = require("./adminRules");

// Rules for super admin
// Inherits all admin rules (usersModeratorRules/mediaModeratorRules/basicUserRules/postModeratorRules/adminRules/guestRules)
const superAdminRules = (user) => {
  const _adminRules = adminRules(user);
  const actionRules = (can, cannot) => {
    _adminRules.actionRules(can, cannot);
  };
  const fieldRules = (can, cannot) => {
    _adminRules.fieldRules(can, cannot);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = superAdminRules;
