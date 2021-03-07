const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const suspensionTimeUnits = config.get("userSuspensionTimeUnits");
const userStatuses = config.get("userStatuses");
const userRoles = config.get("userRoles");
const moment = require("moment");
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    fName: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    lName: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    phoneNumber: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    imgUrl: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    lowerCaseDisplayName: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    roles: [
      {
        type: String,
        required: true
      }
    ],
    email: {
      type: String,
      lowercase: true,
      unique: true,
      minlength: 5,
      maxlength: 50
    },
    emailToken: {
      type: String
    },
    emailTokenExpires: Date,
    emailConfirmed: {
      type: Boolean,
      default: false
    },
    newEmail: String,
    emailConfirmedAt: {
      type: Date
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 60
    },
    passwordResetToken: {
      type: String
    },
    passwordResetTokenExpires: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    lastActive: {
      type: Date
    },
    deletedAt: {
      type: Number,
      default: -1
    },
    status: {
      type: String,
      enum: userStatuses,
      default: "Active"
    },
    suspensionExpires: {
      type: Date
    },
    loginCount: Number,
    online: Boolean
  },
  {
    timestamps: true,
    usePushEach: true,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

userSchema.virtual("currentAge").get(function() {
  if (this.dateOfBirth) {
    let age = moment().diff(this.dateOfBirth, "years");
    return age;
  }
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .required(),
    lowerCaseDisplayName: Joi.string()
      .min(3)
      .max(50),
    roles: Joi.array().valid(userRoles),
    email: Joi.string()
      .email()
      .required(),
    newEmail: Joi.string()
      .email()
      .optional(),
    emailToken: Joi.string()
      .min(15)
      .max(20)
      .optional(),
    emailTokenExpires: Joi.string().optional(),
    displayName: Joi.string().optional(),
    emailConfirmed: Joi.boolean(),
    emailConfirmedAt: Joi.date().optional(),
    password: Joi.string()
      .min(5)
      .max(60)
      .required(),
    passwordResetToken: Joi.string()
      .min(15)
      .max(20)
      .optional(),
    passwordResetTokenExpires: Joi.date().optional(),
    status: Joi.string().valid(userStatuses),
    suspensionExpires: Joi.date().optional(),
    suspendedFor: Joi.object({
      value: Joi.number().required(),
      unit: Joi.string()
        .valid(suspensionTimeUnits)
        .required()
    }).optional(),
    online: Joi.boolean().optional(),
    deletedAt: Joi.number().default(-1),
    loginCount: Joi.number().default(0),
    lastActive: Joi.date(),
    createdAt: Joi.date()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
