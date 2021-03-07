const queue = require("./q");
const config = require("config");
const mailer = require("../libs/mailer");

const NAMES = {
  sendPasswordReset: "SEND_PASSWORD_RESET_EMAIL"
};

const CONCURRENCY = config.get("queueConcurrency");

// Send notification to all site users except the poster about the new category
queue.process(NAMES.sendPasswordReset, CONCURRENCY, async (job, done) => {
  const { user } = job.data;
  console.log(`ReSend ${user.email} confirmation email`);
  mailer.sendPasswordReset(user);
  done();
});

module.exports = (user = { email: "", id: "", _id: "" }) => {
  queue.add(NAMES.sendPasswordReset, { user });
};
