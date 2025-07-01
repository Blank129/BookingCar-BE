const { OAuth2Client } = require("google-auth-library");
const supabase = require("../../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(id_token) {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload;
}

async function findOrCreateUser(email, name, picture) {
  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  if (existingUser) return existingUser;

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ email, name, avatar: picture }])
    .select()
    .single();

  if (insertError) throw insertError;
  return newUser;
}

async function registerUser({ name, phone, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        phone,
        email,
        password: hashedPassword,
        avatar: "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function loginUser({ email, password }) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw new Error("Email không tồn tại");

  console.log("user", user);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Sai mật khẩu");

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, avatar: user.avatar, phone: user.phone },
    process.env.JWT_SECRET,
    // {
    //   expiresIn: "1d",
    // }
  );

  return { token, user };
}
module.exports = { verifyGoogleToken, findOrCreateUser, registerUser, loginUser };
