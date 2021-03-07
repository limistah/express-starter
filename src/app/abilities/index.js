const { Ability, AbilityBuilder } = require("@casl/ability");
//The Abililities function/file specifies what fields from the model/s a user with specific Role can get,read, or moodify / Abilities also declare which fields to return from request.
// All supported rule definitions
const guestRules = require("./guestRules");
const userRules = require("./userRules"); //Access/Restrictions that is connected with getting or editting a user's basic data
const moderatorRules = require("./moderatorRules");
const adminRules = require("./adminRules"); //Access/Restrictions chat is connected to admin's work
const superAdminRules = require("./superAdminRules"); //Access/Restrictions chat is connected to SuperAdmin's/DkAdmin's work

// Aliases for feathers services method names.
Ability.addAlias("update", ["patch", "put"]);
Ability.addAlias("read", "get");
Ability.addAlias("remove", "delete");
Ability.addAlias("modify", ["update", "patch"]);
Ability.addAlias("create", "post");

// Define abilities from here
function defineAbilitiesFor(user, roles) {
  // Get the id of the roles

  let rulesForRole = {
    actionRules: [],
    fieldRules: []
  };
  if (user) {
    const assignedRoles = user.roles;
    // User is set, definitely, a role is in the user's data
    if (assignedRoles.includes("super admin")) {
      rulesForRole = superAdminRules;
    } else if (assignedRoles.includes("admin")) {
      rulesForRole = adminRules;
    } else if (assignedRoles.includes("moderator")) {
      rulesForRole = moderatorRules;
    } else {
      rulesForRole = userRules;
    }
  } else {
    console.log("Guest Rules");
    // Default rules are those available to the guests, no role is set
    rulesForRole = guestRules;
  }
  const rules = rulesForRole(user);
  return {
    actionsAbility: AbilityBuilder.define(rules.actionRules),
    fieldsAbility: AbilityBuilder.define(rules.fieldRules)
  };
}

module.exports = defineAbilitiesFor;
