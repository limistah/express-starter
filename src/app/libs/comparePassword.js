const bcrypt = require("bcrypt");

module.exports = async (plain, encrypted) => await bcrypt.compare(plain, encrypted);
