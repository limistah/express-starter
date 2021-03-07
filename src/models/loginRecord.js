const Joi = require("joi");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const authTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    },
    userAgent: {
      type: String,
      required: true,
      set(d) {
        return JSON.stringify(d);
      },
      get(d) {
        return JSON.parse(d);
      }
    },
    userIp: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    usePushEach: true
  }
);

const LoginRecord = mongoose.model("LoginRecord", authTokenSchema);

function validateLoginRecord(loginRecord) {
  const schema = {
    userId: Joi.objectId().required(),
    userAgent: Joi.string().required(),
    userIp: Joi.string().required()
  };

  return Joi.validate(authToken, schema);
}

exports.LoginRecord = LoginRecord;
exports.validate = validateLoginRecord;
