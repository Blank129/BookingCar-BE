const express = require("express");
const { googleAuth, register, login, decodeJwt } = require("../controllers/authController");

const router = express.Router();

router.post("/google", googleAuth);
router.post("/register", register);
router.post("/login", login);
router.post("/decode", decodeJwt);
module.exports = router;
