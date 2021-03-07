// const userAbilities = require('./../factory/userAbilities');
const _ = require("lodash");
const changeCase = require("change-case");
const { ForbiddenError } = require("@casl/ability");
const logger = require("../libs/logger");

const abilities = require("../abilities");
const { error } = require("../libs/response");
const config = require("config");

const USER_ROLES = config.get("userRoles");

const ERROR_SUFFIX = "002";
const PATH_PREFIX = config.get("pathPrefix");

async function authorize(req, res, next) {
  // Loads the abilities for the current user based on their role.
  const abilitiesByRole = abilities(
    req.user,
    USER_ROLES.map((r) => r.toLowerCase())
  );
  const action = req.method.toLowerCase();
  const strippedPath = req.baseUrl.replace(PATH_PREFIX, "");
  const subjectName = changeCase.camelCase(strippedPath + req.route.path);
  try {
    // Get the two set of abilities by user and their role
    ForbiddenError.from(abilitiesByRole.actionsAbility).throwUnlessCan(action, subjectName);
    req.abilities = abilitiesByRole;
    req.action = action;
    // Move to the next middleware
    next();
  } catch (err) {
    // Throws forbidden error if the permission is not set
    const msg = `You cannot ${action} ${changeCase.sentenceCase(subjectName).toLocaleLowerCase()}`;
    logger.error(`${req.user ? req.user._id : "GUEST"} ${msg}`);
    const errorResponse = error(msg, "001", ERROR_SUFFIX, 403);
    return res.status(403).json(errorResponse);
  }
}

// eslint-disable-next-line no-unused-vars
module.exports = () => authorize;
