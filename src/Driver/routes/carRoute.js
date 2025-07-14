const express = require("express");
const { getCars, updateDriverStatus, getBooking, approveBooking } = require("../controllers/carController");

const router = express.Router();

router.get("/cars", getCars);
router.post("/status", updateDriverStatus);
router.get("/bookings/:id_type_car", getBooking);
router.post("/approve", approveBooking);

module.exports = router;
