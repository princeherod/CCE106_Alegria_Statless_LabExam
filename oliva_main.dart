import 'package:flutter/material.dart';
import 'oliva_shopping_cart_page.dart';

void main() {
  runApp(const MyApp());
}

/// The root application widget implemented as a [StatelessWidget].
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Campus Store',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF4F6FB),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1D4ED8),
          primary: const Color(0xFF1D4ED8),
        ),
      ),
      home: const ShoppingCartPage(),
    );
  }
}
