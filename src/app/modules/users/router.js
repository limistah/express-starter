const { postUser } = require("./controller");
const { postUserValidation } = require("./validation");
const { authenticate, authorize, handleValidation } = require("../../middlewares");

const { Router } = require("express");

const router = Router();

router.post("", authenticate(false), authorize(), postUserValidation, handleValidation(), postUser);

module.exports = router;
