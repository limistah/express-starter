// App Crons
const test = require("./test");

module.exports = () => {
  const crons = [test];

  // Initialize the middlewares
  for (let i = 0; i < crons.length; i++) {
    const cron = crons[i];
    if (typeof cron == "function") {
      cron();
    }
  }
};
