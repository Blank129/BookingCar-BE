const supabase = require("../../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerDriver({ name, phone, id_type_car, drive_license_number, plate_license, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("drivers")
    .insert([
      {
        name,
        phone,
        id_type_car,
        drive_license_number,
        plate_license,
        email,
        password: hashedPassword,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function loginDriver({ email, password }) {
  const { data: user, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw new Error("Email không tồn tại");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Sai mật khẩu");

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, avatar: user.avatar, phone: user.phone, id_type_car: user.id_type_car, drive_license_number: user.drive_license_number, plate_license: user.plate_license },
    process.env.JWT_SECRET,
    // {
    //   expiresIn: "1d",
    // }
  );

  return { token, user };
}
module.exports = { registerDriver, loginDriver };
