const { check } = require("express-validator/check");

exports.postConfirmTokenValidation = [
  check("email")
    .isEmail()
    .trim(),
  check("token")
    .isString()
    .isAlphanumeric()
    .isLength({ min: 3, max: 10 })
    .trim()
];

exports.postResendTokenValidation = [
  check("email")
    .isEmail()
    .trim()
];

exports.postForgotPasswordValidation = [
  check("email")
    .isEmail()
    .trim()
];

exports.patchUpdatePasswordValidation = [
  check("email")
    .isEmail()
    .trim(),
  check("token")
    .isString()
    .isAlphanumeric()
    .isLength({ min: 3, max: 10 })
    .trim(),
  check("password")
    .isString()
    .isAlphanumeric()
    .isLength({ min: 5 })
    .trim()
];

exports.postLoginValidation = [
  check("email")
    .isEmail()
    .trim(),
  check("password")
    .isString()
    .isAlphanumeric()
    .isLength({ min: 5 })
    .trim(),

  check("lName")
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim()
    .optional(),
  check("fName")
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim()
    .optional(),
  check("displayName")
    .isString()
    .matches(/^[a-zA-Z0-9_]+$/, "i")
    .withMessage("Username must be alphanumeric, and can contain underscores")
    .isLength({ min: 3, max: 20 })
    .optional()
    .optional(),

  check("phoneNumber")
    .isMobilePhone()
    .optional(),
  check("imgUrl")
    .isURL()
    .optional()
];
