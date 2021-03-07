module.exports = {
  // LISTENERS
  // Other users would be told about the new user
  ON_NEW_USER_CONNECTED: "client::newUserConnected",
  // Current user have been connected successfully
  ON_USER_CONNECTED: "client::connected",

  // EMITTERS
  EMIT_NEW_CONNECTION: "server::newConnection",
  EMIT_USER_CONNECTED: "server::connected",
  EMIT_DUAL_CONNECTED: "server::userDualConnected"
};
