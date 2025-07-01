const supabase = require("../../config/supabase");

async function getAllCars() {
  const { data, error } = await supabase.from("cars").select("*");
  if (error) throw error;
  return data;
}

module.exports = { getAllCars };