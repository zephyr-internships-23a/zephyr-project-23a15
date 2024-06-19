const express = require("express");
const { userInfo, updateUser } = require("../controller/user.controller");
const { isAuth } = require("../middleware");

const router = express.Router();
router.get("/info", isAuth, userInfo);
router.post("/update", isAuth, updateUser);
module.exports = router;
