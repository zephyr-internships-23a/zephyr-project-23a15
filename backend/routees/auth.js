const express = require("express");
const {
  sendVerification,
  signup,
  login,
  verifyEmail,
} = require("../controller/auth.controller");
const router = express.Router();
router.post("/sendverification", sendVerification);
router.post("/signup", signup);
router.post("/login", login);
router.post("/verifyemail", verifyEmail);
module.exports = router;
