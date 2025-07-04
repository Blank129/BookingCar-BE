const express = require("express");
const { getCars, updateDriverStatus } = require("../controllers/carController");

const router = express.Router();

router.get("/cars", getCars);
router.post("/status", updateDriverStatus);

module.exports = router;
