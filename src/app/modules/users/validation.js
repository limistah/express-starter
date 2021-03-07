const { check } = require("express-validator/check");

exports.postUserValidation = [
  check("lName")
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim(),
  check("fName")
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim(),
  check("displayName")
    .isString()
    .matches(/^[a-zA-Z0-9_]+$/, "i")
    .withMessage("Username must be alphanumeric, and can contain underscores")
    .isLength({ min: 3, max: 20 })
    .optional(),
  check("email")
    .isEmail()
    .trim(),
  check("phoneNumber").isMobilePhone(),
  check("imgUrl").isURL()
];
