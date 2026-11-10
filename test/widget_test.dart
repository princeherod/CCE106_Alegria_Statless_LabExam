import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stateless_lab_exam/main.dart';
import 'package:stateless_lab_exam/shopping_cart_page.dart';

void main() {
  testWidgets('ShoppingCartPage renders all required sections and items',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    // 1. AppBar checks
    expect(find.text('My Cart'), findsOneWidget);
    expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    expect(find.byIcon(Icons.shopping_bag_outlined), findsOneWidget);
    expect(find.text('3'), findsAtLeastNWidgets(1));

    // 2. Introduction Section checks
    expect(find.text('CAMPUS STORE'), findsOneWidget);
    expect(find.text('Ready for checkout'), findsOneWidget);
    expect(
        find.text('Review your items before placing your order.'), findsOneWidget);

    // 3. Delivery Information Card checks
    expect(find.byIcon(Icons.location_on), findsOneWidget);
    expect(find.text('Deliver to Glenn Oliva'), findsOneWidget);
    expect(find.text('Matina, Davao City'), findsOneWidget);
    expect(find.text('Change'), findsOneWidget);

    // 4. Order Items Header checks
    expect(find.text('Order Items'), findsOneWidget);
    expect(find.text('3 items'), findsOneWidget);

    // 4. Products check (Reusable CartItemCard)
    expect(find.byType(CartItemCard), findsNWidgets(3));
    expect(find.text('Wireless Mouse'), findsOneWidget);
    expect(find.text('PHP 450.00'), findsOneWidget);

    expect(find.text('USB-C Hub'), findsOneWidget);
    expect(find.text('PHP 850.00'), findsOneWidget);

    expect(find.text('Laptop Stand'), findsOneWidget);
    expect(find.text('PHP 700.00'), findsOneWidget);

    // 5. Discount Banner checks
    expect(find.text('STUDENT10 applied'), findsOneWidget);
    expect(find.text('10% discount on items'), findsOneWidget);
    expect(find.byIcon(Icons.local_offer_outlined), findsOneWidget);
    expect(find.byIcon(Icons.check_circle), findsOneWidget);

    // 6. Payment Summary checks
    expect(find.text('Payment Summary'), findsOneWidget);
    expect(find.text('Subtotal'), findsOneWidget);
    expect(find.text('PHP 2,000.00'), findsOneWidget);
    expect(find.text('Discount (10%)'), findsOneWidget);
    expect(find.text('- PHP 200.00'), findsOneWidget);
    expect(find.text('Delivery Fee'), findsOneWidget);
    expect(find.text('PHP 50.00'), findsOneWidget);
    expect(find.text('Total'), findsOneWidget);
    expect(find.text('PHP 1,850.00'), findsOneWidget);

    // 7. Place Order Button checks
    expect(find.text('Place Order'), findsOneWidget);
    expect(find.byIcon(Icons.lock_rounded), findsOneWidget);
  });

  testWidgets('CartItemCard triggers callbacks properly',
      (WidgetTester tester) async {
    bool increased = false;
    bool decreased = false;
    bool deleted = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CartItemCard(
            productName: 'Test Item',
            price: 'PHP 100.00',
            quantity: 2,
            icon: Icons.computer,
            onIncrease: () => increased = true,
            onDecrease: () => decreased = true,
            onDelete: () => deleted = true,
          ),
        ),
      ),
    );

    // Tap minus
    await tester.tap(find.byIcon(Icons.remove));
    expect(decreased, isTrue);

    // Tap plus
    await tester.tap(find.byIcon(Icons.add));
    expect(increased, isTrue);

    // Tap delete
    await tester.tap(find.byIcon(Icons.delete_outline_rounded));
    expect(deleted, isTrue);
  });
}
