const { getBookingsByUser } = require("../services/carService");

const getBookingsUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const bookings = await getBookingsByUser(id_user);

    if (bookings.length === 0) {
      return res.status(201).json({ message: "Không có booking nào" });
    }
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBookingsUser };
