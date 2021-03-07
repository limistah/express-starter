const socketIO = require("socket.io");
const events = require("./events");
const chalk = require("chalk");
const userManager = require("./userManager");

const init = (server) => {
  const io = socketIO(server);
  // io.adapter(redisAdapter);
  // Set User Manager IO Instance
  userManager.setIOInstance(io);
  // Initialize event listeners
  events(io);

  console.log(`${chalk.green("✓")} ${chalk.bold(chalk.gray(`Socket Initialized`))}`);

  return io;
};

module.exports = init;
