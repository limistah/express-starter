const socketioJwt = require("socketio-jwt");
const config = require("config");
// !! https://github.com/auth0-community/socketio-jwt#example-usage
const jwtSecretKey = config.get("jwtSecretKey");
const userManager = require("./../userManager");
const { User } = require("./../../models/user");
const moment = require("moment");
const initListeners = require("./listeners");
const emitUserConnectedEvent = require("./emitters/userConnected");

const events = (io) => {
  // Authenticate the socket on connection, firstly!
  io.on(
    "connection",
    socketioJwt.authorize({
      secret: jwtSecretKey,
      // 15 seconds to send the authentication message
      timeout: 15000,
      // Delay server-side socket disconnect to wait for client-side callback
      callback: 15000
    })
  ).on("authenticated", async function(socket) {
    // Get the connected user;
    const user = await User.findByIdAndUpdate(
      socket.decoded_token._id,
      { online: true },
      { new: true }
    );
    if (user) {
      const socketId = socket.id;
      const userId = user._id.toString();
      // New Connection
      const userData = {
        _id: userId,
        username: user.username
      };
      socket.user = userData;
      // Add user to the user manager
      userManager.addUser(userId, socket);
      const time = moment().toISOString();
      console.log(`"${user.username}":"${socketId}":"CONNECTED" at ${time}`);

      // Tell other users that this user has joined the room
      emitUserConnectedEvent(io, socket, user);
      //this socket is authenticated, we are good to handle more events from it.
      initListeners(io, socket);
    }
  });

  return io;
};

module.exports = events;
