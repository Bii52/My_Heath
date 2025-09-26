import medicineService from '../services/medicine.service.js';

const verifyMedicine = async (req, res, next) => { // Thêm 'next' để chuyển lỗi cho middleware xử lý lỗi
  const { code } = req.body;

  try {
    const medicine = await medicineService.verifyMedicine(code);

    if (medicine) {
      // Trả về dữ liệu có cấu trúc thay vì một chuỗi ghép nối
      res.status(200).json({
        message: 'Xác minh thuốc thành công.',
        data: medicine, // Trả về toàn bộ đối tượng thuốc
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy thông tin thuốc hoặc mã không hợp lệ.' });
    }
  } catch (error) {
    // Chuyển lỗi cho middleware xử lý lỗi chung
    next(error);
  }
};

export default {
  verifyMedicine,
};