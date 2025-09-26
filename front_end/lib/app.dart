import 'package:flutter/material.dart';

import 'screens/scan_screen.dart';
import 'screens/diagnosis_screen.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MyHealth App',
      theme: ThemeData(primarySwatch: Colors.blue),
      routes: {
        '/scan': (context) => const ScanScreen(),
        '/diagnosis': (context) => const DiagnosisScreen(),
      },
    );
  }
}
