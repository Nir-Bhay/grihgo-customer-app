/**
 * GRIHGO Customer App - Checkout Screen
 * Address selection, payment method, and order placement
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Home,
    Building2,
    Check,
    Smartphone,
    CreditCard,
    Wallet,
    Banknote,
    Plus,
    Clock,
    MapPin,
    ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { Button } from '../../components/ui';

const ADDRESSES = [
    {
        id: '1',
        type: 'Home',
        address: '123 Main Street, Koramangala',
        landmark: 'Near Cafe Coffee Day',
        isDefault: true,
    },
    {
        id: '2',
        type: 'Work',
        address: '456 Tech Park, Whitefield',
        landmark: 'Building 5, Floor 3',
        isDefault: false,
    },
];

const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using any UPI app' },
    { id: 'card', name: 'Card', icon: CreditCard, description: 'Credit or Debit card' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, description: '₹150 available' },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
];

export default function CheckoutScreen() {
    const { colors, isDark } = useTheme();
    const { total, itemCount, restaurant, clearCart } = useCart();
    const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].id);
    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const selectedAddressData = ADDRESSES.find(a => a.id === selectedAddress);

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);

        // Simulate order placement
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Clear cart and navigate to order tracking
        clearCart();
        router.replace({
            pathname: '/order/[id]',
            params: { id: 'order_' + Date.now() },
        });
    };

    const handleAddNewAddress = () => {
        Alert.alert(
            'Add New Address',
            'This feature will be available soon!',
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
                <View style={{ width: TOUCH_TARGETS.minimum }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Delivery Time Estimate */}
                <View style={[styles.deliveryEstimate, { backgroundColor: colors.success + '15' }]}>
                    <Clock size={20} color={colors.success} />
                    <View style={styles.deliveryInfo}>
                        <Text style={[styles.deliveryTime, { color: colors.success }]}>
                            Estimated delivery: 25-35 min
                        </Text>
                        <Text style={[styles.deliveryNote, { color: colors.textSecondary }]}>
                            {restaurant?.name || 'Restaurant'} is preparing your order
                        </Text>
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <MapPin size={20} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleAddNewAddress}
                            style={styles.addNewButton}
                            accessibilityLabel="Add new address"
                            accessibilityRole="button"
                        >
                            <Plus size={16} color={colors.primary} />
                            <Text style={[styles.addNew, { color: colors.primary }]}>Add New</Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        accessibilityRole="radiogroup"
                        accessibilityLabel="Select delivery address"
                    >
                        {ADDRESSES.map((address) => {
                            const isSelected = selectedAddress === address.id;
                            const AddressIcon = address.type === 'Home' ? Home : Building2;

                            return (
                                <TouchableOpacity
                                    key={address.id}
                                    style={[
                                        styles.addressCard,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: isSelected ? colors.primary : colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedAddress(address.id)}
                                    accessibilityRole="radio"
                                    accessibilityState={{ checked: isSelected }}
                                    accessibilityLabel={`${address.type} address: ${address.address}. ${address.landmark}${address.isDefault ? '. Default address' : ''}`}
                                >
                                    <View style={styles.addressLeft}>
                                        <View style={styles.addressType}>
                                            <AddressIcon size={16} color={colors.primary} />
                                            <Text style={[styles.addressTypeName, { color: colors.text }]}>
                                                {address.type}
                                            </Text>
                                            {address.isDefault && (
                                                <View style={[styles.defaultBadge, { backgroundColor: colors.primary + '20' }]}>
                                                    <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.addressText, { color: colors.text }]}>{address.address}</Text>
                                        <Text style={[styles.landmark, { color: colors.textSecondary }]}>
                                            {address.landmark}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.radio,
                                            {
                                                borderColor: isSelected ? colors.primary : colors.border,
                                                backgroundColor: isSelected ? colors.primary : 'transparent',
                                            },
                                        ]}
                                    >
                                        {isSelected && <Check size={14} color="#FFFFFF" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <CreditCard size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
                    </View>

                    <View
                        accessibilityRole="radiogroup"
                        accessibilityLabel="Select payment method"
                    >
                        {PAYMENT_METHODS.map((method) => {
                            const isSelected = selectedPayment === method.id;
                            const PaymentIcon = method.icon;

                            return (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[
                                        styles.paymentCard,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: isSelected ? colors.primary : colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedPayment(method.id)}
                                    accessibilityRole="radio"
                                    accessibilityState={{ checked: isSelected }}
                                    accessibilityLabel={`${method.name}. ${method.description}`}
                                >
                                    <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '15' }]}>
                                        <PaymentIcon size={20} color={colors.primary} />
                                    </View>

                                    <View style={styles.paymentInfo}>
                                        <Text style={[styles.paymentName, { color: colors.text }]}>{method.name}</Text>
                                        <Text style={[styles.paymentDesc, { color: colors.textSecondary }]}>
                                            {method.description}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.radio,
                                            {
                                                borderColor: isSelected ? colors.primary : colors.border,
                                                backgroundColor: isSelected ? colors.primary : 'transparent',
                                            },
                                        ]}
                                    >
                                        {isSelected && <Check size={14} color="#FFFFFF" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Order Summary */}
                <View
                    style={[styles.summarySection, { backgroundColor: colors.surface }]}
                    accessibilityRole="summary"
                    accessibilityLabel={`Order summary. ${itemCount} items. Total ${total} rupees`}
                >
                    <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                            {itemCount} item{itemCount > 1 ? 's' : ''}
                        </Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>₹{total}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                            Delivering to
                        </Text>
                        <Text style={[styles.summaryAddress, { color: colors.text }]} numberOfLines={1}>
                            {selectedAddressData?.type}
                        </Text>
                    </View>
                </View>

                {/* Secure Payment Badge */}
                <View style={styles.secureBadge}>
                    <ShieldCheck size={16} color={colors.success} />
                    <Text style={[styles.secureText, { color: colors.textSecondary }]}>
                        100% Secure Payments
                    </Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Place Order Button */}
            <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <View style={styles.footerInfo}>
                    <Text style={[styles.footerTotal, { color: colors.text }]}>₹{total}</Text>
                    <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Total Amount</Text>
                </View>
                <Button
                    title="Place Order"
                    onPress={handlePlaceOrder}
                    variant="primary"
                    loading={isPlacingOrder}
                    icon="check"
                    iconPosition="right"
                    accessibilityHint="Confirm and place your order"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    headerButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    content: {
        flex: 1,
    },
    deliveryEstimate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        gap: SPACING.md,
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryTime: {
        ...TYPOGRAPHY.bodyMedium,
    },
    deliveryNote: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
    },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        minHeight: TOUCH_TARGETS.minimum,
        paddingHorizontal: SPACING.sm,
    },
    addNew: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    addressCard: {
        flexDirection: 'row',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        borderWidth: 1.5,
        marginBottom: SPACING.md,
        minHeight: TOUCH_TARGETS.recommended,
    },
    addressLeft: {
        flex: 1,
    },
    addressType: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    addressTypeName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    defaultBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.xs,
    },
    defaultText: {
        ...TYPOGRAPHY.caption,
        fontSize: 10,
        fontWeight: '600',
    },
    addressText: {
        ...TYPOGRAPHY.body,
        marginBottom: 2,
    },
    landmark: {
        ...TYPOGRAPHY.caption,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        borderWidth: 1.5,
        marginBottom: SPACING.md,
        gap: SPACING.md,
        minHeight: TOUCH_TARGETS.recommended,
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentInfo: {
        flex: 1,
    },
    paymentName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    paymentDesc: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    summarySection: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
    },
    summaryTitle: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: SPACING.md,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        ...TYPOGRAPHY.body,
    },
    summaryValue: {
        ...TYPOGRAPHY.h3,
    },
    summaryAddress: {
        ...TYPOGRAPHY.bodySmallMedium,
        maxWidth: '50%',
    },
    divider: {
        height: 1,
        marginVertical: SPACING.md,
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    secureText: {
        ...TYPOGRAPHY.caption,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        borderTopWidth: 1,
        ...SHADOWS.lg,
    },
    footerInfo: {},
    footerTotal: {
        ...TYPOGRAPHY.h3,
    },
    footerLabel: {
        ...TYPOGRAPHY.caption,
    },
});
