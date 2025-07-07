const express = require("express");
const { getCars, updateDriverStatus, getBooking } = require("../controllers/carController");

const router = express.Router();

router.get("/cars", getCars);
router.post("/status", updateDriverStatus);
router.get("/bookings/:id_type_car", getBooking);

module.exports = router;
