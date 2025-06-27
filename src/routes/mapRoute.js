const express = require("express");
const { getRoute, getRouteDistance } = require("../controllers/mapController");

const router = express.Router();

router.post("/path", getRoute);
router.post("/distance", getRouteDistance);

module.exports = router;
