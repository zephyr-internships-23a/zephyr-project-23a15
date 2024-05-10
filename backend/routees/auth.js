const express = require("express");
const {
  sendVerification,
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");
const router = express.Router();
router.post("/sendverification", sendVerification);
router.post("/signup", signup);
router.post("/login", login);
router.post("/verifyemail", verifyEmail);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
module.exports = router;
