/**
 * GRIHGO Customer App - Notifications Screen
 * Shows all user notifications with proper categorization
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    Bell,
    ArrowLeft,
    Package,
    Tag,
    Star,
    Megaphone,
    Check,
    Trash2,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../constants';
import { EmptyState } from '../components/ui';
import { NOTIFICATIONS, AppNotification, formatRelativeTime } from '../data/mockData';

const NOTIFICATION_ICONS = {
    order: Package,
    offer: Tag,
    rating: Star,
    general: Megaphone,
};

const NOTIFICATION_COLORS = {
    order: '#2ECC71',
    offer: '#E67E22',
    rating: '#F1C40F',
    general: '#3498DB',
};

export default function NotificationsScreen() {
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [refreshing, setRefreshing] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleNotificationPress = (notification: AppNotification) => {
        markAsRead(notification.id);

        // Navigate based on type
        if (notification.type === 'order') {
            router.push('/(tabs)/reorder');
        } else if (notification.type === 'offer') {
            router.push('/offers');
        } else if (notification.type === 'rating') {
            router.push('/(tabs)/reorder');
        }
    };

    const renderNotification = (notification: AppNotification) => {
        const Icon = NOTIFICATION_ICONS[notification.type];
        const iconColor = NOTIFICATION_COLORS[notification.type];

        return (
            <TouchableOpacity
                key={notification.id}
                style={[
                    styles.notificationCard,
                    {
                        backgroundColor: notification.isRead ? colors.surface : colors.primaryBg,
                        borderColor: notification.isRead ? colors.border : colors.primary + '30',
                    },
                ]}
                onPress={() => handleNotificationPress(notification)}
                accessibilityRole="button"
                accessibilityLabel={`${notification.title}. ${notification.message}`}
                accessibilityHint={notification.isRead ? undefined : 'Unread notification'}
            >
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <Icon size={20} color={iconColor} />
                </View>

                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text
                            style={[
                                styles.notificationTitle,
                                { color: colors.text },
                                !notification.isRead && styles.unreadTitle,
                            ]}
                            numberOfLines={1}
                        >
                            {notification.title}
                        </Text>
                        {!notification.isRead && (
                            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                        )}
                    </View>

                    <Text
                        style={[styles.notificationMessage, { color: colors.textSecondary }]}
                        numberOfLines={2}
                    >
                        {notification.message}
                    </Text>

                    <Text style={[styles.notificationTime, { color: colors.textMuted }]}>
                        {formatRelativeTime(notification.timestamp)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Delete notification"
                    accessibilityRole="button"
                >
                    <Trash2 size={16} color={colors.textMuted} />
                </TouchableOpacity>
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

                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                {unreadCount > 0 ? (
                    <TouchableOpacity
                        onPress={markAllAsRead}
                        style={styles.markAllButton}
                        accessibilityLabel="Mark all as read"
                        accessibilityRole="button"
                    >
                        <Check size={20} color={colors.primary} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: TOUCH_TARGETS.minimum }} />
                )}
            </View>

            {notifications.length === 0 ? (
                <EmptyState
                    variant="notifications"
                    title="No notifications"
                    subtitle="You're all caught up! We'll notify you when you have new offers or order updates."
                    actionText="Go Home"
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
                    {/* Today Section */}
                    {notifications.some(n => {
                        const date = new Date(n.timestamp);
                        const today = new Date();
                        return date.toDateString() === today.toDateString();
                    }) && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                                Today
                            </Text>
                            {notifications
                                .filter(n => {
                                    const date = new Date(n.timestamp);
                                    const today = new Date();
                                    return date.toDateString() === today.toDateString();
                                })
                                .map(renderNotification)}
                        </View>
                    )}

                    {/* Earlier Section */}
                    {notifications.some(n => {
                        const date = new Date(n.timestamp);
                        const today = new Date();
                        return date.toDateString() !== today.toDateString();
                    }) && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                                Earlier
                            </Text>
                            {notifications
                                .filter(n => {
                                    const date = new Date(n.timestamp);
                                    const today = new Date();
                                    return date.toDateString() !== today.toDateString();
                                })
                                .map(renderNotification)}
                        </View>
                    )}

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    unreadBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    },
    unreadBadgeText: {
        ...TYPOGRAPHY.captionSmall,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    markAllButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        ...TYPOGRAPHY.caption,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.md,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: 4,
    },
    notificationTitle: {
        ...TYPOGRAPHY.bodyMedium,
        flex: 1,
    },
    unreadTitle: {
        fontWeight: '600',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    notificationMessage: {
        ...TYPOGRAPHY.bodySmall,
        lineHeight: 18,
        marginBottom: 4,
    },
    notificationTime: {
        ...TYPOGRAPHY.captionSmall,
    },
    deleteButton: {
        padding: SPACING.xs,
        alignSelf: 'flex-start',
    },
});
