require("./libs/envConfig");
const config = require("config");
const createApp = require("./app");
const createSocket = require("./socket");
const mongodb = require("./libs/mongodb");
const { crons } = require("./queues");

const chalk = require("chalk");
const logger = require("./libs/logger");

// Bootstrap the application
const app = createApp();

// Connect to database
mongodb(app);

const PORT = config.get("port");
const APP_NAME = config.get("appName");

// Connect to socket
const server = require("http").Server(app);
app.io = createSocket(server);

// Listen for requests
app.listen(PORT, async () => {
  //==========================================================================//
  //========================== Console Visuals ===============================//
  //==========================================================================//
  const appName = chalk.magenta(APP_NAME);
  const mark = chalk.green("✓");
  const url = chalk.blue(`http://localhost:${PORT}`);
  const env = chalk.yellow(process.env.NODE_ENV);
  process.env.API_ADDRESS = `http://localhost:${PORT}`;
  if (process.env.NODE_ENV != "test") {
    console.log(chalk.bold(`${mark} ${appName} is running at ${url} in ${env} mode`));
    console.log(chalk.blue.bold("✗ Press CTRL-C to stop\n"));
  }

  logger.info("Application is running");
  crons();
});
