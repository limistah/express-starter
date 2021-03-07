const chalk = require("chalk");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function(app) {
  const URI = config.get("mongoURI");

  //mongoose.set('debug', true);
  mongoose.Promise = global.Promise;
  return mongoose
    .connect(URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(({ connection }) => {
      if (process.env.NODE_ENV != "test") {
        console.log(
          chalk.magenta(
            `connected to "${connection.name}" database at ${connection.host}:${connection.port}`
          )
        );
      }
      return connection;
    })
    .catch((error) => {
      console.log(
        "%s MongoDB connection error. Please make sure MongoDB is running.",
        chalk.red("✗")
      );
      // eslint-disable-next-line no-console
      console.log(error);

      process.exit(1);
    });
};
