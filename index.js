require("dotenv").config();
const express = require("express");
const ngrok = require("ngrok");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const { createClient } = require("@supabase/supabase-js");
const { default: axios } = require("axios");

const app = express();
app.use(
  cors({
    origin: "*",
    //credentials: true,
  })
);
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.post("/api/auth/google", async (req, res) => {
  const { id_token } = req.body;
  console.log("Received ID Token:", req.body);

  try {
    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Token verified successfully");
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    console.log("User info:", { email, name, picture });
    // Check if user exists
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user:", error.message);
      throw error; // Để dừng và gửi thông báo lỗi
    }

    let user = existingUser;

    // Insert if not exists
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ email, name, avatar: picture }])
        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;
    }

    res.status(200).json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Xác thực thất bại", error: err.message });
  }
});

app.post("/api/route", async (req, res) => {
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({ error: "Thiếu pickup hoặc destination" });
  }

  try {
    const orsResponse = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [pickup.slice().reverse(), destination.slice().reverse()],
      },
      {
        headers: {
          Authorization: process.env.API_OSM,
          "Content-Type": "application/json",
        },
      }
    );

    const coords = orsResponse.data.features[0].geometry.coordinates.map(
      (coord) => [coord[1], coord[0]]
    );

    res.json({ coordinates: coords });
  } catch (err) {
    console.error("Lỗi từ ORS:", err.message);
    res.status(500).json({ error: "Không lấy được tuyến đường" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`App listening on http://localhost:${PORT}`);

  const url = await ngrok.connect(PORT);
  console.log(`Ngrok tunnel opened at: ${url}`);
});
