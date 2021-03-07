const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { AuthToken } = require("../../models/authToken");

const generateAuthToken = async function(userId, oldToken, expiresIn = "1 Day") {
  const user = await User.findById(userId).populate("role accountType", "_id name");
  if (!user) {
    return false;
  }
  const options = {
    expiresIn
  };
  const payload = {
    _id: user._id,
    roles: user.roles
    // accountType: { name: user.accountType.name, _id: user.accountType._id }
  };
  const token = jwt.sign(payload, config.get("jwtSecretKey"), options);
  // We don't want to duplicate and throw error unintentionally
  let authToken = await AuthToken.findOne({ userId: user._id }).exec();
  // Add the user record with the token to the auth token token db, for future access
  if (!authToken) {
    authToken = new AuthToken({ userId: user._id, tokens: [token] });
    authToken.save();
  } else {
    // Push the newly generated token into the found user token records.
    authToken.tokens.push(token);
    authToken.save();
  }
  if (oldToken) {
    // Remove old token
    AuthToken.updateOne({ userId: user._id }, { $pullAll: { tokens: [oldToken] } });
  }
  return token;
};

const verifyAuthToken = async (token, ignoreExpiration) => {
  // Handles invalid token
  try {
    return jwt.verify(token, config.get("jwtSecretKey"), {
      ignoreExpiration
    });
  } catch (err) {
    return false;
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token, config.get("jwtSecretKey"));
  } catch (e) {
    return false;
  }
};

const clearAuthToken = async (userId) => {
  // Remove old token
  return AuthToken.updateOne({ userId }, { tokens: [] });
};
module.exports = {
  generateAuthToken,
  verifyAuthToken,
  decodeToken,
  clearAuthToken
};
