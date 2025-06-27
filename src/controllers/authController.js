const {
  verifyGoogleToken,
  findOrCreateUser,
  registerUser,
  loginUser,
} = require("../services/authService");

const googleAuth = async (req, res) => {
  const { id_token } = req.body;

  try {
    const payload = await verifyGoogleToken(id_token);
    const { email, name, picture } = payload;

    const user = await findOrCreateUser(email, name, picture);
    res.status(200).json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    res.status(401).json({ message: "Xác thực thất bại", error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(200).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(400).json({ message: "Đăng ký thất bại", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.status(200).json({ message: 'Đăng nhập thành công', token, user });
  } catch (err) {
    res.status(401).json({ message: 'Đăng nhập thất bại', error: err.message });
  }
};

module.exports = { googleAuth, register, login };
