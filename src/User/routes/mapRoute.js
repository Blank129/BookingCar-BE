const express = require("express");
const { getRoute, getRouteDistance, booking } = require("../controllers/mapController");

const router = express.Router();

router.post("/path", getRoute);
router.post("/distance", getRouteDistance);
router.post("/booking", booking);

module.exports = router;
