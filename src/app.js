const express = require("express");
const cors = require("cors");

const authRoutes = require("./User/routes/authRoute");
const mapRoutes = require("./User/routes/mapRoute");

const authDriversRoutes = require("./Driver/routes/authRoute");
const carsRoutes = require("./Driver/routes/carRoute");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

//---------------Route User-------------
//Đăng ký, Đăng nhập
app.use("/api/user/auth",authRoutes);

//Lấy tuyến đường
app.use("/api/user/route", mapRoutes);


//--------------Route Driver-----------------
//Đăng ký, Đăng nhập
app.use("/api/driver/auth", authDriversRoutes);

//Cars
app.use("/api/driver", carsRoutes);


module.exports = app;
