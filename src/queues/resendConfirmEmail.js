const queue = require("./q");
const config = require("config");
const mailer = require("../libs/mailer");

const NAMES = {
  resendConfirmEmail: "RESEND_CONFIRM_EMAIL"
};

const CONCURRENCY = config.get("queueConcurrency");

// Send notification to all site users except the poster about the new category
queue.process(NAMES.resendConfirmEmail, CONCURRENCY, async (job, done) => {
  const { user } = job.data;
  console.log(`ReSend ${user.email} confirmation email`);
  mailer.userResendConfirmation(user);
  done();
});

module.exports = (user = { email: "", id: "", _id: "" }) => {
  queue.add(NAMES.resendConfirmEmail, { user });
};
