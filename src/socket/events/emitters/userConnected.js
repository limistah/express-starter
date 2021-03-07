const eventNames = require("../eventNames");
const emitNewUserConnected = require("./newUserConnected");

const userConnectedEvent = (io, socket, user = {}, eventId = Date.now()) => {
  const data = {
    eventName: eventNames.EMIT_USER_CONNECTED,
    data: user,
    socketId: socket.id,
    eventId
  };
  // Tell the current user that they have been connected
  socket.emit(data.eventName, data);
  // Tell other connected users that new user have been connected
  emitNewUserConnected(io, socket, user);
};

module.exports = userConnectedEvent;
