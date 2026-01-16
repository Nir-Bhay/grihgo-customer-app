/**
 * GRIHGO Customer App - Empty State Component
 * Reusable empty state for lists and screens
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../../constants';
import { Button } from './Button';
import {
    ShoppingBag,
    Heart,
    Search,
    MapPin,
    Bell,
    FileText,
    Package,
    Star,
    LucideIcon,
} from 'lucide-react-native';

type EmptyStateVariant =
    | 'cart'
    | 'favorites'
    | 'search'
    | 'orders'
    | 'addresses'
    | 'notifications'
    | 'reviews'
    | 'generic';

interface EmptyStateProps {
    /** Predefined variant for common empty states */
    variant?: EmptyStateVariant;
    /** Custom icon component (overrides variant icon) */
    icon?: LucideIcon;
    /** Custom emoji (alternative to icon) */
    emoji?: string;
    /** Title text */
    title?: string;
    /** Subtitle/description text */
    subtitle?: string;
    /** Action button text */
    actionText?: string;
    /** Action button handler */
    onAction?: () => void;
    /** Custom container style */
    style?: ViewStyle;
    /** Size variant */
    size?: 'small' | 'medium' | 'large';
}

const VARIANT_CONFIG: Record<EmptyStateVariant, {
    icon: LucideIcon;
    emoji: string;
    title: string;
    subtitle: string;
}> = {
    cart: {
        icon: ShoppingBag,
        emoji: '🛒',
        title: 'Your cart is empty',
        subtitle: 'Add items from restaurants to get started',
    },
    favorites: {
        icon: Heart,
        emoji: '💔',
        title: 'No favorites yet',
        subtitle: 'Tap the heart icon on restaurants or dishes to save them here',
    },
    search: {
        icon: Search,
        emoji: '🔍',
        title: 'No results found',
        subtitle: 'Try searching with different keywords',
    },
    orders: {
        icon: FileText,
        emoji: '📋',
        title: 'No orders yet',
        subtitle: 'Your order history will appear here',
    },
    addresses: {
        icon: MapPin,
        emoji: '📍',
        title: 'No saved addresses',
        subtitle: 'Add addresses for faster checkout',
    },
    notifications: {
        icon: Bell,
        emoji: '🔔',
        title: 'No notifications',
        subtitle: 'You\'re all caught up!',
    },
    reviews: {
        icon: Star,
        emoji: '⭐',
        title: 'No reviews yet',
        subtitle: 'Rate your orders to help others',
    },
    generic: {
        icon: Package,
        emoji: '📦',
        title: 'Nothing here yet',
        subtitle: 'Check back later',
    },
};

export function EmptyState({
    variant = 'generic',
    icon,
    emoji,
    title,
    subtitle,
    actionText,
    onAction,
    style,
    size = 'medium',
}: EmptyStateProps) {
    const { colors } = useTheme();
    const config = VARIANT_CONFIG[variant];

    const IconComponent = icon || config.icon;
    const displayEmoji = emoji || config.emoji;
    const displayTitle = title || config.title;
    const displaySubtitle = subtitle || config.subtitle;

    const iconSizes = {
        small: 40,
        medium: 60,
        large: 80,
    };

    const emojiSizes = {
        small: 32,
        medium: 48,
        large: 64,
    };

    return (
        <View
            style={[styles.container, styles[size], style]}
            accessibilityRole="text"
            accessibilityLabel={`${displayTitle}. ${displaySubtitle}`}
        >
            {emoji ? (
                <Text style={[styles.emoji, { fontSize: emojiSizes[size] }]}>
                    {displayEmoji}
                </Text>
            ) : (
                <View style={[styles.iconContainer, { backgroundColor: colors.border + '30' }]}>
                    <IconComponent
                        size={iconSizes[size]}
                        color={colors.textMuted}
                        strokeWidth={1.5}
                    />
                </View>
            )}

            <Text
                style={[
                    styles.title,
                    size === 'small' && styles.titleSmall,
                    size === 'large' && styles.titleLarge,
                    { color: colors.text }
                ]}
            >
                {displayTitle}
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    size === 'small' && styles.subtitleSmall,
                    { color: colors.textSecondary }
                ]}
            >
                {displaySubtitle}
            </Text>

            {actionText && onAction && (
                <Button
                    title={actionText}
                    onPress={onAction}
                    variant="primary"
                    size={size === 'small' ? 'small' : 'medium'}
                    style={styles.actionButton}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
    },
    small: {
        paddingVertical: SPACING.xl,
    },
    medium: {
        paddingVertical: SPACING.huge,
    },
    large: {
        paddingVertical: SPACING.giant * 1.5,
    },
    iconContainer: {
        padding: SPACING.lg,
        borderRadius: 999,
        marginBottom: SPACING.lg,
    },
    emoji: {
        marginBottom: SPACING.lg,
    },
    title: {
        ...TYPOGRAPHY.h3,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    titleSmall: {
        ...TYPOGRAPHY.bodyMedium,
    },
    titleLarge: {
        ...TYPOGRAPHY.h2,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        lineHeight: 22,
    },
    subtitleSmall: {
        ...TYPOGRAPHY.bodySmall,
    },
    actionButton: {
        marginTop: SPACING.xl,
        minWidth: 160,
    },
});
