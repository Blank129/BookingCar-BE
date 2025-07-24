const express = require("express");
const cors = require("cors");

const authRoutes = require("./User/routes/authRoute");
const mapRoutes = require("./User/routes/mapRoute");
const carsRoutes = require("./User/routes/carRoute");

const authDriversRoutes = require("./Driver/routes/authRoute");
const carsDrivesRoutes = require("./Driver/routes/carRoute");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

//---------------Route User-------------
//Đăng ký, Đăng nhập
app.use("/api/user/auth",authRoutes);

//Lấy tuyến đường
app.use("/api/user/route", mapRoutes);

//Cars
app.use("/api/user", carsRoutes);


//--------------Route Driver-----------------
//Đăng ký, Đăng nhập
app.use("/api/driver/auth", authDriversRoutes);

//Cars
app.use("/api/driver", carsDrivesRoutes);


module.exports = app;
