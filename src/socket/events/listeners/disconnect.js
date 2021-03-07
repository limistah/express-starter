const { User } = require("./../../../models/user");
const userManager = require("./../../userManager");
const moment = require("moment");
const logger = require("../../../libs/logger");

const disconnectListener = (io, _client) => {
  const socketId = _client.id;
  _client.on("disconnect", async () => {
    // const socketUser = userManager.getUser(socketId);
    // Set the user online status to false
    const clientUserId = _client.user._id;
    const user = await User.findByIdAndUpdate(
      clientUserId,
      { online: false },
      { new: true }
    ).select("_id" + " username displayName online");

    // Remove the user from the manager
    userManager.removeUser(clientUserId);
    const time = moment().toISOString();
    logger.info(`"${user.username}":"${socketId}":"DISCONNECTED" at ${time}`);
  });
};

module.exports = disconnectListener;
