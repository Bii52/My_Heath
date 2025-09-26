import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:google_mlkit_barcode_scanning/google_mlkit_barcode_scanning.dart';
import 'package:camera/camera.dart';

class CameraScanner extends StatefulWidget {
  final Function(String) onScanned;

  const CameraScanner({super.key, required this.onScanned});

  @override
  _CameraScannerState createState() => _CameraScannerState();
}

class _CameraScannerState extends State<CameraScanner> {
  late CameraController _controller;
  late BarcodeScanner _barcodeScanner;
  bool _isScanning = false;

  @override
  void initState() {
    super.initState();
    _barcodeScanner = BarcodeScanner();
    _initCamera();
  }

  Future<void> _initCamera() async {
    final cameras = await availableCameras();
    _controller = CameraController(cameras.first, ResolutionPreset.medium);
    await _controller.initialize();
    _controller.startImageStream((image) {
      if (!_isScanning) _scanBarcode(image);
    });
    setState(() {});
  }

  Future<void> _scanBarcode(CameraImage image) async {
    _isScanning = true;

    // Convert CameraImage to InputImage
    final Uint8List bytes = Uint8List.fromList(
      image.planes.expand((plane) => plane.bytes).toList(),
    );

    final InputImage inputImage = InputImage.fromBytes(
      bytes: bytes,
      metadata: InputImageMetadata(
        size: Size(image.width.toDouble(), image.height.toDouble()),
        rotation: InputImageRotation.rotation0deg,
        format: InputImageFormat.nv21,
        bytesPerRow: image.planes.first.bytesPerRow,
      ),
    );

    try {
      final barcodes = await _barcodeScanner.processImage(inputImage);
      if (barcodes.isNotEmpty) {
        widget.onScanned(barcodes.first.displayValue ?? '');
      }
    } catch (e) {
      print('Error scanning barcode: $e');
    } finally {
      _isScanning = false;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _barcodeScanner.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_controller.value.isInitialized) return Container();
    return CameraPreview(_controller);
  }
}
