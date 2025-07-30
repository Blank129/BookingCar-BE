const { getAllCars, findNearbyDriver, getBookings, postApproveBooking, postStatusSecondSerivce, postStatusThirdSerivce, postStatusFourthSerivce, postStatusFifthSerivce } = require("../services/carService");
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
    const location = `${lat},${lng}`;
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

const approveBooking = async (req, res) => {
  const { id_booking, id_driver } = req.body;

  try {
    const result = await postApproveBooking(id_booking, id_driver);

    if (result.alreadyAssigned) {
      return res.status(201).json({ message: "Đã có tài xế nhận cuốc" });
    }

    return res.status(200).json({
      message: "Cập nhật id_driver thành công",
      booking: result.booking,
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


const statusSecondController = async (req, res) => {
  const {id_booking} = req.params;

  try {
    const result = await postStatusSecondSerivce(id_booking);
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    return res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Lỗi khi cập nhật trạng thái" }); 
  }
}

const statusThirdController = async (req, res) => {
  const {id_booking} = req.params;

  try {
    const result = await postStatusThirdSerivce(id_booking);
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    return res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Lỗi khi cập nhật trạng thái" }); 
  }
}

const statusFourthController = async (req, res) => {
  const {id_booking} = req.params;

  try {
    const result = await postStatusFourthSerivce(id_booking);
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    return res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Lỗi khi cập nhật trạng thái" }); 
  }
}

const statusFifthController = async (req, res) => {
  const {id_booking} = req.params;

  try {
    const result = await postStatusFifthSerivce(id_booking);
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    return res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Lỗi khi cập nhật trạng thái" }); 
  }
}


module.exports = { getCars, updateDriverStatus, getBooking, approveBooking, statusSecondController, statusThirdController, statusFourthController, statusFifthController };
