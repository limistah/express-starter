const config = require("config");
const logger = require("../../libs/logger");
const { success, error } = require("../../libs/response");
const hashPassword = require("../../libs/hashPassword");
const queues = require("../../../queues");
const service = require("./service");
const { generateAuthToken } = require("../../libs/authentication");
const { customAlphabet } = require("nanoid");
const moment = require("moment");

const ERR_SUFFIX = "005";

const postUser = async (req, res, next) => {
  try {
    // 1. Check if the email is avaialable
    const strippedEmail = req.body.email.split(".");
    const tld = strippedEmail.splice(-1, 1);
    const email = `${strippedEmail.join("")}.${tld}`;
    const userByEmail = await service.findOne({ email });
    if (userByEmail) {
      logger.info(`POST /user User Exists: ${req.body.email}`);
      const errorObject = error("Email taken", "002", ERR_SUFFIX, 409);
      next(errorObject);
    }

    // 1. Check if the displayName is available
    const userByDisplayName = await service.findOne({
      lowerCaseDisplayName: req.body.displayName.toLowerCase()
    });
    if (userByDisplayName) {
      logger.info(`POST /user User Exists: ${req.body.displayName}`);
      const errorObject = error("Display Name taken", "003", ERR_SUFFIX, 409);
      next(errorObject);
    }

    const { body } = req;

    const hashedPassword = await hashPassword(body.password);
    const nanoid = customAlphabet("ABCDEFGHIJKMNOPQRSTUVWXYZ123456789", 10);
    const emailToken = nanoid();

    // Pick the fields that is updateable
    const allowedItems = service.authorizedItems(req.abilities.fieldsAbility, body, "post");

    const userDTO = Object.assign(allowedItems, {
      lowerCaseDisplayName: body.displayName.toLowerCase(),
      emailToken,
      password: hashedPassword,
      emailConfirmed: false,
      emailConfirmedAt: null,
      emailTokenExpires: moment()
        .add(10, "minutes")
        .toISOString(), // Email expires in 10 mins
      status: "Active",
      followingCount: 0,
      followersCount: 0,
      likesCount: 0,
      roles: ["user"]
    });

    const userObject = await service.create(userDTO);

    userObject.token = await generateAuthToken(userObject._id);
    res.header("x-auth-token", userObject.token);

    logger.info(`POST /user User Created: ${req.body.email}`);

    // The signup Queue
    queues.signup(userObject);

    // Pick the return data
    const returnData = service.authorizedItems(req.abilities.fieldsAbility, userObject);

    return res.status(201).json(success(returnData, 201));
  } catch (error) {
    next(error);
  }
};

module.exports = { postUser };
