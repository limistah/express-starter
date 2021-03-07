const queue = require("./q");
const config = require("config");
const mailer = require("../libs/mailer");
const logger = require("../libs/logger");

const NAMES = {
  sendPasswordUpdate: "SEND_PASSWORD_UPDATE_EMAIL"
};

const CONCURRENCY = config.get("queueConcurrency");

// Send notification to all site users except the poster about the new category
queue.process(NAMES.sendPasswordUpdate, CONCURRENCY, async (job, done) => {
  const { user } = job.data;
  logger.info(`Password Updated ${user.email}`);
  mailer.sendPasswordUpdate(user);
  done();
});

module.exports = (user = { email: "" }) => {
  queue.add(NAMES.sendPasswordUpdate, { user });
};
