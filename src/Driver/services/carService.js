const supabase = require("../../config/supabase");

async function getAllCars() {
  const { data, error } = await supabase.from("cars").select("*");
  if (error) throw error;
  return data;
}

async function getBookings(id_type_car) {
  let query = supabase.from("booking").select("*");

  if (id_type_car) {
    query = query.eq("id_type_car", id_type_car);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

module.exports = { getAllCars, getBookings };