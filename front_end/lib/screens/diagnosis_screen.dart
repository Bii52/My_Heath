import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_mlkit_image_labeling/google_mlkit_image_labeling.dart';
import 'package:image_picker/image_picker.dart';

class DiagnosisScreen extends StatefulWidget {
  const DiagnosisScreen({super.key});

  @override
  _DiagnosisScreenState createState() => _DiagnosisScreenState();
}

class _DiagnosisScreenState extends State<DiagnosisScreen> {
  final picker = ImagePicker();
  String _result = 'Chưa có kết quả phân tích.';
  bool _isLoading = false;
  File? _pickedImage; // Để hiển thị ảnh đã chọn

  Future<void> _pickAndAnalyzeImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    // Xử lý khi người dùng hủy chụp ảnh
    if (pickedFile == null) return;

    final inputImage = InputImage.fromFile(File(pickedFile.path));
    final imageLabeler = ImageLabeler(
      options: ImageLabelerOptions(confidenceThreshold: 0.5),
    );

    setState(() {
      _isLoading = true;
      _result = 'Đang phân tích ảnh...';
      _pickedImage = File(pickedFile.path); // Lưu file ảnh
    });

    try {
      final labels = await imageLabeler.processImage(inputImage);

      String res = '';
      if (labels.isEmpty) {
        res = 'Không nhận diện được bất kỳ đối tượng nào với độ tin cậy trên 50%.';
      } else {
        res = 'Kết quả phân tích:\n';
        for (final label in labels) {
          res += '- ${label.label}: ${(label.confidence * 100).toStringAsFixed(1)}%\n';
        }
        res += '\nLưu ý: Đây chỉ là phân tích sơ bộ. Vui lòng tham khảo ý kiến bác sĩ.';
      }

      setState(() {
        _result = res;
      });
    } catch (e) {
      setState(() {
        _result = 'Lỗi trong quá trình phân tích: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
      imageLabeler.close();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Phân tích triệu chứng")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch, // Kéo dài các phần tử con theo chiều ngang
          children: [
            ElevatedButton(
              onPressed: _pickAndAnalyzeImage,
              child: const Text("Chụp ảnh để phân tích"),
            ),
            const SizedBox(height: 20),
            if (_pickedImage != null)
              Expanded( // Hiển thị ảnh nếu có
                child: Image.file(_pickedImage!, fit: BoxFit.contain),
              ),
            if (_isLoading) const LinearProgressIndicator(), // Thanh loading
            const SizedBox(height: 20),
            Text(_result, style: Theme.of(context).textTheme.bodyLarge), // Sử dụng theme cho kiểu chữ
          ],
        ),
      ),
    );
  }
}
