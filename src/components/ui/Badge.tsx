/**
 * GRIHGO Customer App - Badge Component
 * Status badges, offer tags, and number badges
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ThemeColors } from '../../constants/Colors';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
    text: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    style?: ViewStyle;
}

const getVariantColors = (variant: BadgeVariant, colors: ThemeColors) => {
    switch (variant) {
        case 'success':
            return { bg: colors.successBg, text: colors.success };
        case 'warning':
            return { bg: colors.warningBg, text: colors.warning };
        case 'error':
            return { bg: colors.errorBg, text: colors.error };
        case 'info':
            return { bg: colors.infoBg, text: colors.info };
        case 'primary':
            return { bg: colors.primary + '20', text: colors.primary };
        case 'neutral':
            return { bg: colors.border, text: colors.textSecondary };
    }
};

export function Badge({
    text,
    variant = 'neutral',
    size = 'medium',
    icon,
    style,
}: BadgeProps) {
    const { colors } = useTheme();
    const variantColors = getVariantColors(variant, colors);

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
        switch (size) {
            case 'small':
                return {
                    container: { paddingHorizontal: SPACING.sm, paddingVertical: 2 },
                    text: TYPOGRAPHY.captionSmall,
                    iconSize: 10,
                };
            case 'medium':
                return {
                    container: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
                    text: TYPOGRAPHY.caption,
                    iconSize: 12,
                };
            case 'large':
                return {
                    container: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
                    text: TYPOGRAPHY.bodySmallMedium,
                    iconSize: 14,
                };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: variantColors.bg },
                sizeStyles.container,
                style,
            ]}
        >
            {icon && (
                <MaterialCommunityIcons
                    name={icon}
                    size={sizeStyles.iconSize}
                    color={variantColors.text}
                    style={styles.icon}
                />
            )}
            <Text style={[sizeStyles.text, { color: variantColors.text }]}>{text}</Text>
        </View>
    );
}

// Number Badge (for notifications, cart count, etc.)
interface NumberBadgeProps {
    count: number;
    maxCount?: number;
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export function NumberBadge({
    count,
    maxCount = 99,
    size = 'medium',
    style,
}: NumberBadgeProps) {
    const { colors } = useTheme();

    if (count <= 0) return null;

    const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
    const isLarge = displayCount.length > 2;

    const badgeSize = size === 'small' ? 18 : 22;
    const fontSize = size === 'small' ? 10 : 12;

    return (
        <View
            style={[
                styles.numberBadge,
                {
                    backgroundColor: colors.error,
                    minWidth: badgeSize,
                    height: badgeSize,
                    paddingHorizontal: isLarge ? SPACING.xs : 0,
                },
                style,
            ]}
        >
            <Text style={[styles.numberText, { fontSize }]}>{displayCount}</Text>
        </View>
    );
}

// Offer Badge (for discounts)
interface OfferBadgeProps {
    text: string;
    compact?: boolean;
    style?: ViewStyle;
}

export function OfferBadge({ text, compact = false, style }: OfferBadgeProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.offerBadge,
                { backgroundColor: colors.primary },
                compact && { paddingVertical: 1, paddingHorizontal: 4 },
                style
            ]}
        >
            <MaterialCommunityIcons name="tag" size={compact ? 8 : 10} color="#FFFFFF" />
            <Text style={[styles.offerText, compact && { fontSize: 8 }]}>{text}</Text>
        </View>
    );
}

// Veg/Non-Veg Indicator
interface VegIndicatorProps {
    isVeg: boolean;
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export function VegIndicator({ isVeg, size = 'medium', style }: VegIndicatorProps) {
    const { colors } = useTheme();
    const indicatorSize = size === 'small' ? 14 : 18;
    const dotSize = size === 'small' ? 6 : 8;

    return (
        <View
            style={[
                styles.vegIndicator,
                {
                    width: indicatorSize,
                    height: indicatorSize,
                    borderColor: isVeg ? colors.veg : colors.nonVeg,
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.vegDot,
                    {
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: isVeg ? colors.veg : colors.nonVeg,
                        borderRadius: isVeg ? dotSize / 2 : 0,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS.xs,
        alignSelf: 'flex-start',
    },
    icon: {
        marginRight: SPACING.xs,
    },
    numberBadge: {
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    offerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        borderRadius: RADIUS.xs,
    },
    offerText: {
        ...TYPOGRAPHY.captionSmall,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    vegIndicator: {
        borderWidth: 1.5,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vegDot: {},
});
