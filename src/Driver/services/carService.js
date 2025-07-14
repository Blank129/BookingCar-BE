const supabase = require("../../config/supabase");

async function getAllCars() {
  const { data, error } = await supabase.from("cars").select("*");
  if (error) throw error;
  return data;
}

async function getBookings(id_type_car) {
  let query = supabase
    .from("booking")
    .select(`
      *,
      users (
        name
      )
    `);

  if (id_type_car) {
    query = query.eq("id_type_car", id_type_car);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
async function postApproveBooking(id_booking, id_driver) {
  if (!id_booking || !id_driver) {
    throw new Error("Thiếu id_booking hoặc id_driver");
  }

  const { data: existingBookings, error: fetchError } = await supabase
    .from("booking")
    .select("id_driver")
    .eq("id", id_booking);

  if (fetchError) throw new Error("Lỗi Supabase khi kiểm tra: " + fetchError.message);
  if (!existingBookings || existingBookings.length === 0) {
    throw new Error("Không tìm thấy bản ghi booking");
  }

  const existingBooking = existingBookings[0];
  if (existingBooking.id_driver) {
    return { alreadyAssigned: true };
  }

  const { data, error } = await supabase
    .from("booking")
    .update({ 
      id_driver,
      id_status_booking: 1
    })
    .eq("id", id_booking)
    .select();

  if (error) throw new Error("Lỗi Supabase khi cập nhật: " + error.message);
  if (!data || data.length === 0) throw new Error("Không tìm thấy bản ghi booking sau khi cập nhật");

  return { booking: data[0] };
}


module.exports = { getAllCars, getBookings, postApproveBooking };