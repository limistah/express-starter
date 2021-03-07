const moment = require("moment");
const config = require("config");
const { verifyAuthToken, generateAuthToken, decodeToken } = require("../libs/authentication");
const { User } = require("../../models/user");
const { AuthToken } = require("../../models/authToken");

// Generic error utility
const throwError = (res, msg = "Unauthorized Request.", status = 401, code = "00001") =>
  res.status(status).json({ error: { msg, code } });

const authenticateMiddleware = async (req, res, next) => {
  try {
    // Get the auth token from the header
    const token = req.headers["authorization"];
    // Throw if token is not set
    if (!token) {
      return throwError(res, "Unauthorized request, token not set.");
    }
    const decoded = await verifyAuthToken(token, config.get("foreverToken"));
    // Decoded returns false due to bad format of token
    if (!decoded) {
      return throwError(res, "Unauthorized request, invalid token.");
    }
    // The token does not have _id to specify the userId, it is bad
    if (!decoded._id) {
      return throwError(res, "Unauthorized request, bad token.");
    }

    const user = await User.findById(decoded._id)
      .populate("role")
      .exec();
    // The user can not be found, this token is bad.
    if (!user) {
      return throwError(res, "Unauthorized request, bad token.");
    }
    // A user is suspended. or locked. We can not allow them into the application
    if (["Suspended", "Locked"].includes(user.status)) {
      return throwError(`Unauthorized request, user ${user.status.toLowerCase()}.`, 401);
    }
    // An email is not confirmed, we should not let it pass through
    if (!user.emailConfirmed && config.get("requiresEmailConfirmation")) {
      return res.status(401).json({ error: { msg: "Email is not confirmed." } });
    }

    const _user = user.toJSON();
    // Set the user on the request object
    req.user = _user;

    // Try to confirm if the application recognizes the current user
    const authToken = await AuthToken.findOne({
      userId: user._id,
      tokens: { $in: [token] }
    }).exec();

    if (!authToken) {
      return throwError(res, "Unauthorized request, bad token.");
    }

    const margin = config.get("tokenExpiryMarginBeforeNew");
    const tokenData = decodeToken(token);
    // exp is a unix timestamp (milliseconds since epoch)
    const expMoment = moment(tokenData.exp * 1000);
    // Say token expires in the next 2100, we get the current time (say 2000) add the margin (say 30min, time becomes 2030h), then checks if the new time(added) is after the token expiry time. If it is, we can generate a new token
    const tokenExpiredWithMargin = moment()
      .add(margin, "minutes")
      .isAfter(expMoment);
    let _token = token;
    if (tokenExpiredWithMargin) {
      // Add a new token for response to the client
      const newToken = await generateAuthToken(user._id, _token);
      res.header("x-auth-token", newToken);
      _token = newToken;
    }
    req.authToken = _token;

    // Set the user last active
    const userId = _user._id;
    await User.updateOne({ _id: userId }, { lastActive: Date.now() });

    // Call the next middleware
    next();
  } catch (err) {
    return throwError(res, "Unauthorized request, bad token.");
  }
};

// Only runs the middleware if there is a token in the header
const conditionallyRunMiddleware = async (req, res, next) => {
  next();
};

const runMiddleware = (required = true) => {
  if (required) {
    // Ensure that the authenticate middleware is ran irrespective of the circumstance
    return authenticateMiddleware;
  } else {
    // Conditionally run the middleware, checking if token is set in the header before moving to the next middleware
    return conditionallyRunMiddleware;
  }
};

module.exports = runMiddleware;
