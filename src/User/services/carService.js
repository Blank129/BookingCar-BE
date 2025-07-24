const supabase = require("../../config/supabase");
async function getBookingsByUser(id_user) {
    try {
    const { data, error } = await supabase
      .from("booking")
      .select("*, drivers (name, phone, email, plate_license)") 
      .eq("id_user", id_user)
      .not("id_driver", "is", null) 
      .eq("id_status_booking", 1); 

    // Kiểm tra lỗi
    if (error) {
      throw new Error(error.message);
    }

    return data; 
  } catch (err) {
    throw new Error(`Không thể lấy dữ liệu: ${err.message}`);
  }
}

module.exports = { getBookingsByUser };
