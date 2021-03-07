const { getBase } = require("./controller");
const { authenticate, authorize } = require("../../middlewares");

const { Router } = require("express");

const router = Router();

router.get("", authenticate(false), authorize(), getBase);

module.exports = router;
