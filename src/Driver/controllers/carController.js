const { getAllCars, findNearbyDriver, getBookings } = require("../services/carService");
const supabase = require("../../config/supabase");

const getCars = async (req, res) => {
  try {
    const cars = await getAllCars();
    res.status(200).json({ data: cars });
  } catch (error) {
    res.status(500).json({ error: error.message || "Không lấy được danh sách xe" });
  }
};

const updateDriverStatus = async (req, res) => {
  const { driver_id, is_online, lat, lng } = req.body;

  if (!driver_id || typeof is_online !== 'boolean') {
    return res.status(400).json({ message: 'Thiếu thông tin driver_id hoặc is_online' });
  }

  const updates = {
    status: is_online ? 'online' : 'offline',
  };

  if (is_online && lat && lng) {
    const location = `${lat},${lng}`; // Lưu dưới dạng text
    updates.location = location;
  }

  // Cập nhật dữ liệu vào cơ sở dữ liệu
  const { data, error } = await supabase
    .from('drivers')
    .update(updates)
    .eq('id', driver_id);

  if (error) {
    console.error("Lỗi cập nhật:", error);
    return res.status(500).json({ message: 'Cập nhật thất bại', error });
  }

  return res.status(200).json({ message: 'Cập nhật thành công', status: updates.status });
};

const getBooking = async (req, res) => {
  try {
    const { id_type_car } = req.params; 
    const data = await getBookings(id_type_car);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message || "Không lấy được danh sách bookings" });
  }
};

module.exports = { getCars, updateDriverStatus, getBooking };
