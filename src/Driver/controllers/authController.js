const { registerDriver, loginDriver } = require("../services/authService");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const user = await registerDriver(req.body);
    res.status(200).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(400).json({ message: "Đăng ký thất bại", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { token, user } = await loginDriver(req.body);
    res.status(200).json({ message: 'Đăng nhập thành công', token, user });
  } catch (err) {
    res.status(400).json({ message: 'Đăng nhập thất bại', error: err.message });
  }
};

const decodeJwt = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Thiếu token" });
  }

  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      return res.status(400).json({ error: "Token không hợp lệ" });
    }

    res.status(200).json({
      user: decoded.payload,
    });
  } catch (err) {
    res.status(500).json({ error: "Không thể decode token", detail: err.message });
  }
};

module.exports = { register, login, decodeJwt };