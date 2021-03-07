const disconnect = require("./disconnect");

module.exports = (io, socket) => {
  const listeners = [packetValidate, disconnect];

  listeners.forEach((listener) => {
    listener(io, socket);
  });
};
