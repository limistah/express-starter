const queue = require("../q");
const config = require("config");

const NAMES = {
  testCron: "TEST_CRON"
};

const CONCURRENCY = config.get("queueConcurrency");

queue.process(NAMES.testCron, CONCURRENCY, async (job, done) => {
  console.log("Test Cron Active %s");
  done();
});

const testCron = () => {
  queue.add(NAMES.testCron, {
    repeat: { cron: config.get("testCronTime") }
  });
};

module.exports = testCron;
