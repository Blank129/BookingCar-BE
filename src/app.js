const express = require("express");
const cors = require("cors");
const authRoutes = require("./User/routes/authRoute");
const mapRoutes = require("./User/routes/mapRoute");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

//Đăng ký, Đăng nhập
app.use("/api/user/auth",authRoutes);

//Lấy tuyến đường
app.use("/api/user/route", mapRoutes);

module.exports = app;
