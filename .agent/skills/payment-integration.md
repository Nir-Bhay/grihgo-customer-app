---
name: Payment Integration
description: Expert skill for integrating Razorpay payment gateway with UPI, Cards, Wallets, and COD support in React Native
---

# Payment Integration Skill

> **Purpose:** Use this skill when implementing payment features including Razorpay integration, multiple payment methods, refunds, and payment verification for the GRIHGO app.

---

## 🎯 When to Use This Skill

- Integrating Razorpay SDK
- Implementing checkout payment flow
- Adding UPI, Card, Wallet payment methods
- Handling payment success/failure
- Implementing refund flows
- Creating payment history screens
- Adding saved payment methods

---

## 📦 Installation

```bash
# Install Razorpay React Native SDK
npm install react-native-razorpay

# For Expo managed workflow (requires development build)
npx expo install react-native-razorpay
npx expo prebuild
```

### Expo Configuration

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "react-native-razorpay",
        {
          "enableProguardRules": true
        }
      ]
    ]
  }
}
```

---

## 🔑 Payment Types

```typescript
// src/types/payment.types.ts

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'cod';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface PaymentOrder {
  id: string;
  amount: number; // in paise (₹100 = 10000)
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  code: number;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id?: string;
  };
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'rupay' | 'amex';
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
}

export interface SavedUPI {
  id: string;
  vpa: string; // UPI VPA like user@upi
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpayPaymentId?: string;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}
```

---

## 🔧 Payment Service

```typescript
// src/services/payment.service.ts

import RazorpayCheckout from 'react-native-razorpay';
import api from './api';
import {
  PaymentOrder,
  RazorpayOptions,
  RazorpaySuccessResponse,
  PaymentTransaction,
  SavedCard,
  SavedUPI
} from '@/types/payment.types';

// ========================================
// CONSTANTS
// ========================================

const RAZORPAY_KEY = __DEV__
  ? 'rzp_test_xxxxxxxxxxxxx'  // Test key
  : 'rzp_live_xxxxxxxxxxxxx'; // Live key

const RAZORPAY_CONFIG = {
  name: 'GRIHGO',
  description: 'Food Order Payment',
  currency: 'INR',
  theme: {
    color: '#2ECC71', // GRIHGO Green
  },
};

// ========================================
// SERVICE
// ========================================

export const paymentService = {
  /**
   * Create a Razorpay order on backend
   */
  createOrder: async (amount: number, orderId: string): Promise<PaymentOrder> => {
    try {
      const response = await api.post('/payments/create-order', {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `order_${orderId}`,
        notes: {
          orderId,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to create payment order');
    }
  },

  /**
   * Open Razorpay checkout
   */
  openCheckout: async (
    paymentOrder: PaymentOrder,
    userInfo: { name: string; email: string; phone: string }
  ): Promise<RazorpaySuccessResponse> => {
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: RAZORPAY_CONFIG.name,
      description: RAZORPAY_CONFIG.description,
      order_id: paymentOrder.id,
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      notes: {
        receipt: paymentOrder.receipt,
      },
      theme: RAZORPAY_CONFIG.theme,
    };

    try {
      const response = await RazorpayCheckout.open(options);
      return response as RazorpaySuccessResponse;
    } catch (error) {
      throw error; // Will be RazorpayErrorResponse
    }
  },

  /**
   * Verify payment on backend
   */
  verifyPayment: async (
    paymentResponse: RazorpaySuccessResponse,
    orderId: string
  ): Promise<{ success: boolean; transactionId: string }> => {
    try {
      const response = await api.post('/payments/verify', {
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        orderId,
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  },

  /**
   * Process COD order
   */
  processCOD: async (orderId: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.post('/payments/cod', { orderId });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to process COD order');
    }
  },

  /**
   * Get saved cards
   */
  getSavedCards: async (): Promise<SavedCard[]> => {
    try {
      const response = await api.get('/payments/cards');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch saved cards');
    }
  },

  /**
   * Get saved UPI IDs
   */
  getSavedUPIs: async (): Promise<SavedUPI[]> => {
    try {
      const response = await api.get('/payments/upi');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch saved UPI IDs');
    }
  },

  /**
   * Delete saved card
   */
  deleteCard: async (cardId: string): Promise<void> => {
    try {
      await api.delete(`/payments/cards/${cardId}`);
    } catch (error) {
      throw new Error('Failed to delete card');
    }
  },

  /**
   * Get payment history
   */
  getTransactions: async (page = 1): Promise<PaymentTransaction[]> => {
    try {
      const response = await api.get('/payments/transactions', {
        params: { page, limit: 20 },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  },

  /**
   * Request refund
   */
  requestRefund: async (
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<{ refundId: string; status: string }> => {
    try {
      const response = await api.post('/payments/refund', {
        transactionId,
        amount, // Optional partial refund amount
        reason,
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to process refund');
    }
  },
};
```

---

## 🪝 usePayment Hook

```typescript
// src/hooks/usePayment.ts

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { paymentService } from '@/services/payment.service';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  PaymentMethod,
  RazorpaySuccessResponse,
  RazorpayErrorResponse
} from '@/types/payment.types';

interface UsePaymentReturn {
  isProcessing: boolean;
  error: string | null;
  processPayment: (method: PaymentMethod, orderId: string, amount: number) => Promise<boolean>;
  processCOD: (orderId: string) => Promise<boolean>;
}

export function usePayment(): UsePaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  const processPayment = useCallback(async (
    method: PaymentMethod,
    orderId: string,
    amount: number
  ): Promise<boolean> => {
    if (method === 'cod') {
      return processCOD(orderId);
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create order on backend
      const paymentOrder = await paymentService.createOrder(amount, orderId);

      // Step 2: Open Razorpay checkout
      const paymentResponse = await paymentService.openCheckout(
        paymentOrder,
        {
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
        }
      );

      // Step 3: Verify payment on backend
      const verification = await paymentService.verifyPayment(
        paymentResponse,
        orderId
      );

      if (verification.success) {
        // Clear cart and navigate to success
        clearCart();
        router.replace(`/order/${orderId}?status=success`);
        return true;
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (err) {
      const razorpayError = err as RazorpayErrorResponse;

      // Handle specific Razorpay errors
      if (razorpayError.code) {
        switch (razorpayError.code) {
          case 0: // Payment cancelled by user
            setError('Payment was cancelled');
            break;
          case 1: // Network error
            setError('Network error. Please try again.');
            break;
          case 2: // Payment failed
            setError(razorpayError.description || 'Payment failed');
            break;
          default:
            setError('Payment failed. Please try again.');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Payment failed');
      }

      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, clearCart, router]);

  const processCOD = useCallback(async (orderId: string): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await paymentService.processCOD(orderId);

      if (result.success) {
        clearCart();
        router.replace(`/order/${orderId}?status=success`);
        return true;
      }
      return false;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process order');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [clearCart, router]);

  return {
    isProcessing,
    error,
    processPayment,
    processCOD,
  };
}
```

---

## 💳 Payment Method Selector Component

```typescript
// src/components/payment/PaymentMethodSelector.tsx

import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Banknote,
  ChevronRight,
  Check
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '@/constants';
import { PaymentMethod } from '@/types/payment.types';

// ========================================
// TYPES
// ========================================

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  codAvailable?: boolean;
  savedCards?: number;
  savedUPIs?: number;
}

interface MethodOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  recommended?: boolean;
}

// ========================================
// CONSTANTS
// ========================================

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: 'upi',
    label: 'UPI',
    description: 'Pay using any UPI app',
    icon: Smartphone,
    recommended: true,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    description: 'All major banks supported',
    icon: Building2,
  },
  {
    id: 'wallet',
    label: 'Wallets',
    description: 'Paytm, PhonePe, Amazon Pay',
    icon: Wallet,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
];

// ========================================
// COMPONENT
// ========================================

function PaymentMethodSelectorBase({
  selectedMethod,
  onSelect,
  codAvailable = true,
  savedCards = 0,
  savedUPIs = 0,
}: PaymentMethodSelectorProps) {
  const { colors } = useTheme();

  const methods = codAvailable
    ? PAYMENT_METHODS
    : PAYMENT_METHODS.filter(m => m.id !== 'cod');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Payment Method
      </Text>

      {methods.map((method) => {
        const isSelected = selectedMethod === method.id;
        const Icon = method.icon;

        return (
          <Pressable
            key={method.id}
            style={[
              styles.methodCard,
              {
                backgroundColor: colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            onPress={() => onSelect(method.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${method.label}, ${method.description}`}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
              <Icon size={24} color={isSelected ? colors.primary : colors.text} />
            </View>

            <View style={styles.methodInfo}>
              <View style={styles.methodHeader}>
                <Text style={[styles.methodLabel, { color: colors.text }]}>
                  {method.label}
                </Text>
                {method.recommended && (
                  <View style={[styles.recommendedBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.recommendedText, { color: colors.primary }]}>
                      Recommended
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.methodDescription, { color: colors.textSecondary }]}>
                {method.description}
              </Text>

              {/* Saved items indicator */}
              {method.id === 'card' && savedCards > 0 && (
                <Text style={[styles.savedText, { color: colors.primary }]}>
                  {savedCards} saved card{savedCards > 1 ? 's' : ''}
                </Text>
              )}
              {method.id === 'upi' && savedUPIs > 0 && (
                <Text style={[styles.savedText, { color: colors.primary }]}>
                  {savedUPIs} saved UPI ID{savedUPIs > 1 ? 's' : ''}
                </Text>
              )}
            </View>

            <View style={styles.checkContainer}>
              {isSelected ? (
                <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                  <Check size={16} color="#FFF" />
                </View>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  methodLabel: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  methodDescription: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  savedText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
    marginTop: 4,
  },
  recommendedBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  recommendedText: {
    ...TYPOGRAPHY.overline,
    fontSize: 10,
  },
  checkContainer: {
    marginLeft: SPACING.md,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
});

export const PaymentMethodSelector = memo(PaymentMethodSelectorBase);
```

---

## 💰 Order Summary Component

```typescript
// src/components/payment/OrderSummary.tsx

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount?: number;
  total: number;
}

function OrderSummaryBase({
  subtotal,
  deliveryFee,
  tax,
  discount = 0,
  total,
}: OrderSummaryProps) {
  const { colors } = useTheme();

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Order Summary
      </Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Subtotal
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatCurrency(subtotal)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Delivery Fee
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Tax & Charges
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatCurrency(tax)}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.success }]}>
              Discount
            </Text>
            <Text style={[styles.value, { color: colors.success }]}>
              -{formatCurrency(discount)}
            </Text>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.row}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            {formatCurrency(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  title: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.lg,
  },
  rows: {
    gap: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...TYPOGRAPHY.body,
  },
  value: {
    ...TYPOGRAPHY.body,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
  },
  totalValue: {
    ...TYPOGRAPHY.h4,
    fontWeight: '700',
  },
});

export const OrderSummary = memo(OrderSummaryBase);
```

---

## 🧾 Payment Status Screen

```typescript
// src/app/payment/status.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { Button } from '@/components/ui/Button';

type PaymentStatusType = 'success' | 'failed' | 'pending';

export default function PaymentStatusScreen() {
  const { status, orderId, message } = useLocalSearchParams<{
    status: PaymentStatusType;
    orderId: string;
    message?: string;
  }>();
  const { colors } = useTheme();
  const router = useRouter();

  // Animations
  const iconScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 12 });
    contentOpacity.value = withDelay(300, withSpring(1));
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: colors.success,
          title: 'Payment Successful!',
          subtitle: 'Your order has been placed',
          primaryAction: 'Track Order',
          primaryRoute: `/order/${orderId}`,
        };
      case 'failed':
        return {
          icon: XCircle,
          iconColor: colors.error,
          title: 'Payment Failed',
          subtitle: message || 'Something went wrong. Please try again.',
          primaryAction: 'Try Again',
          primaryRoute: '/cart/checkout',
        };
      case 'pending':
        return {
          icon: Clock,
          iconColor: colors.warning,
          title: 'Payment Pending',
          subtitle: 'We are verifying your payment',
          primaryAction: 'Check Status',
          primaryRoute: `/order/${orderId}`,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: config.iconColor + '20' },
            ]}
          >
            <Icon size={64} color={config.iconColor} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, contentAnimatedStyle]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {config.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {config.subtitle}
          </Text>

          {orderId && (
            <View style={[styles.orderIdContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>
                Order ID
              </Text>
              <Text style={[styles.orderId, { color: colors.text }]}>
                #{orderId.slice(-8).toUpperCase()}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, contentAnimatedStyle]}>
        <Button
          title={config.primaryAction}
          onPress={() => router.replace(config.primaryRoute)}
          variant="primary"
        />
        <Button
          title="Back to Home"
          onPress={() => router.replace('/(tabs)')}
          variant="outline"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  orderIdContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  orderIdLabel: {
    ...TYPOGRAPHY.caption,
  },
  orderId: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.xs,
  },
  actions: {
    gap: SPACING.md,
    paddingBottom: SPACING.xl,
  },
});
```

---

## 🔒 Backend Payment Verification

### Server-Side Verification (Node.js Example)

```javascript
// Backend: routes/payment.js

const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
app.post('/api/payments/create-order', async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify payment
app.post('/api/payments/verify', async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderId,
  } = req.body;

  // Generate expected signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  // Verify signature
  if (expectedSignature === razorpay_signature) {
    // Payment is valid - update order status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
    });

    res.json({
      success: true,
      data: { transactionId: razorpay_payment_id },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid payment signature',
    });
  }
});

// Process refund
app.post('/api/payments/refund', async (req, res) => {
  const { transactionId, amount, reason } = req.body;

  try {
    const refund = await razorpay.payments.refund(transactionId, {
      amount, // Optional: partial refund
      notes: { reason },
    });

    res.json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## ✅ Payment Integration Checklist

```markdown
### Setup
- [ ] Razorpay account created (test + live)
- [ ] API keys configured (test for dev, live for prod)
- [ ] SDK installed and configured
- [ ] Backend endpoints ready

### Frontend
- [ ] Payment method selector component
- [ ] Order summary component
- [ ] Payment status screens (success/failed/pending)
- [ ] usePayment hook implemented
- [ ] Loading states during payment
- [ ] Error handling with user messages

### Backend
- [ ] Create order endpoint
- [ ] Verify payment endpoint
- [ ] Signature verification
- [ ] Refund endpoint
- [ ] Webhook handling for async events

### Payment Methods
- [ ] UPI support
- [ ] Card support
- [ ] Net Banking support
- [ ] Wallet support
- [ ] COD support (where applicable)

### Security
- [ ] Never expose secret key on frontend
- [ ] Signature verification on backend
- [ ] Amount verification (prevent tampering)
- [ ] Idempotency for payment creation

### Testing
- [ ] Test with Razorpay test cards
- [ ] Test UPI with test VPA
- [ ] Test payment failure scenarios
- [ ] Test refund flow
- [ ] Test on both platforms

### UX
- [ ] Clear payment method selection
- [ ] Order summary before payment
- [ ] Success/failure feedback
- [ ] Retry option on failure
- [ ] Receipt/confirmation display
```

---

## 🧪 Test Credentials

### Razorpay Test Cards

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any | Any future | Success |
| 5267 3181 8797 5449 | Any | Any future | Success |
| 4000 0000 0000 0002 | Any | Any future | Declined |

### Test UPI VPA

- `success@razorpay` - Always succeeds
- `failure@razorpay` - Always fails

### Test Net Banking

Any bank works in test mode with OTP: 1234
