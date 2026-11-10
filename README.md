# Lab Exam 1 – Stateless Widget: Campus Store Shopping Cart Page

**Course:** Mobile Application Development  
**Subject:** Flutter / Dart Examination  
**Project Name:** `stateless_lab_exam`  
**Student Name:** Glenn Oliva  
**Total Points:** 100 / 100  

---

## 🎯 Overview & Objectives
This project is an exact implementation of **Lab Exam 1 – Stateless Widget: Campus Store Shopping Cart Page**.
The application replicates the reference design with 100% fidelity using pure **`StatelessWidget`** components, nested layouts, consistent styling, responsive spacing, and required console outputs.

---

## 🏗️ Project Architecture & Components

All components are strictly implemented as `StatelessWidget` without any `StatefulWidget` or mutable state.

```
lib/
├── main.dart                 # Root widget (MyApp) setting up theme and home route
└── shopping_cart_page.dart   # ShoppingCartPage & reusable CartItemCard widget
```

### 1. `ShoppingCartPage` (`StatelessWidget`)
- **AppBar:**
  - Back arrow `IconButton` (triggers `Back clicked`)
  - Title: `"My Cart"`
  - Shopping bag icon with dynamic badge displaying `"3"` using a `Stack` (triggers `Cart clicked`)
- **Introduction Section:**
  - Pill banner: `"CAMPUS STORE"` (light-blue container with blue bold text)
  - Bold heading: `"Ready for checkout"`
  - Subtitle: `"Review your items before placing your order."`
- **Delivery Information Card:**
  - Rounded white card with 1px border (#E2E8F0) and subtle elevation
  - Circular blue location icon (#1D4ED8)
  - Vertical divider separator
  - Address info: `"Deliver to Glenn Oliva"`, `"Matina, Davao City"`
  - `"Change"` text button (triggers `Change delivery address clicked`)
- **Order Items Section:**
  - Header row: `"Order Items"` and `"3 items"`
  - Three product cards using the reusable `CartItemCard`:
    1. **Wireless Mouse** – PHP 450.00 (Quantity: 1)
    2. **USB-C Hub** – PHP 850.00 (Quantity: 1)
    3. **Laptop Stand** – PHP 700.00 (Quantity: 1)
- **Discount Banner:**
  - Light-blue rounded container with border
  - Discount tag icon (`Icons.local_offer_outlined`)
  - Vertical divider
  - Texts: `"STUDENT10 applied"`, `"10% discount on items"`
  - Blue check-circle icon on right
- **Payment Summary Card:**
  - White rounded card with aligned description and amount rows:
    - **Subtotal:** `PHP 2,000.00`
    - **Discount (10%):** `- PHP 200.00`
    - **Delivery Fee:** `PHP 50.00`
    - Horizontal divider
    - **Total:** `PHP 1,850.00` (bold emphasized text)
- **Place Order Button:**
  - Full-width blue rounded button (`ElevatedButton`)
  - Lock icon (`Icons.lock_rounded`)
  - White bold label: `"Place Order"`
  - Triggers: `Place order clicked! Total: PHP 1850.00`

### 2. `CartItemCard` (`StatelessWidget`)
Reusable component with constructor parameters:
```dart
class CartItemCard extends StatelessWidget {
  final String productName;
  final String price;
  final int quantity;
  final IconData icon;
  final VoidCallback? onIncrease;
  final VoidCallback? onDecrease;
  final VoidCallback? onDelete;
  ...
}
```
- Light-blue rounded tile (64×64) for product icons
- Product name in bold, price in primary blue (#1D4ED8)
- Stepper buttons: `[-]` and `[+]` with rounded blue borders and quantity box between them
- Delete trash icon top right

---

## 🖨️ Required Button Behavior & Console Outputs

| Control | Triggered Event | Console Output |
| :--- | :--- | :--- |
| **Back arrow** | `IconButton.onPressed` | `Back clicked` |
| **Shopping bag** | `IconButton.onPressed` | `Cart clicked` |
| **Change** | `TextButton.onPressed` | `Change delivery address clicked` |
| **Plus button (+)** | `InkWell.onTap` | `Increase quantity: [product name]` |
| **Minus button (−)** | `InkWell.onTap` | `Decrease quantity: [product name]` |
| **Delete button** | `IconButton.onPressed` | `Remove item: [product name]` |
| **Place Order** | `ElevatedButton.onPressed` | `Place order clicked! Total: PHP 1850.00` |

---

## 🚀 Running the Project

### Prerequisites
- Flutter SDK 3.x or higher
- Chrome or Edge browser (for Web) or Windows Desktop build

### Commands
```bash
# 1. Install dependencies
flutter pub get

# 2. Run static analysis (0 issues found)
flutter analyze

# 3. Run all widget and callback tests
flutter test

# 4. Launch the application
flutter run -d chrome
# OR
flutter run -d windows
```

---

## 🧪 Automated Testing
Comprehensive automated tests are located in `test/`:
- `test/widget_test.dart`: Validates all sections, texts, icons, prices, and widgets exist in the tree.
- `test/button_callbacks_test.dart`: Simulates user clicks on all 7 controls and asserts the exact required log strings.

To execute tests:
```bash
flutter test
```
Result: `All tests passed!`

---

## 📁 Submission Files Format

In compliance with the examination requirements:
- **`oliva_main.dart`**: Copy of `lib/main.dart`
- **`oliva_shopping_cart_page.dart`**: Copy of `lib/shopping_cart_page.dart`
- **`oliva_output_1.png`**: Mobile output screenshot (Top section)
- **`oliva_output_2.png`**: Mobile output screenshot (Bottom section)
- **`oliva_output_full.png`**: Full-page mobile output screenshot (All sections)
- **`console_output.png`**: Screenshot of debug console with all required messages
- **`oliva_lab_exam_documentation.pdf`**: Complete PDF document containing screenshots, rubric compliance, and code

---

## 📤 GitHub Push Instructions

```bash
git init
git add .
git commit -m "feat: complete Lab Exam 1 Campus Store Shopping Cart Page"
git branch -M main
git remote add origin https://github.com/[your-username]/stateless_lab_exam.git
git push -u origin main
```
