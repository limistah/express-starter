const config = require("config");

const EMAIL = config.get("devEmail");

module.exports = (error) => {
  console.log(`Sent an email to: ${EMAIL} containing ${JSON.stringify(error)}`);
};
