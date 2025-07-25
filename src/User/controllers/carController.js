const req = require("express/lib/request");
const { getBookingsByUser, getProfileUser, uploadAvatar, updateUser } = require("../services/carService");
const cloudinary = require('cloudinary').v2;

const getBookingsUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const bookings = await getBookingsByUser(id_user);

    if (bookings.length === 0) {
      return res.status(201).json({ message: "Không có booking nào" });
    }
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserProfile = async (req, res) => {
  const { id_user} = req.params;
  try {
    const data = await getProfileUser(id_user);

    if(!data) {
      return res.status(404).json({ message: "Không tìm thấy id user" });
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUserProfile(req, res) {
  const { id_user } = req.params;
  const { name, phone, email, avatar } = req.body;

  try {
    const user = await getProfileUser(id_user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng với id_user này',
      });
    }

    let avatarUrl = user.avatar; 

    if (avatar) {
      const uploadedAvatarUrl = await uploadAvatar(avatar); 
      avatarUrl = uploadedAvatarUrl; 
    }

    const updatedUser = await updateUser(id_user, {
      name,
      phone,
      email,
      avatar: avatarUrl,
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Có lỗi xảy ra khi cập nhật thông tin người dùng',
    });
  }
}

module.exports = { getBookingsUser, getUserProfile, updateUserProfile };
