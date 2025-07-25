const supabase = require("../../config/supabase");
const cloudinary = require("../../config/cloudinary");
async function getBookingsByUser(id_user) {
    try {
    const { data, error } = await supabase
      .from("booking")
      .select("*, drivers (name, phone, email, plate_license)") 
      .eq("id_user", id_user)
      .not("id_driver", "is", null) 
      .eq("id_status_booking", 1); 

    // Kiểm tra lỗi
    if (error) {
      throw new Error(error.message);
    }

    return data; 
  } catch (err) {
    throw new Error(`Không thể lấy dữ liệu: ${err.message}`);
  }
}
async function getProfileUser(id_user) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, phone, email, avatar, created_at")
      .eq("id", id_user)
      .single();

      if(!data) {
        throw new Error('Không tìm thấy id_user');
      }

      return data;
  } catch (error) {
    throw new Error(`Không thể lấy dữ liệu: ${error.message}`);
  }
}

async function updateUser(id_user, updatedInfo) {
  const { data, error } = await supabase
    .from('users')
    .update(updatedInfo)
    .eq('id', id_user)
    .single();

  if (error) {
    throw new Error(`Không thể cập nhật thông tin người dùng: ${error.message}`);
  }

  return data;
}

async function uploadAvatar(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'avatars', 
      transformation: [
        { width: 200, height: 200, crop: 'thumb' },
      ],
    });

    return result.secure_url; 
  } catch (error) {
    throw new Error('Không thể tải ảnh lên Cloudinary: ' + error.message);
  }
}

module.exports = { getBookingsByUser, getProfileUser, updateUser, uploadAvatar };
