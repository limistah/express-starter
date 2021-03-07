const tokenLength = require("config").get("confirmTokenLength");
const cryptoRandomString = require("crypto-random-string");

module.exports = () => cryptoRandomString(tokenLength);
