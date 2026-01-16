/**
 * GRIHGO Customer App - Order Tracking Screen
 * Real-time order status with live updates
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { Button } from '../../components/ui';

interface OrderStatus {
    id: string;
    title: string;
    description: string;
    time: string;
    isCompleted: boolean;
    isCurrent: boolean;
}

const ORDER_STATUSES: OrderStatus[] = [
    {
        id: '1',
        title: 'Order Placed',
        description: 'Your order has been received',
        time: '4:30 PM',
        isCompleted: true,
        isCurrent: false,
    },
    {
        id: '2',
        title: 'Preparing',
        description: 'Restaurant is preparing your food',
        time: '4:35 PM',
        isCompleted: true,
        isCurrent: false,
    },
    {
        id: '3',
        title: 'On the Way',
        description: 'Your order is out for delivery',
        time: '4:50 PM',
        isCompleted: false,
        isCurrent: true,
    },
    {
        id: '4',
        title: 'Delivered',
        description: 'Enjoy your meal!',
        time: '',
        isCompleted: false,
        isCurrent: false,
    },
];

export default function OrderTrackingScreen() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [eta, setEta] = useState(15);
    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        // Pulse animation for current status
        pulseAnim.value = withRepeat(
            withTiming(1.2, { duration: 800 }),
            -1,
            true
        );

        // ETA countdown
        const interval = setInterval(() => {
            setEta((prev) => Math.max(1, prev - 1));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
    }));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
                    <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Track Order</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="help-circle-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Status Card */}
                <View style={[styles.statusCard, { backgroundColor: colors.primary }]}>
                    <View style={styles.statusHeader}>
                        <Text style={styles.statusTitle}>Arriving in</Text>
                        <Text style={styles.etaTime}>{eta} min</Text>
                    </View>

                    <View style={styles.deliveryInfo}>
                        <View style={styles.deliveryPersonInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>🛵</Text>
                            </View>
                            <View>
                                <Text style={styles.deliveryPerson}>Rahul S.</Text>
                                <Text style={styles.deliveryLabel}>Your delivery partner</Text>
                            </View>
                        </View>

                        <View style={styles.deliveryActions}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <MaterialCommunityIcons name="phone" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <MaterialCommunityIcons name="message-text" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Map Placeholder */}
                <View style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}>
                    <Text style={styles.mapEmoji}>🗺️</Text>
                    <Text style={[styles.mapText, { color: colors.textSecondary }]}>
                        Live tracking map
                    </Text>
                </View>

                {/* Order Timeline */}
                <View style={[styles.timeline, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.timelineTitle, { color: colors.text }]}>Order Status</Text>

                    {ORDER_STATUSES.map((status, index) => (
                        <View key={status.id} style={styles.timelineItem}>
                            {/* Status Icon */}
                            <View style={styles.timelineIconContainer}>
                                {status.isCurrent ? (
                                    <Animated.View
                                        style={[
                                            styles.currentIcon,
                                            { backgroundColor: colors.primary },
                                            pulseStyle,
                                        ]}
                                    >
                                        <MaterialCommunityIcons name="circle" size={8} color="#FFFFFF" />
                                    </Animated.View>
                                ) : (
                                    <View
                                        style={[
                                            styles.statusIcon,
                                            {
                                                backgroundColor: status.isCompleted
                                                    ? colors.success
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        {status.isCompleted && (
                                            <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
                                        )}
                                    </View>
                                )}

                                {/* Connector Line */}
                                {index < ORDER_STATUSES.length - 1 && (
                                    <View
                                        style={[
                                            styles.connector,
                                            {
                                                backgroundColor: status.isCompleted
                                                    ? colors.success
                                                    : colors.border,
                                            },
                                        ]}
                                    />
                                )}
                            </View>

                            {/* Status Content */}
                            <View style={styles.statusContent}>
                                <Text
                                    style={[
                                        styles.statusName,
                                        {
                                            color: status.isCurrent || status.isCompleted
                                                ? colors.text
                                                : colors.textMuted,
                                        },
                                    ]}
                                >
                                    {status.title}
                                </Text>
                                <Text
                                    style={[
                                        styles.statusDesc,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    {status.description}
                                </Text>
                            </View>

                            {/* Time */}
                            {status.time && (
                                <Text style={[styles.statusTime, { color: colors.textSecondary }]}>
                                    {status.time}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Order Details */}
                <View style={[styles.orderDetails, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.detailsTitle, { color: colors.text }]}>Order Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Order ID</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>#{id?.slice(-8)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Restaurant</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>Paradise Biryani</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Items</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>2 items</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total Paid</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>₹450</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer Actions */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    title="Need Help?"
                    variant="outline"
                    onPress={() => { }}
                    icon="help-circle"
                    style={{ flex: 1 }}
                />
                <Button
                    title="Back to Home"
                    variant="primary"
                    onPress={() => router.replace('/(tabs)')}
                    style={{ flex: 1 }}
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
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    content: {
        flex: 1,
    },
    statusCard: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
        marginBottom: SPACING.md,
    },
    statusHeader: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    statusTitle: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: SPACING.xs,
    },
    etaTime: {
        ...TYPOGRAPHY.h1,
        color: '#FFFFFF',
    },
    deliveryInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deliveryPersonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
    },
    deliveryPerson: {
        ...TYPOGRAPHY.bodyMedium,
        color: '#FFFFFF',
    },
    deliveryLabel: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    deliveryActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholder: {
        marginHorizontal: SPACING.lg,
        height: 150,
        borderRadius: RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    mapEmoji: {
        fontSize: 40,
        marginBottom: SPACING.sm,
    },
    mapText: {
        ...TYPOGRAPHY.caption,
    },
    timeline: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    timelineTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.lg,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    timelineIconContainer: {
        width: 30,
        alignItems: 'center',
    },
    statusIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    connector: {
        width: 2,
        flex: 1,
        marginTop: 4,
        marginBottom: -SPACING.md,
    },
    statusContent: {
        flex: 1,
        paddingLeft: SPACING.md,
    },
    statusName: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: 2,
    },
    statusDesc: {
        ...TYPOGRAPHY.caption,
    },
    statusTime: {
        ...TYPOGRAPHY.caption,
    },
    orderDetails: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
    },
    detailsTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
    },
    detailLabel: {
        ...TYPOGRAPHY.body,
    },
    detailValue: {
        ...TYPOGRAPHY.bodyMedium,
    },
    footer: {
        flexDirection: 'row',
        gap: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
});
