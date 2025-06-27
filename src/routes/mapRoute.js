const express = require("express");
const { getRoute } = require("../controllers/mapController");

const router = express.Router();

router.post("/map", getRoute);

module.exports = router;
