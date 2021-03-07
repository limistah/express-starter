const dotenv = require("dotenv");

// Setup Environment Variables
dotenv.config();
const mongoose = require("mongoose");

const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require("@casl/mongoose");

mongoose.plugin(accessibleRecordsPlugin);
mongoose.plugin(accessibleFieldsPlugin);
