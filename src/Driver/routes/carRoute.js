const express = require("express");
const { getCars, updateDriverStatus, getBooking, approveBooking, statusSecondController, statusThirdController, statusFourthController, statusFifthController } = require("../controllers/carController");

const router = express.Router();

router.get("/cars", getCars);
router.post("/status", updateDriverStatus);
router.get("/bookings/:id_type_car", getBooking);
router.post("/approve", approveBooking);
router.post("/status-second/:id_booking", statusSecondController);
router.post("/status-third/:id_booking", statusThirdController);
router.post("/status-fourth/:id_booking", statusFourthController);
router.post("/status-fifth/:id_booking", statusFifthController);
module.exports = router;
