# 06 - QA TESTING REPORT
## GRIHGO Customer App - Quality Assurance & Testing Strategy

**Report Date:** January 14, 2026
**Analyzed By:** QA & Testing Team
**Language:** Technical English + Hindi Mix
**Testing Framework:** Jest + React Testing Library + Detox

---

## 📋 Executive Summary

Ye report GRIHGO Customer App ke liye **complete testing strategy** define karta hai. Currently **testing coverage 0% hai** - koi bhi automated tests nahi hain. Is report mein **test cases**, **testing types**, aur **quality metrics** ka detailed plan hai.

### Testing Status Overview

```
🔴 CURRENT STATE: 0% Test Coverage

Missing:
├─ Unit Tests (0 tests)
├─ Integration Tests (0 tests)
├─ E2E Tests (0 tests)
├─ Manual Test Cases (0 documented)
└─ Performance Tests (0 tests)

Recommendation: CRITICAL - Testing infrastructure needed before production
```

### Testing Pyramid Target

```
        /\
       /E2E\         10% - Critical user flows (5-10 tests)
      /------\
     /  API   \      20% - Integration tests (20-30 tests)
    /----------\
   /   Unit     \    70% - Component & function tests (100+ tests)
  /--------------\
```

---

## 🧪 Testing Stack Recommendation

### Tools & Frameworks

| Testing Type | Tool | Purpose |
|--------------|------|---------|
| **Unit Testing** | Jest | Test individual functions/components |
| **Component Testing** | React Testing Library | Test React components |
| **E2E Testing** | Detox | Test full user flows on real devices |
| **API Testing** | Supertest / Postman | Test backend APIs |
| **Performance Testing** | Lighthouse / React Native Performance | Measure app performance |
| **Accessibility Testing** | axe-core / Testing Library | Check WCAG compliance |
| **Visual Regression** | Percy / Chromatic | Catch UI changes |
| **Code Coverage** | Istanbul (built into Jest) | Track test coverage |

---

## ✅ Unit Testing Strategy

### What to Test

**Priority 1: Utility Functions**
- File: `src/utils/index.ts`
- Pure functions (no side effects)
- Easy to test, high ROI

**Example:**
```typescript
// src/utils/index.ts
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// __tests__/utils.test.ts
import { formatCurrency } from '../utils';

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(100)).toBe('₹100.00');
  });

  it('formats decimal numbers correctly', () => {
    expect(formatCurrency(99.5)).toBe('₹99.50');
  });

  it('handles zero correctly', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });
});
```

---

**Priority 2: Context Logic**
- File: `src/context/CartContext.tsx`
- Complex business logic (cart calculations, coupon validation)

**Example:**
```typescript
// __tests__/CartContext.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { CartProvider, useCart } from '../context/CartContext';

describe('CartContext', () => {
  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({
        menuItemId: 'item_1',
        name: 'Pizza',
        price: 250,
        quantity: 1,
      }, mockRestaurant);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(250);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({
        menuItemId: 'item_1',
        name: 'Pizza',
        price: 250,
        quantity: 2,
      }, mockRestaurant);
    });

    // Subtotal: 500, Delivery: 30, Tax (5%): 25
    expect(result.current.subtotal).toBe(500);
    expect(result.current.deliveryFee).toBe(30);
    expect(result.current.taxes).toBe(25);
    expect(result.current.total).toBe(555);
  });

  it('applies coupon correctly', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({
        menuItemId: 'item_1',
        name: 'Pizza',
        price: 300,
        quantity: 1,
      }, mockRestaurant);
    });

    await act(async () => {
      const success = await result.current.applyCoupon('FIRST50');
      expect(success).toBe(true);
    });

    expect(result.current.discount).toBe(50);
    expect(result.current.couponCode).toBe('FIRST50');
  });

  it('clears cart from different restaurant', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({
        menuItemId: 'item_1',
        name: 'Pizza',
        price: 250,
        quantity: 1,
      }, mockRestaurant1);
    });

    expect(result.current.items).toHaveLength(1);

    // Add from different restaurant
    act(() => {
      result.current.addItem({
        menuItemId: 'item_2',
        name: 'Burger',
        price: 150,
        quantity: 1,
      }, mockRestaurant2);
    });

    // Should clear previous cart
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Burger');
  });
});
```

---

**Priority 3: UI Components**
- Files: `src/components/ui/*.tsx`
- Button, Input, Card, etc.

**Example:**
```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/ui/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Click Me" loading={true} />
    );
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} loading={true} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

---

### Unit Test Coverage Goals

| File Type | Target Coverage | Priority |
|-----------|-----------------|----------|
| Utility functions | 100% | P0 |
| Context providers | 90% | P0 |
| UI components | 80% | P1 |
| Screens | 60% | P2 |
| **Overall Target** | **70%+** | - |

---

## 🔗 Integration Testing

### What to Test

**API Integration Tests** (when backend is ready)

```typescript
// __tests__/integration/auth.test.ts
import { authService } from '../services/auth.service';

describe('Authentication Flow', () => {
  it('sends OTP successfully', async () => {
    const response = await authService.sendOTP('+919876543210');

    expect(response.success).toBe(true);
    expect(response.otpId).toBeDefined();
  });

  it('verifies OTP and returns token', async () => {
    const otpResponse = await authService.sendOTP('+919876543210');

    const verifyResponse = await authService.verifyOTP(
      otpResponse.otpId,
      '123456',
      '+919876543210'
    );

    expect(verifyResponse.success).toBe(true);
    expect(verifyResponse.token).toBeDefined();
    expect(verifyResponse.user).toBeDefined();
  });

  it('fails with invalid OTP', async () => {
    const otpResponse = await authService.sendOTP('+919876543210');

    await expect(
      authService.verifyOTP(otpResponse.otpId, '000000', '+919876543210')
    ).rejects.toThrow('Invalid OTP');
  });
});
```

---

## 🎬 End-to-End Testing (E2E)

### Critical User Flows

#### Flow 1: Complete Order Flow
```typescript
// e2e/completeOrderFlow.test.ts
describe('Complete Order Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete full order journey', async () => {
    // 1. Login
    await element(by.id('phone-input')).typeText('9876543210');
    await element(by.id('continue-button')).tap();

    // 2. Enter OTP
    await element(by.id('otp-input-1')).typeText('1');
    await element(by.id('otp-input-2')).typeText('2');
    await element(by.id('otp-input-3')).typeText('3');
    await element(by.id('otp-input-4')).typeText('4');
    await element(by.id('otp-input-5')).typeText('5');
    await element(by.id('otp-input-6')).typeText('6');
    await element(by.id('verify-button')).tap();

    // 3. Should see home screen
    await expect(element(by.id('home-screen'))).toBeVisible();

    // 4. Tap on a restaurant
    await element(by.id('restaurant-card-0')).tap();

    // 5. Should see restaurant detail
    await expect(element(by.id('restaurant-detail'))).toBeVisible();

    // 6. Add item to cart
    await element(by.id('add-button-item-0')).tap();

    // 7. Go to cart
    await element(by.id('cart-button')).tap();

    // 8. Should see cart screen
    await expect(element(by.id('cart-screen'))).toBeVisible();
    await expect(element(by.text('1 item'))).toBeVisible();

    // 9. Proceed to checkout
    await element(by.id('checkout-button')).tap();

    // 10. Select address
    await element(by.id('address-radio-0')).tap();

    // 11. Select payment method
    await element(by.id('payment-upi')).tap();

    // 12. Place order
    await element(by.id('place-order-button')).tap();

    // 13. Should see order tracking screen
    await expect(element(by.id('order-tracking'))).toBeVisible();
    await expect(element(by.text('Order Placed'))).toBeVisible();
  });
});
```

---

#### Flow 2: Search & Filter
```typescript
describe('Search and Filter Flow', () => {
  it('should search for restaurants', async () => {
    await element(by.id('search-bar')).tap();
    await element(by.id('search-input')).typeText('Pizza');

    await waitFor(element(by.id('search-results')))
      .toBeVisible()
      .withTimeout(2000);

    await expect(element(by.text('Dominos Pizza'))).toBeVisible();
  });

  it('should filter by cuisine', async () => {
    await element(by.id('filter-button')).tap();
    await element(by.id('cuisine-italian')).tap();
    await element(by.id('apply-filters')).tap();

    await expect(element(by.text('Italian'))).toBeVisible();
  });
});
```

---

### E2E Test Cases (Minimum Required)

| Test Case | Priority | Status |
|-----------|----------|--------|
| Complete order flow (login → order → track) | P0 | ❌ Not Written |
| Search restaurants | P0 | ❌ Not Written |
| Apply coupon in cart | P0 | ❌ Not Written |
| Cancel order | P1 | ❌ Not Written |
| Reorder from history | P1 | ❌ Not Written |
| Rate order | P1 | ❌ Not Written |
| Add/edit address | P1 | ❌ Not Written |
| Change payment method | P1 | ❌ Not Written |

**Target:** 8-10 E2E tests covering critical paths

---

## 📋 Manual Test Cases

### Test Case Template

```
TEST CASE ID: TC-001
Title: Login with Phone Number
Priority: P0
Pre-conditions: App installed, no user logged in

Steps:
1. Launch app
2. Enter phone number: 9876543210
3. Tap "Continue" button
4. Enter OTP: 123456
5. Tap "Verify" button

Expected Result:
- User is logged in
- Home screen is displayed
- User name is shown in profile

Actual Result: [To be filled during testing]
Status: [Pass/Fail]
```

---

### Critical Test Cases (Manual)

#### Authentication (5 test cases)

**TC-AUTH-001: Successful Login**
- Steps: Enter phone → OTP → Verify
- Expected: User logged in, home screen shown

**TC-AUTH-002: Invalid OTP**
- Steps: Enter phone → Wrong OTP → Verify
- Expected: Error message "Invalid OTP"

**TC-AUTH-003: OTP Expiry**
- Steps: Enter phone → Wait 5 mins → Enter OTP
- Expected: Error "OTP expired"

**TC-AUTH-004: Resend OTP**
- Steps: Enter phone → Tap resend → Enter new OTP
- Expected: New OTP works

**TC-AUTH-005: Logout**
- Steps: Go to profile → Tap logout
- Expected: Redirected to login

---

#### Restaurant Browsing (8 test cases)

**TC-REST-001: View Restaurant List**
- Expected: At least 10 restaurants displayed

**TC-REST-002: Restaurant Detail**
- Steps: Tap on restaurant card
- Expected: Detail screen with menu

**TC-REST-003: Filter by Cuisine**
- Steps: Select "Italian" cuisine
- Expected: Only Italian restaurants shown

**TC-REST-004: Sort by Rating**
- Steps: Select sort "Rating: High to Low"
- Expected: Highest rated first

**TC-REST-005: Search Restaurant**
- Steps: Type "Dominos" in search
- Expected: Dominos Pizza shown

**TC-REST-006: View Menu Categories**
- Expected: Categories like Starters, Mains displayed

**TC-REST-007: Add Item to Cart**
- Steps: Tap ADD button on menu item
- Expected: Item added, cart badge updated

**TC-REST-008: Add from Different Restaurant**
- Steps: Add item from Restaurant A → Add from Restaurant B
- Expected: Popup "Clear cart from Restaurant A?"

---

#### Cart & Checkout (15 test cases)

**TC-CART-001: View Cart**
- Expected: All added items visible

**TC-CART-002: Update Quantity**
- Steps: Tap +/- buttons
- Expected: Quantity updated, total recalculated

**TC-CART-003: Remove Item**
- Steps: Reduce quantity to 0
- Expected: Item removed from cart

**TC-CART-004: Empty Cart**
- Expected: "Your cart is empty" message

**TC-CART-005: Apply Valid Coupon**
- Steps: Enter "FIRST50" → Apply
- Expected: Discount applied, total reduced

**TC-CART-006: Apply Invalid Coupon**
- Steps: Enter "INVALID" → Apply
- Expected: Error "Invalid coupon code"

**TC-CART-007: Remove Coupon**
- Steps: Tap X on applied coupon
- Expected: Discount removed

**TC-CART-008: Add Tip**
- Steps: Select ₹30 tip
- Expected: Tip added to total

**TC-CART-009: Special Instructions**
- Steps: Enter "No onions"
- Expected: Instructions saved

**TC-CART-010: Proceed to Checkout**
- Steps: Tap "Proceed to Checkout"
- Expected: Checkout screen shown

**TC-CART-011: Select Address**
- Expected: Default address pre-selected

**TC-CART-012: Change Address**
- Steps: Select different address
- Expected: Address updated

**TC-CART-013: Select Payment Method**
- Expected: UPI, Card, Wallet, COD options

**TC-CART-014: Place Order**
- Steps: Tap "Place Order"
- Expected: Order placed, tracking screen shown

**TC-CART-015: Order Placement Failure**
- Steps: Place order with network off
- Expected: Error message shown

---

#### Order Tracking (6 test cases)

**TC-ORDER-001: View Order Status**
- Expected: Current status displayed

**TC-ORDER-002: Real-time Updates**
- Expected: Status changes reflect immediately

**TC-ORDER-003: View Delivery Partner**
- Expected: Name, photo, rating visible

**TC-ORDER-004: Call Delivery Partner**
- Steps: Tap call button
- Expected: Dialer opens

**TC-ORDER-005: Track on Map**
- Expected: Live location on map

**TC-ORDER-006: Cancel Order**
- Steps: Tap cancel → Confirm
- Expected: Order cancelled, refund initiated

---

### Manual Testing Checklist

**Device Coverage:**
- [ ] Android (latest 2 versions)
- [ ] iOS (latest 2 versions)
- [ ] Small screen (5")
- [ ] Large screen (6.5"+)
- [ ] Tablet (if supported)

**Network Conditions:**
- [ ] WiFi (good connection)
- [ ] 4G (mobile data)
- [ ] 3G (slow connection)
- [ ] Offline (airplane mode)
- [ ] Intermittent (switching networks)

**Edge Cases:**
- [ ] Fresh install
- [ ] App update
- [ ] Low storage
- [ ] Low battery
- [ ] Background/foreground transitions
- [ ] Notifications while app is closed

---

## 🚀 Performance Testing

### Metrics to Track

| Metric | Target | Current | Tool |
|--------|--------|---------|------|
| **App Launch Time** | < 2s | Unknown | React Native Performance |
| **Screen Load Time** | < 1s | Unknown | Custom logging |
| **API Response Time** | < 500ms | N/A | Backend monitoring |
| **FPS (Animations)** | 60 FPS | Unknown | Flipper |
| **Memory Usage** | < 150 MB | Unknown | Android Studio / Xcode |
| **Bundle Size (Android)** | < 20 MB | Unknown | APK Analyzer |
| **Bundle Size (iOS)** | < 25 MB | Unknown | Xcode |

---

### Performance Test Cases

**PERF-001: App Launch Performance**
```typescript
describe('Performance: App Launch', () => {
  it('launches within 2 seconds', async () => {
    const startTime = Date.now();
    await device.launchApp();
    const endTime = Date.now();

    const launchTime = endTime - startTime;
    expect(launchTime).toBeLessThan(2000);
  });
});
```

**PERF-002: List Scrolling Performance**
- Test: Scroll through 100+ restaurants
- Expected: 60 FPS, no jank

**PERF-003: Image Loading**
- Test: Load 50 restaurant images
- Expected: Progressive loading, no blank screens

---

## ♿ Accessibility Testing

### WCAG 2.1 Level AA Compliance

**Test Cases:**

**A11Y-001: Color Contrast**
```typescript
import { getByText } from '@testing-library/react-native';
import { checkContrast } from '@testing-library/jest-native';

it('has sufficient color contrast', () => {
  const { getByText } = render(<Button title="Order Now" />);
  const button = getByText('Order Now');

  // Check if contrast ratio > 4.5:1
  expect(button).toHaveAccessibleContrast();
});
```

**A11Y-002: Screen Reader Labels**
```typescript
it('has accessibility labels', () => {
  const { getByLabelText } = render(<RestaurantCard restaurant={mockRestaurant} />);

  expect(getByLabelText('Restaurant: Dominos Pizza')).toBeTruthy();
  expect(getByLabelText('Rating: 4.3 stars')).toBeTruthy();
});
```

**A11Y-003: Touch Targets**
- Test: All interactive elements ≥ 44x44 points
- Current Status: ❌ Cart quantity buttons are 28x28

**A11Y-004: Font Scaling**
- Test: App with 200% system font size
- Expected: No text overflow, layouts adapt

---

## 🐛 Bug Tracking

### Bug Severity Levels

| Severity | Definition | Example |
|----------|------------|---------|
| **S1 - Critical** | App crash, data loss | App crashes on checkout |
| **S2 - High** | Feature broken, workaround exists | Payment fails but can use COD |
| **S3 - Medium** | Feature partially works | Coupon sometimes doesn't apply |
| **S4 - Low** | Minor UI issue, typo | Text alignment off by 2px |

---

### Bug Report Template

```
BUG ID: BUG-001
Title: App crashes when adding 10+ items to cart
Severity: S1 - Critical
Priority: P0

Steps to Reproduce:
1. Add 10 different items to cart
2. Try to add 11th item
3. App crashes

Expected Behavior:
- Should be able to add unlimited items
- No crash

Actual Behavior:
- App crashes after 10 items

Environment:
- Device: Samsung Galaxy S21
- OS: Android 13
- App Version: 1.0.0

Screenshots/Logs: [Attach crash log]
```

---

## 📊 Test Execution Plan

### Sprint-wise Testing

#### Sprint 1: Setup Testing Infrastructure
- [ ] Install Jest, React Testing Library, Detox
- [ ] Configure test environment
- [ ] Write first 5 unit tests (utilities)
- [ ] Set up CI/CD pipeline for tests

#### Sprint 2: Unit Tests (Week 1-2)
- [ ] Test all utility functions (100% coverage)
- [ ] Test CartContext (90% coverage)
- [ ] Test AuthContext (90% coverage)
- [ ] Test UI components (80% coverage)

#### Sprint 3: Integration Tests (Week 3)
- [ ] Test API service layer (when backend ready)
- [ ] Test authentication flow
- [ ] Test order placement flow

#### Sprint 4: E2E Tests (Week 4)
- [ ] Write 8-10 critical E2E tests
- [ ] Run on real devices (Android + iOS)
- [ ] Fix discovered bugs

#### Sprint 5: Manual Testing (Week 5)
- [ ] Execute all manual test cases
- [ ] Test on multiple devices
- [ ] Test different network conditions
- [ ] Performance testing
- [ ] Accessibility testing

---

## 🎯 Quality Gates

### Before Merging Code (PR Requirements)

- [ ] All unit tests pass
- [ ] Code coverage ≥ 70%
- [ ] No critical ESLint errors
- [ ] TypeScript compilation successful
- [ ] No accessibility violations (auto-detected)

---

### Before Release (Production Checklist)

- [ ] All E2E tests pass
- [ ] Manual smoke test completed
- [ ] Performance benchmarks met
- [ ] No S1/S2 bugs open
- [ ] Accessibility audit passed
- [ ] Backend APIs tested and stable
- [ ] Analytics tracking verified
- [ ] Crash reporting (Sentry) configured
- [ ] App store assets ready

---

## 📌 Conclusion

**Current Testing Status:** 🔴 **0% - CRITICAL GAP**

**Required Actions:**
1. ⚠️ Set up testing infrastructure (Week 1)
2. ⚠️ Write unit tests for critical paths (Week 2-3)
3. ⚠️ E2E tests for core flows (Week 4)
4. ⚠️ Manual testing before launch (Week 5)

**Timeline to Production-Ready Testing:** 5-6 weeks

**Confidence Level:** ❌ **Cannot ship without testing** - Too risky

**Recommendation:**
- Minimum 50% code coverage before MVP launch
- At least 5 E2E tests for critical flows
- Complete manual test execution on 10+ devices

---

**Report End**
*For test implementation, see testing framework setup guide.*
