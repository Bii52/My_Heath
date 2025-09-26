const verifyMedicine = async (code) => {
  // Trong một ứng dụng thực tế, đây sẽ là nơi bạn truy vấn cơ sở dữ liệu
  // (ví dụ: MongoDB) hoặc gọi một API bên ngoài để lấy thông tin thuốc.
  // Hiện tại, chúng ta sẽ giữ dữ liệu mô phỏng.

  const realDatabase = {
    '123456789': {
      name: 'Thuốc A (Paracetamol)',
      manufacturer: 'Công ty Dược phẩm X',
      expirationDate: '2025-12-31',
      isAuthentic: true,
      description: 'Giảm đau, hạ sốt.',
      dosage: 'Người lớn: 1-2 viên/lần, 2-3 lần/ngày.',
    },
    '987654321': {
      name: 'Thuốc B (Vitamin C)',
      manufacturer: 'Công ty Dược phẩm Y',
      expirationDate: '2024-06-15',
      isAuthentic: true,
      description: 'Bổ sung Vitamin C, tăng cường sức đề kháng.',
      dosage: 'Người lớn: 1 viên/ngày.',
    },
    '112233445': {
      name: 'Thuốc C (Kháng sinh)',
      manufacturer: 'Công ty Dược phẩm Z',
      expirationDate: '2023-01-20', // Ví dụ thuốc hết hạn
      isAuthentic: true,
      description: 'Điều trị nhiễm khuẩn.',
      dosage: 'Theo chỉ định của bác sĩ.',
    },
    'FAKE001': {
      name: 'Thuốc Giả D',
      manufacturer: 'Không rõ',
      expirationDate: '2026-01-01',
      isAuthentic: false, // Ví dụ thuốc giả
      description: 'Sản phẩm không rõ nguồn gốc, không nên sử dụng.',
      dosage: 'Không sử dụng.',
    },
  };

  return realDatabase[code] || null; // Trả về null nếu không tìm thấy
};

export default {
  verifyMedicine,
};