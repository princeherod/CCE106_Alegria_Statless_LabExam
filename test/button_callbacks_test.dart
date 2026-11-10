import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stateless_lab_exam/main.dart';

void main() {
  testWidgets('Test all required button clicks and console outputs',
      (WidgetTester tester) async {
    final List<String> logMessages = [];

    final originalDebugPrint = debugPrint;
    try {
      debugPrint = (String? message, {int? wrapWidth}) {
        if (message != null) {
          logMessages.add(message);
          // ignore: avoid_print
          print(message);
        }
      };

      await tester.pumpWidget(const MyApp());

      // 1. Back arrow click
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pump();

      // 2. Shopping bag click
      await tester.tap(find.byIcon(Icons.shopping_bag_outlined));
      await tester.pump();

      // 3. Change delivery address click
      await tester.tap(find.text('Change'));
      await tester.pump();

      // 4. Plus, Minus, Delete for each product
      final plusButtons = find.byIcon(Icons.add);
      final minusButtons = find.byIcon(Icons.remove);
      final deleteButtons = find.byIcon(Icons.delete_outline_rounded);

      // Wireless Mouse (index 0)
      await tester.tap(plusButtons.at(0));
      await tester.pump();
      await tester.tap(minusButtons.at(0));
      await tester.pump();
      await tester.tap(deleteButtons.at(0));
      await tester.pump();

      // USB-C Hub (index 1)
      await tester.tap(plusButtons.at(1));
      await tester.pump();
      await tester.tap(minusButtons.at(1));
      await tester.pump();
      await tester.tap(deleteButtons.at(1));
      await tester.pump();

      // Laptop Stand (index 2) - ensure visible in scroll view
      await tester.ensureVisible(plusButtons.at(2));
      await tester.pumpAndSettle();
      await tester.tap(plusButtons.at(2));
      await tester.pump();
      await tester.tap(minusButtons.at(2));
      await tester.pump();
      await tester.tap(deleteButtons.at(2));
      await tester.pump();

      // 5. Place Order click (scroll into view if needed)
      final placeOrderFinder = find.text('Place Order');
      await tester.ensureVisible(placeOrderFinder);
      await tester.tap(placeOrderFinder);
      await tester.pump();

      // Verify all logged messages
      expect(logMessages, contains('Back clicked'));
      expect(logMessages, contains('Cart clicked'));
      expect(logMessages, contains('Change delivery address clicked'));
      expect(logMessages, contains('Increase quantity: Wireless Mouse'));
      expect(logMessages, contains('Decrease quantity: Wireless Mouse'));
      expect(logMessages, contains('Remove item: Wireless Mouse'));
      expect(logMessages, contains('Increase quantity: USB-C Hub'));
      expect(logMessages, contains('Decrease quantity: USB-C Hub'));
      expect(logMessages, contains('Remove item: USB-C Hub'));
      expect(logMessages, contains('Increase quantity: Laptop Stand'));
      expect(logMessages, contains('Decrease quantity: Laptop Stand'));
      expect(logMessages, contains('Remove item: Laptop Stand'));
      expect(logMessages, contains('Place order clicked! Total: PHP 1850.00'));
    } finally {
      debugPrint = originalDebugPrint;
    }
  });
}
