const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const mapRoutes = require("./routes/mapRoute");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

//Đăng ký, Đăng nhập
app.use("/api/auth",authRoutes);

//Lấy tuyến đường
app.use("/api/route", mapRoutes);

module.exports = app;
