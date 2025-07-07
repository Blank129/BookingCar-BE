const supabase = require("../../config/supabase");

async function bookingCar({
  id_user,
  id_type_car,
  location_from,
  location_to,
  location_from_name,
  location_to_name,
  distance,
  total_price,
}) {
  const { data, error } = await supabase
    .from("booking")
    .insert([
      {
        id_user,
        id_type_car,
        location_from,
        location_to,
        location_from_name,
        location_to_name,
        distance,
        total_price,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { bookingCar };
