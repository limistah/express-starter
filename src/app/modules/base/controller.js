const config = require("config");
const { success } = require("../../libs/response");
const { logIndexRequest } = require("../../../queues");
const getBase = async (req, res, next) => {
  try {
    logIndexRequest();
    return res.status(200).json(
      success(
        {
          status: "online",
          version: config.get("projectVersion"),
          name: config.get("appName")
        },
        200
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getBase };
