const eventNames = require("../eventNames");

const userConnectedEvent = (io, socket, eventId = Date.now()) => {
  const data = {
    eventName: eventNames.EMIT_DUAL_CONNECTED,
    socketId: socket.id,
    eventId
  };
  socket.emit(data.eventName, data);
};

module.exports = userConnectedEvent;
