const express = require("express");
const { googleAuth, register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/google", googleAuth);
router.post("/register", register);
router.post("/login", login);
module.exports = router;
