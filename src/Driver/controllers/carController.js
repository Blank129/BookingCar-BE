const { getAllCars } = require("../services/carService");

const getCars = async (req, res) => {
  try {
    const cars = await getAllCars();
    res.status(200).json({ cars });
  } catch (error) {
    res.status(500).json({ error: error.message || "Không lấy được danh sách xe" });
  }
};

module.exports = { getCars };
