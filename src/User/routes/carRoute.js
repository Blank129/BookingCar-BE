const express = require("express");
const { getBookingsUser } = require("../controllers/carController");
const router = express.Router();

router.get("/bookings/:id_user", getBookingsUser);
module.exports = router;