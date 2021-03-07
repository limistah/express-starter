const logger = require("../../libs/logger");
const { success, error } = require("../../libs/response");
const hashPassword = require("../../libs/hashPassword");
const { generateAuthToken } = require("../../libs/authentication");
const comparePassword = require("../../libs/comparePassword");

const queues = require("../../../queues");
const service = require("./service");
const moment = require("moment");
const { customAlphabet } = require("nanoid");

const ERR_SUFFIX = "006";

const postConfirmToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    const strippedEmail = req.body.email.split(".");
    const tld = strippedEmail.splice(-1, 1);
    const email = `${strippedEmail.join("")}.${tld}`;
    const user = await service.findOne({ email, emailToken: token });

    if (!user) {
      const errorObject = error("Email/Token mismatch", "001", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    if (user.emailConfirmed) {
      const errorObject = success({}, 200, undefined, "Email Confirmed. Kindly login");
      return next(errorObject);
    }

    const emailTokenExpires = user.emailTokenExpires;
    const tokenExpired = moment(emailTokenExpires).isBefore();
    if (tokenExpired) {
      const errorObject = error("Token expired", "002", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    const update = {
      emailToken: null,
      emailTokenExpires: null,
      emailConfirmed: true,
      emailConfirmedAt: moment().toISOString()
    };

    await service.updateById(user._id, update);

    const authToken = await generateAuthToken(user._id);
    res.header("x-auth-token", authToken);

    return res.status(200).json(success({ token: authToken }, 200, undefined, "Email Confirmed"));
  } catch (error) {
    next(error);
  }
};

const postResendToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    const strippedEmail = req.body.email.split(".");
    const tld = strippedEmail.splice(-1, 1);
    const email = `${strippedEmail.join("")}.${tld}`;
    const user = await service.findOne({ email });

    if (!user) {
      const errorObject = error("User mismatch", "003", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    if (user.emailConfirmed) {
      const errorObject = success({}, 200, undefined, "Email Confirmed");
      return next(errorObject);
    }

    const nanoid = customAlphabet("ABCDEFGHIJKMNOPQRSTUVWXYZ123456789", 10);
    const emailToken = nanoid();
    const update = {
      emailToken,
      emailTokenExpires: moment()
        .add(10, "minutes")
        .toISOString(),
      emailConfirmed: false,
      emailConfirmedAt: null
    };

    await service.updateById(user._id, update);

    queues.resendConfirmEmail({ ...user.toJSON(), emailToken });

    return res.status(200).json(success({}, 200, undefined, "Confirmation Token Resent"));
  } catch (error) {
    next(error);
  }
};

const postForgotPassword = async (req, res, next) => {
  try {
    const strippedEmail = req.body.email.split(".");
    const tld = strippedEmail.splice(-1, 1);
    const email = `${strippedEmail.join("")}.${tld}`;
    const user = await service.findOne({ email });

    if (!user) {
      const errorObject = error("User mismatch", "004", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    if (!user.emailConfirmed) {
      const errorObject = error("Account is unconfirmed!", "005", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    const nanoid = customAlphabet("ABCDEFGHIJKMNOPQRSTUVWXYZ123456789", 10);
    const passwordResetToken = nanoid();
    const update = {
      passwordResetToken,
      passwordResetTokenExpires: moment()
        .add(10, "minutes")
        .toISOString()
    };

    await service.updateById(user._id, update);

    queues.sendPasswordResetEmail({ ...user.toJSON(), passwordResetToken });

    return res.status(200).json(success({}, 200, undefined, "Password Reset Token Sent"));
  } catch (error) {
    next(error);
  }
};

const patchForgotPassword = async (req, res, next) => {
  try {
    const strippedEmail = req.body.email.split(".");
    const tld = strippedEmail.splice(-1, 1);
    const email = `${strippedEmail.join("")}.${tld}`;
    const user = await service.findOne({ email, passwordResetToken: req.body.token });

    if (!user) {
      const errorObject = error("User mismatch", "007", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    const passwordResetTokenExpires = user.passwordResetTokenExpires;
    const tokenExpired = moment(passwordResetTokenExpires).isBefore();
    if (tokenExpired) {
      const errorObject = error("Token expired", "006", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    const hashedPassword = await hashPassword(req.body.password);

    const update = {
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      password: hashedPassword
    };

    await service.updateById(user._id, update);

    queues.sendPasswordUpdateEmail({ ...user.toJSON() });

    const authToken = await generateAuthToken(user._id);
    res.header("x-auth-token", authToken);

    return res
      .status(200)
      .json(success({ token: authToken }, 200, undefined, "Password Reset Successful"));
  } catch (error) {
    next(error);
  }
};

const postLogin = async (req, res, next) => {
  try {
    const strippedEmail = req.body.email.split(".");
    const tld = strippedEmail.splice(-1, 1);
    const email = `${strippedEmail.join("")}.${tld}`;
    const user = await service.findOne({ email });

    if (!user) {
      const errorObject = error("User mismatch", "006", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    if (!user.emailConfirmed) {
      const errorObject = error("Account is unconfirmed!", "007", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    // Compares the crypted password with the plain password in the body

    const passwordMatches = await comparePassword(req.body.password, user.password);
    // Returns error if password does not match.
    if (!passwordMatches) {
      const errorObject = error("Username or Password is invalid.", "008", ERR_SUFFIX, 403);
      return next(errorObject);
    }

    const update = {
      lastActive: moment().toISOString(),
      $inc: { loginCount: 1 }
    };
    await service.updateById(user._id, update);

    const authToken = await generateAuthToken(user._id);
    res.header("x-auth-token", authToken);

    // Log the login session
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await service.registerLoginDetails(user._id, req.useragent, ipAddress);

    const returnData = service.authorizedItems(req.abilities.fieldsAbility, user);

    return res
      .status(200)
      .json(success(returnData, 200, { token: authToken }, "Password Reset Successful"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postConfirmToken,
  postResendToken,
  postForgotPassword,
  patchForgotPassword,
  postLogin
};
