const express = require("express");
const { getBookingsUser, getUserProfile, updateUserProfile } = require("../controllers/carController");
const router = express.Router();

router.get("/bookings/:id_user", getBookingsUser);
router.get("/profile/:id_user", getUserProfile);
router.put("/profile/:id_user", updateUserProfile); 
module.exports = router;