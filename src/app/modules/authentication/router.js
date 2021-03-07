const {
  postConfirmToken,
  postResendToken,
  postForgotPassword,
  patchForgotPassword,
  postLogin
} = require("./controller");
const {
  postConfirmTokenValidation,
  postResendTokenValidation,
  postForgotPasswordValidation,
  patchUpdatePasswordValidation,
  postLoginValidation
} = require("./validation");
const { authenticate, authorize, handleValidation } = require("../../middlewares");

const { Router } = require("express");

const router = Router();

router.post(
  "",
  [authenticate(false), authorize()],
  [postLoginValidation, handleValidation()],
  postLogin
);

router.post(
  "/confirm-token",
  [authenticate(false), authorize()],
  [postConfirmTokenValidation, handleValidation()],
  postConfirmToken
);

router.post(
  "/resend-token",
  [authenticate(false), authorize()],
  [postResendTokenValidation, handleValidation()],
  postResendToken
);

router.post(
  "/forgot",
  [authenticate(false), authorize()],
  postForgotPasswordValidation,
  handleValidation(),
  postForgotPassword
);

router.patch(
  "/forgot",
  [authenticate(false), authorize()],
  [patchUpdatePasswordValidation, handleValidation()],
  patchForgotPassword
);

module.exports = router;
