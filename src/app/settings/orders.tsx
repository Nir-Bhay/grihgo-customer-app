/**
 * GRIHGO Customer App - Order History Screen
 * View past orders with reorder functionality
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Package,
    RefreshCw,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';

type OrderStatus = 'delivered' | 'cancelled';
type FilterTab = 'all' | 'delivered' | 'cancelled';

interface OrderItem {
    name: string;
    quantity: number;
}

interface Order {
    id: string;
    restaurantName: string;
    restaurantImage: string;
    items: OrderItem[];
    total: number;
    date: string;
    status: OrderStatus;
    orderId: string;
}

const ORDERS: Order[] = [
    {
        id: '1',
        restaurantName: 'Burger King',
        restaurantImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop',
        items: [
            { name: 'Whopper', quantity: 2 },
            { name: 'Fries', quantity: 1 },
            { name: 'Coke', quantity: 2 },
        ],
        total: 548,
        date: '15 Jan, 8:30 PM',
        status: 'delivered',
        orderId: 'GRH-2024-001234',
    },
    {
        id: '2',
        restaurantName: 'Pizza Hut',
        restaurantImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop',
        items: [
            { name: 'Margherita Pizza', quantity: 1 },
            { name: 'Garlic Bread', quantity: 1 },
        ],
        total: 699,
        date: '14 Jan, 1:15 PM',
        status: 'delivered',
        orderId: 'GRH-2024-001233',
    },
    {
        id: '3',
        restaurantName: 'Dominos',
        restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
        items: [
            { name: 'Pepperoni Pizza', quantity: 1 },
        ],
        total: 449,
        date: '12 Jan, 7:45 PM',
        status: 'cancelled',
        orderId: 'GRH-2024-001230',
    },
    {
        id: '4',
        restaurantName: 'McDonald\'s',
        restaurantImage: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=100&h=100&fit=crop',
        items: [
            { name: 'McSpicy', quantity: 1 },
            { name: 'McFlurry', quantity: 1 },
        ],
        total: 329,
        date: '10 Jan, 6:00 PM',
        status: 'delivered',
        orderId: 'GRH-2024-001225',
    },
];

export default function OrdersScreen() {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    const filteredOrders = ORDERS.filter((order) => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    const handleReorder = (order: Order) => {
        Alert.alert(
            'Reorder',
            `Add items from ${order.restaurantName} to cart?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add to Cart',
                    onPress: () => {
                        Alert.alert('Success', 'Items added to cart!');
                    },
                },
            ]
        );
    };

    const handleViewOrder = (order: Order) => {
        Alert.alert(
            `Order #${order.orderId}`,
            `${order.items.map(i => `${i.quantity}x ${i.name}`).join('\n')}\n\nTotal: ₹${order.total}`,
            [{ text: 'OK' }]
        );
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'delivered':
                return CheckCircle;
            case 'cancelled':
                return XCircle;
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'delivered':
                return colors.success;
            case 'cancelled':
                return colors.error;
        }
    };

    const getStatusBgColor = (status: OrderStatus) => {
        switch (status) {
            case 'delivered':
                return colors.successBg;
            case 'cancelled':
                return colors.errorBg;
        }
    };

    const renderTab = (tab: FilterTab, label: string) => (
        <TouchableOpacity
            key={tab}
            style={[
                styles.tab,
                activeTab === tab && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
        >
            <Text
                style={[
                    styles.tabText,
                    { color: activeTab === tab ? '#FFFFFF' : colors.textSecondary },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderOrder = (order: Order) => {
        const StatusIcon = getStatusIcon(order.status);
        const statusColor = getStatusColor(order.status);
        const statusBgColor = getStatusBgColor(order.status);
        const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

        return (
            <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, { backgroundColor: colors.surface, ...SHADOWS.sm }]}
                onPress={() => handleViewOrder(order)}
                accessibilityLabel={`Order from ${order.restaurantName}. ${itemsSummary}. Total ₹${order.total}. ${order.status}`}
                accessibilityRole="button"
            >
                <View style={styles.orderHeader}>
                    <View style={[styles.restaurantImage, { backgroundColor: colors.border }]}>
                        <Package size={24} color={colors.textSecondary} />
                    </View>
                    <View style={styles.orderInfo}>
                        <Text style={[styles.restaurantName, { color: colors.text }]}>
                            {order.restaurantName}
                        </Text>
                        <Text style={[styles.orderItems, { color: colors.textSecondary }]} numberOfLines={1}>
                            {itemsSummary}
                        </Text>
                        <View style={styles.orderMeta}>
                            <Clock size={12} color={colors.textMuted} />
                            <Text style={[styles.orderDate, { color: colors.textMuted }]}>
                                {order.date}
                            </Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color={colors.border} />
                </View>

                <View style={[styles.orderFooter, { borderTopColor: colors.borderLight }]}>
                    <View style={styles.orderTotal}>
                        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
                        <Text style={[styles.totalAmount, { color: colors.text }]}>₹{order.total}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                        <StatusIcon size={12} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Text>
                    </View>

                    {order.status === 'delivered' && (
                        <TouchableOpacity
                            style={[styles.reorderButton, { borderColor: colors.primary }]}
                            onPress={() => handleReorder(order)}
                            accessibilityLabel={`Reorder from ${order.restaurantName}`}
                            accessibilityRole="button"
                        >
                            <RefreshCw size={14} color={colors.primary} />
                            <Text style={[styles.reorderText, { color: colors.primary }]}>
                                Reorder
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Filter Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
                {renderTab('all', 'All Orders')}
                {renderTab('delivered', 'Delivered')}
                {renderTab('cancelled', 'Cancelled')}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(renderOrder)
                ) : (
                    <View style={styles.emptyState}>
                        <Package size={64} color={colors.textMuted} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            No orders found
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            Your order history will appear here
                        </Text>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
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
    backButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        padding: SPACING.xs,
        borderRadius: RADIUS.lg,
        gap: SPACING.xs,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    tabText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
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
    restaurantImage: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    restaurantName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    orderItems: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    orderMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    orderDate: {
        ...TYPOGRAPHY.captionSmall,
    },
    orderFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        gap: SPACING.md,
    },
    orderTotal: {
        flex: 1,
    },
    totalLabel: {
        ...TYPOGRAPHY.captionSmall,
    },
    totalAmount: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        gap: 4,
    },
    statusText: {
        ...TYPOGRAPHY.captionSmall,
        fontWeight: '600',
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        gap: 4,
    },
    reorderText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        ...TYPOGRAPHY.h4,
        marginTop: SPACING.lg,
    },
    emptySubtitle: {
        ...TYPOGRAPHY.body,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
});
