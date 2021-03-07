const queue = require("./q");
const config = require("config");

const NAMES = {
  indexRequests: "INDEX_REQUESTS"
};

const CONCURRENCY = config.get("queueConcurrency");

// Send notification to all site users except the poster about the new category
queue.process(NAMES.indexRequests, CONCURRENCY, async (job, done) => {
  console.log("Index Requested");
  done();
});

module.exports = () => {
  queue.add(NAMES.indexRequests);
};
