/**
 * GRIHGO Customer App - Cart Screen
 * Shopping cart with items, quantities, and checkout
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Plus,
    Minus,
    Trash2,
    FileText,
    Tag,
    Heart,
    X,
    ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { Button, EmptyState } from '../../components/ui';

export default function CartScreen() {
    console.log('[CartScreen] Component rendering...');

    const { colors, isDark } = useTheme();
    const {
        items,
        restaurant,
        itemCount,
        subtotal,
        deliveryFee,
        taxes,
        tip,
        discount,
        total,
        couponCode,
        updateQuantity,
        removeItem,
        clearCart,
        setTip,
        applyCoupon,
        removeCoupon,
    } = useCart();

    // DEBUG: Log cart data
    console.log('[CartScreen] Cart data:', {
        items: items,
        itemsLength: items?.length ?? 'undefined',
        itemsType: typeof items,
        isArray: Array.isArray(items),
        restaurant: restaurant?.name ?? 'null',
        itemCount,
    });

    const [couponInput, setCouponInput] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [specialInstructions, setSpecialInstructions] = useState('');

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        const success = await applyCoupon(couponInput.trim());
        setIsApplyingCoupon(false);
        if (success) {
            setCouponInput('');
        }
    };

    // Confirm before clearing cart
    const handleClearCart = () => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => clearCart(),
                },
            ],
            { cancelable: true }
        );
    };

    // Empty cart state
    if (items.length === 0) {
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
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Cart</Text>
                    <View style={{ width: TOUCH_TARGETS.minimum }} />
                </View>

                <EmptyState
                    variant="cart"
                    actionText="Browse Restaurants"
                    onAction={() => router.replace('/(tabs)')}
                />
            </SafeAreaView>
        );
    }

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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Cart</Text>
                <TouchableOpacity
                    onPress={handleClearCart}
                    style={styles.headerButton}
                    accessibilityLabel="Clear cart"
                    accessibilityRole="button"
                    accessibilityHint="Removes all items from cart"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={[styles.clearText, { color: colors.error }]}>Clear</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Restaurant Info */}
                <TouchableOpacity
                    style={[styles.restaurantInfo, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/restaurant/${restaurant?.id}`)}
                    accessibilityLabel={`${restaurant?.name}. Tap to add more items`}
                    accessibilityRole="button"
                >
                    <Text style={[styles.restaurantName, { color: colors.text }]}>
                        {restaurant?.name}
                    </Text>
                    <View style={styles.addMoreButton}>
                        <Text style={[styles.addMoreText, { color: colors.primary }]}>Add More</Text>
                        <Plus size={16} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* Cart Items */}
                <View
                    style={[styles.itemsSection, { backgroundColor: colors.surface }]}
                    accessibilityLabel={`Cart items. ${items.length} items`}
                >
                    {items.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.cartItem,
                                index < items.length - 1 && { borderBottomColor: colors.border },
                            ]}
                            accessibilityLabel={`${item.name}, quantity ${item.quantity}, price ${item.price * item.quantity} rupees`}
                        >
                            {/* Veg/Non-veg indicator */}
                            <View
                                style={[
                                    styles.vegIndicator,
                                    { borderColor: item.isVeg ? colors.success : colors.error },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.vegDot,
                                        { backgroundColor: item.isVeg ? colors.success : colors.error },
                                    ]}
                                />
                            </View>

                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                                    ₹{item.price}
                                </Text>
                            </View>

                            <View style={styles.quantityControl}>
                                <TouchableOpacity
                                    style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                    accessibilityLabel={item.quantity === 1 ? `Remove ${item.name}` : `Decrease quantity of ${item.name}`}
                                    accessibilityRole="button"
                                >
                                    {item.quantity === 1 ? (
                                        <Trash2 size={14} color="#FFFFFF" />
                                    ) : (
                                        <Minus size={14} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                                <Text
                                    style={[styles.quantity, { color: colors.text }]}
                                    accessibilityLabel={`Quantity: ${item.quantity}`}
                                >
                                    {item.quantity}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                    accessibilityLabel={`Increase quantity of ${item.name}`}
                                    accessibilityRole="button"
                                >
                                    <Plus size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.itemTotal, { color: colors.text }]}>
                                ₹{item.price * item.quantity}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Special Instructions */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <FileText size={20} color={colors.textSecondary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Special Instructions</Text>
                    </View>
                    <TextInput
                        style={[styles.instructionsInput, { color: colors.text, borderColor: colors.border }]}
                        placeholder="Add cooking instructions, allergies, etc."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        value={specialInstructions}
                        onChangeText={setSpecialInstructions}
                        accessibilityLabel="Special instructions"
                        accessibilityHint="Add any cooking instructions or allergy information"
                    />
                </View>

                {/* Coupon */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <Tag size={20} color={colors.textSecondary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apply Coupon</Text>
                    </View>

                    {couponCode ? (
                        <View
                            style={[styles.appliedCoupon, { backgroundColor: colors.success + '15' }]}
                            accessibilityRole="text"
                            accessibilityLabel={`Coupon ${couponCode} applied. Saving ${discount} rupees`}
                        >
                            <View>
                                <Text style={[styles.couponCode, { color: colors.success }]}>{couponCode}</Text>
                                <Text style={[styles.couponSavings, { color: colors.success }]}>
                                    You're saving ₹{discount}!
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={removeCoupon}
                                accessibilityLabel="Remove coupon"
                                accessibilityRole="button"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <X size={24} color={colors.success} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.couponInputRow}>
                            <TextInput
                                style={[styles.couponTextInput, { color: colors.text, borderColor: colors.border }]}
                                placeholder="Enter coupon code"
                                placeholderTextColor={colors.textMuted}
                                value={couponInput}
                                onChangeText={setCouponInput}
                                autoCapitalize="characters"
                                accessibilityLabel="Coupon code"
                                accessibilityHint="Enter a valid coupon code to get discount"
                            />
                            <Button
                                title="Apply"
                                onPress={handleApplyCoupon}
                                variant="primary"
                                size="small"
                                loading={isApplyingCoupon}
                                disabled={!couponInput.trim()}
                            />
                        </View>
                    )}

                    {/* Browse Offers Link */}
                    {!couponCode && (
                        <TouchableOpacity
                            style={styles.browseOffersLink}
                            onPress={() => router.push('/offers')}
                            accessibilityLabel="View all coupons"
                            accessibilityRole="link"
                        >
                            <Text style={[styles.browseOffersText, { color: colors.primary }]}>
                                View all coupons
                            </Text>
                            <ChevronRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tip */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <Heart size={20} color={colors.textSecondary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tip your delivery partner</Text>
                    </View>
                    <Text style={[styles.tipSubtitle, { color: colors.textMuted }]}>
                        100% of your tip goes to your delivery partner
                    </Text>
                    <View
                        style={styles.tipOptions}
                        accessibilityLabel="Select tip amount"
                    >
                        {[0, 20, 30, 50].map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                style={[
                                    styles.tipOption,
                                    {
                                        backgroundColor: tip === amount ? colors.primary : colors.background,
                                        borderColor: tip === amount ? colors.primary : colors.border,
                                    },
                                ]}
                                onPress={() => setTip(amount)}
                                accessibilityState={{ checked: tip === amount }}
                                accessibilityLabel={amount === 0 ? 'No tip' : `${amount} rupees tip`}
                            >
                                <Text
                                    style={[
                                        styles.tipText,
                                        { color: tip === amount ? '#FFFFFF' : colors.text },
                                    ]}
                                >
                                    {amount === 0 ? 'No Tip' : `₹${amount}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Bill Details */}
                <View
                    style={[styles.section, { backgroundColor: colors.surface }]}
                    accessibilityLabel={`Bill details. Total amount ${total} rupees`}
                >
                    <Text style={[styles.billTitle, { color: colors.text }]}>Bill Details</Text>

                    <View style={styles.billRow}>
                        <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Item Total</Text>
                        <Text style={[styles.billValue, { color: colors.text }]}>₹{subtotal}</Text>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
                        <Text style={[styles.billValue, { color: colors.text }]}>₹{deliveryFee}</Text>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Taxes & Charges</Text>
                        <Text style={[styles.billValue, { color: colors.text }]}>₹{taxes}</Text>
                    </View>

                    {tip > 0 && (
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Delivery Partner Tip</Text>
                            <Text style={[styles.billValue, { color: colors.text }]}>₹{tip}</Text>
                        </View>
                    )}

                    {discount > 0 && (
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, { color: colors.success }]}>Coupon Discount</Text>
                            <Text style={[styles.billValue, { color: colors.success }]}>-₹{discount}</Text>
                        </View>
                    )}

                    <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>To Pay</Text>
                        <Text style={[styles.totalValue, { color: colors.text }]}>₹{total}</Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Checkout Button */}
            <View style={[styles.checkoutBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <View style={styles.checkoutInfo}>
                    <Text style={[styles.checkoutTotal, { color: colors.text }]}>₹{total}</Text>
                    <Text style={[styles.checkoutItems, { color: colors.textSecondary }]}>
                        {itemCount} item{itemCount > 1 ? 's' : ''}
                    </Text>
                </View>
                <Button
                    title="Proceed to Checkout"
                    onPress={() => router.push('/cart/checkout')}
                    variant="primary"
                    icon="arrow-right"
                    iconPosition="right"
                    accessibilityHint="Proceed to payment and delivery options"
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
    clearText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    content: {
        flex: 1,
    },
    restaurantInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: RADIUS.lg,
    },
    restaurantName: {
        ...TYPOGRAPHY.bodyMedium,
        flex: 1,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        minHeight: TOUCH_TARGETS.minimum,
        paddingHorizontal: SPACING.sm,
    },
    addMoreText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    itemsSection: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        gap: SPACING.sm,
    },
    vegIndicator: {
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        ...TYPOGRAPHY.bodySmallMedium,
        marginBottom: 2,
    },
    itemPrice: {
        ...TYPOGRAPHY.caption,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        ...TYPOGRAPHY.bodyMedium,
        minWidth: 24,
        textAlign: 'center',
    },
    itemTotal: {
        ...TYPOGRAPHY.bodyMedium,
        minWidth: 60,
        textAlign: 'right',
    },
    section: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.bodyMedium,
    },
    instructionsInput: {
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        minHeight: 80,
        textAlignVertical: 'top',
        ...TYPOGRAPHY.body,
    },
    couponInputRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    couponTextInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        height: TOUCH_TARGETS.recommended,
        ...TYPOGRAPHY.body,
    },
    appliedCoupon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
    },
    couponCode: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '700',
    },
    couponSavings: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    browseOffersLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md,
        paddingVertical: SPACING.sm,
        minHeight: TOUCH_TARGETS.minimum,
    },
    browseOffersText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    tipSubtitle: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.md,
    },
    tipOptions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    tipOption: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        alignItems: 'center',
        minHeight: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
    },
    tipText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    billTitle: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: SPACING.md,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    billLabel: {
        ...TYPOGRAPHY.body,
    },
    billValue: {
        ...TYPOGRAPHY.body,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
    },
    totalLabel: {
        ...TYPOGRAPHY.bodyMedium,
    },
    totalValue: {
        ...TYPOGRAPHY.h3,
    },
    checkoutBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        borderTopWidth: 1,
        ...SHADOWS.lg,
    },
    checkoutInfo: {},
    checkoutTotal: {
        ...TYPOGRAPHY.h3,
    },
    checkoutItems: {
        ...TYPOGRAPHY.caption,
    },
});
