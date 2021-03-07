const Joi = require("joi");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const authTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true
    },
    tokens: [
      {
        type: String,
        required: true
      }
    ],
    published: Boolean
  },
  {
    timestamps: true,
    usePushEach: true
  }
);

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

function validateAuthToken(authToken) {
  const schema = {
    userId: Joi.objectId().required(),
    tokens: Joi.array().required()
  };

  return Joi.validate(authToken, schema);
}

exports.AuthToken = AuthToken;
exports.validate = validateAuthToken;
