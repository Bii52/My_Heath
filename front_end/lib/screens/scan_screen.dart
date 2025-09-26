import 'dart:convert';
import 'dart:io'; // Import để kiểm tra nền tảng
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import '../components/camera_scanner.dart';

// URL cơ sở của API. Trong một ứng dụng thực tế, bạn nên đặt nó trong một tệp cấu hình.
final String baseUrl = Platform.isAndroid
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool _isVerifying = false;

  Future<void> _verifyCode(String code) async {
    if (_isVerifying) return; // Ngăn việc xác minh nhiều lần cùng lúc

    setState(() {
      _isVerifying = true;
    });

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/medicine/verify'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'code': code}),
      );

      // Kiểm tra widget có còn tồn tại trước khi sử dụng BuildContext
      if (!mounted) return;

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final medicineData = data['data']; // Truy cập trường 'data'
        if (medicineData != null) {
          // Định dạng thông báo để hiển thị
          final String resultMessage =
              '''
                Tên thuốc: ${medicineData['name']}
                NSX: ${medicineData['manufacturer']}
                Hạn dùng: ${medicineData['expirationDate']}
                Xác thực: ${medicineData['isAuthentic'] ? 'Thật' : 'Giả'}
                ${medicineData['description'] != null && medicineData['description'].isNotEmpty ? 'Mô tả: ${medicineData['description']}' : ''}
                ${medicineData['dosage'] != null && medicineData['dosage'].isNotEmpty ? 'Liều dùng: ${medicineData['dosage']}' : ''}
          '''
                  .trim(); // .trim() để loại bỏ khoảng trắng thừa
          _showResultDialog('Kết quả xác minh', resultMessage);
        } else {
          // Trường hợp dự phòng nếu trường 'data' bị thiếu hoặc null
          _showResultDialog(
            'Kết quả xác minh',
            data['message'] ?? 'Không tìm thấy thông tin chi tiết.',
          );
        }
      } else {
        // Cung cấp thông báo lỗi rõ ràng hơn
        final errorData = jsonDecode(response.body);
        _showResultDialog(
          'Xác minh thất bại',
          errorData['message'] ?? 'Đã xảy ra lỗi không xác định.',
        );
      }
    } catch (e) {
      if (!mounted) return;
      _showResultDialog(
        'Lỗi',
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
      );
    } finally {
      // Đảm bảo rằng trạng thái loading luôn được tắt
      if (mounted) {
        setState(() {
          _isVerifying = false;
        });
      }
    }
  }

  void _showResultDialog(String title, String content) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Đóng'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Quét thuốc")),
      body: Stack(
        children: [
          CameraScanner(
            onScanned: (code) {
              _verifyCode(code);
            },
          ),
          if (_isVerifying) const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}
