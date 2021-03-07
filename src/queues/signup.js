const queue = require("./q");
const config = require("config");
const mailer = require("../libs/mailer");

const NAMES = {
  signupSuccess: "USER_SIGNUP_SUCCESS"
};

const CONCURRENCY = config.get("queueConcurrency");

// Send notification to all site users except the poster about the new category
queue.process(NAMES.signupSuccess, CONCURRENCY, async (job, done) => {
  const { user } = job.data;
  console.log(`Send ${user.email} an email about successful registration`);
  mailer.userRegistered(user);
  done();
});

module.exports = (user = { email: "", id: "", _id: "" }) => {
  queue.add(NAMES.signupSuccess, { user });
};
