const express = require("express");
const { register, login, decodeJwt } = require("../controllers/authController");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/decode", decodeJwt);
module.exports = router;
