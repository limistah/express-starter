const EventEmitter = require("events");

// Update event emitter default listeners
// to accommodate for more socketListeners to be run simultaneously

EventEmitter.defaultMaxListeners = 120;

const Bull = require("bull");
const config = require("config");

const REDIS_URI = config.get("redisURI");
module.exports = new Bull("appQueues", {
  redis: REDIS_URI
});
