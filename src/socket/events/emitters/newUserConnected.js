const eventNames = require("../eventNames");
const roomNames = require("../../roomNames");

const newUserConnectedEvent = (io, socket, user = {}, eventId = Date.now()) => {
  const data = {
    eventName: eventNames.EMIT_NEW_USER_CONNECTED,
    data: user,
    socketId: socket.id,
    eventId
  };

  // sending to all clients in 'authUsers' room except sender
  socket.to(roomNames.authUsers).emit(data.eventName, data);
};

module.exports = newUserConnectedEvent;
