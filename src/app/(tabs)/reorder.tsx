/**
 * GRIHGO Customer App - Reorder Screen
 * Past orders for quick reordering
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, ChevronRight, RotateCcw, Star, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { EmptyState, LoadingList } from '../../components/ui';
import {
    PAST_ORDERS,
    PastOrder,
    formatRelativeTime,
    getRestaurantById,
} from '../../data/mockData';

export default function ReorderScreen() {
    const { colors } = useTheme();
    const { addItem, items: cartItems, restaurant: cartRestaurant, clearCart } = useCart();
    const [orders, setOrders] = useState<PastOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reorderingId, setReorderingId] = useState<string | null>(null);

    // Load orders on mount
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setOrders(PAST_ORDERS);
        setIsLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(PAST_ORDERS);
        setRefreshing(false);
    }, []);

    const handleReorder = async (order: PastOrder) => {
        // Check if cart has items from different restaurant
        if (cartItems.length > 0 && cartRestaurant?.id !== order.restaurantId) {
            Alert.alert(
                'Replace cart items?',
                `Your cart contains items from ${cartRestaurant?.name}. Do you want to clear it and add items from ${order.restaurantName}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Replace',
                        style: 'destructive',
                        onPress: () => performReorder(order, true),
                    },
                ],
            );
            return;
        }

        performReorder(order, false);
    };

    const performReorder = async (order: PastOrder, clearExisting: boolean) => {
        setReorderingId(order.id);

        if (clearExisting) {
            clearCart();
        }

        // Get restaurant details
        const restaurant = getRestaurantById(order.restaurantId);
        if (!restaurant) {
            Alert.alert('Error', 'Restaurant not found');
            setReorderingId(null);
            return;
        }

        // Simulate adding items
        await new Promise(resolve => setTimeout(resolve, 500));

        // Add each item to cart
        order.items.forEach(item => {
            addItem(
                {
                    menuItemId: `${order.restaurantId}_${item.name.replace(/\s/g, '_')}`,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                },
                restaurant
            );
        });

        setReorderingId(null);

        // Navigate to cart
        router.push('/cart');
    };

    const handleViewDetails = (orderId: string) => {
        // Navigate to order details
        router.push({ pathname: '/order/[id]', params: { id: orderId } });
    };

    const renderRatingStars = (rating: number) => (
        <View style={styles.ratingContainer} accessibilityLabel={`Rated ${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={12}
                    color={star <= rating ? colors.rating : colors.border}
                    fill={star <= rating ? colors.rating : 'transparent'}
                />
            ))}
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Reorder</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Your recent orders
                    </Text>
                </View>
                <LoadingList count={3} variant="order" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Reorder</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {orders.length > 0
                        ? `${orders.length} past order${orders.length !== 1 ? 's' : ''}`
                        : 'Your recent orders'}
                </Text>
            </View>

            {orders.length === 0 ? (
                <EmptyState
                    variant="orders"
                    title="No orders yet"
                    subtitle="Once you place an order, it will appear here for easy reordering"
                    actionText="Browse Restaurants"
                    onAction={() => router.push('/(tabs)')}
                />
            ) : (
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                >
                    {orders.map((order) => (
                        <View
                            key={order.id}
                            style={[styles.orderCard, { backgroundColor: colors.surface, ...SHADOWS.md }]}
                            accessibilityRole="button"
                            accessibilityLabel={`Order from ${order.restaurantName}, ${order.items.length} items, ₹${order.totalAmount}`}
                        >
                            {/* Order Header */}
                            <View style={styles.orderHeader}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={order.restaurantImage}
                                        style={styles.restaurantImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.orderInfo}>
                                    <Text style={[styles.restaurantName, { color: colors.text }]}>
                                        {order.restaurantName}
                                    </Text>
                                    <View style={styles.orderMeta}>
                                        <Clock size={12} color={colors.textSecondary} />
                                        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                                            {formatRelativeTime(order.orderDate)}
                                        </Text>
                                        {order.rating && renderRatingStars(order.rating)}
                                    </View>
                                </View>
                                <Text style={[styles.amount, { color: colors.text }]}>
                                    ₹{order.totalAmount}
                                </Text>
                            </View>

                            {/* Items List */}
                            <View style={[styles.itemsContainer, { borderTopColor: colors.border }]}>
                                <Text style={[styles.itemsText, { color: colors.textSecondary }]} numberOfLines={2}>
                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                </Text>
                            </View>

                            {/* Status Badge */}
                            <View style={styles.statusRow}>
                                <View style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: order.status === 'delivered'
                                            ? colors.successBg
                                            : order.status === 'cancelled'
                                                ? colors.errorBg
                                                : colors.warningBg
                                    }
                                ]}>
                                    {order.status === 'delivered' && <Check size={12} color={colors.success} />}
                                    <Text style={[
                                        styles.statusText,
                                        {
                                            color: order.status === 'delivered'
                                                ? colors.success
                                                : order.status === 'cancelled'
                                                    ? colors.error
                                                    : colors.warning
                                        }
                                    ]}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.reorderButton, { backgroundColor: colors.primary }]}
                                    onPress={() => handleReorder(order)}
                                    disabled={reorderingId === order.id}
                                    accessibilityLabel={`Reorder from ${order.restaurantName}`}
                                    accessibilityRole="button"
                                >
                                    {reorderingId === order.id ? (
                                        <Text style={styles.reorderText}>Adding...</Text>
                                    ) : (
                                        <>
                                            <RotateCcw size={16} color="#FFFFFF" />
                                            <Text style={styles.reorderText}>Reorder</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.detailsButton, { borderColor: colors.border }]}
                                    onPress={() => handleViewDetails(order.id)}
                                    accessibilityLabel="View order details"
                                    accessibilityRole="button"
                                >
                                    <Text style={[styles.detailsText, { color: colors.primary }]}>
                                        View Details
                                    </Text>
                                    <ChevronRight size={16} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h2,
    },
    subtitle: {
        ...TYPOGRAPHY.bodySmall,
        marginTop: SPACING.xs,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    orderCard: {
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    imageContainer: {
        width: 56,
        height: 56,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    orderInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    restaurantName: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: 4,
    },
    orderMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    orderDate: {
        ...TYPOGRAPHY.caption,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginLeft: SPACING.sm,
        gap: 2,
    },
    amount: {
        ...TYPOGRAPHY.price,
    },
    itemsContainer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        borderTopWidth: 1,
        paddingTop: SPACING.md,
        marginTop: -SPACING.sm,
    },
    itemsText: {
        ...TYPOGRAPHY.bodySmall,
        lineHeight: 20,
    },
    statusRow: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        gap: 4,
    },
    statusText: {
        ...TYPOGRAPHY.captionSmall,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        gap: SPACING.md,
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        minHeight: TOUCH_TARGETS.minimum,
    },
    reorderText: {
        ...TYPOGRAPHY.button,
        color: '#FFFFFF',
    },
    detailsButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        gap: SPACING.xs,
        minHeight: TOUCH_TARGETS.minimum,
    },
    detailsText: {
        ...TYPOGRAPHY.button,
    },
});
