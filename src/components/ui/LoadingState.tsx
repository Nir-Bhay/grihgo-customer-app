/**
 * GRIHGO Customer App - Loading State Components
 * Skeleton loaders and spinners for loading states
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

interface LoadingSpinnerProps {
    /** Size of the spinner */
    size?: 'small' | 'medium' | 'large';
    /** Loading text to display */
    text?: string;
    /** Whether to show overlay */
    overlay?: boolean;
    /** Custom container style */
    style?: ViewStyle;
}

/**
 * Simple loading spinner with optional text
 */
export function LoadingSpinner({
    size = 'medium',
    text,
    overlay = false,
    style,
}: LoadingSpinnerProps) {
    const { colors } = useTheme();

    const spinnerSizes = {
        small: 20,
        medium: 32,
        large: 48,
    };

    const content = (
        <View
            style={[styles.spinnerContainer, style]}
            accessibilityRole="progressbar"
            accessibilityLabel={text || 'Loading'}
        >
            <ActivityIndicator
                size={spinnerSizes[size]}
                color={colors.primary}
            />
            {text && (
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    {text}
                </Text>
            )}
        </View>
    );

    if (overlay) {
        return (
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.overlayCard, { backgroundColor: colors.surface }]}>
                    {content}
                </View>
            </View>
        );
    }

    return content;
}

interface SkeletonProps {
    /** Width of skeleton (number or percentage string) */
    width?: number | string;
    /** Height of skeleton */
    height?: number;
    /** Border radius */
    borderRadius?: number;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * Animated skeleton placeholder
 */
export function Skeleton({
    width = '100%',
    height = 20,
    borderRadius = RADIUS.sm,
    style,
}: SkeletonProps) {
    const { colors, isDark } = useTheme();
    const shimmerValue = useSharedValue(0);

    useEffect(() => {
        shimmerValue.value = withRepeat(
            withTiming(1, { duration: 1200 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: isDark ? colors.border : '#E5E7EB',
                },
                animatedStyle,
                style,
            ]}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading content"
        />
    );
}

interface SkeletonCardProps {
    /** Card variant */
    variant?: 'restaurant' | 'order' | 'dish' | 'address';
    /** Custom style */
    style?: ViewStyle;
}

/**
 * Pre-made skeleton cards for common UI patterns
 */
export function SkeletonCard({ variant = 'restaurant', style }: SkeletonCardProps) {
    const { colors } = useTheme();

    if (variant === 'restaurant') {
        return (
            <View style={[styles.skeletonCard, { backgroundColor: colors.surface }, style]}>
                <Skeleton width="100%" height={140} borderRadius={RADIUS.lg} />
                <View style={styles.skeletonContent}>
                    <Skeleton width="70%" height={18} />
                    <View style={styles.skeletonRow}>
                        <Skeleton width={60} height={14} />
                        <Skeleton width={80} height={14} />
                    </View>
                    <Skeleton width="50%" height={14} />
                </View>
            </View>
        );
    }

    if (variant === 'order') {
        return (
            <View style={[styles.skeletonCard, { backgroundColor: colors.surface }, style]}>
                <View style={styles.skeletonOrderHeader}>
                    <Skeleton width={48} height={48} borderRadius={RADIUS.md} />
                    <View style={styles.skeletonOrderInfo}>
                        <Skeleton width="60%" height={16} />
                        <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
                    </View>
                    <Skeleton width={60} height={18} />
                </View>
                <Skeleton width="100%" height={1} style={{ marginVertical: SPACING.md }} />
                <Skeleton width="80%" height={14} />
                <View style={[styles.skeletonRow, { marginTop: SPACING.md }]}>
                    <Skeleton width="45%" height={40} borderRadius={RADIUS.md} />
                    <Skeleton width="45%" height={40} borderRadius={RADIUS.md} />
                </View>
            </View>
        );
    }

    if (variant === 'dish') {
        return (
            <View style={[styles.skeletonDish, { backgroundColor: colors.surface }, style]}>
                <View style={styles.skeletonDishContent}>
                    <Skeleton width={16} height={16} borderRadius={2} />
                    <Skeleton width="80%" height={16} style={{ marginTop: SPACING.sm }} />
                    <Skeleton width="100%" height={12} style={{ marginTop: SPACING.xs }} />
                    <Skeleton width={50} height={16} style={{ marginTop: SPACING.sm }} />
                </View>
                <Skeleton width={100} height={80} borderRadius={RADIUS.md} />
            </View>
        );
    }

    // Default/address variant
    return (
        <View style={[styles.skeletonCard, { backgroundColor: colors.surface }, style]}>
            <View style={styles.skeletonOrderHeader}>
                <Skeleton width={40} height={40} borderRadius={RADIUS.md} />
                <View style={styles.skeletonOrderInfo}>
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="90%" height={14} style={{ marginTop: 8 }} />
                </View>
            </View>
        </View>
    );
}

interface LoadingListProps {
    /** Number of skeleton items to show */
    count?: number;
    /** Card variant */
    variant?: 'restaurant' | 'order' | 'dish' | 'address';
    /** Custom style for container */
    style?: ViewStyle;
}

/**
 * List of skeleton cards for loading lists
 */
export function LoadingList({
    count = 3,
    variant = 'restaurant',
    style,
}: LoadingListProps) {
    return (
        <View style={[styles.loadingList, style]}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} variant={variant} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    spinnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        ...TYPOGRAPHY.bodySmall,
        marginTop: SPACING.md,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    overlayCard: {
        padding: SPACING.xxl,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
    },
    skeleton: {
        overflow: 'hidden',
    },
    skeletonCard: {
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    skeletonContent: {
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    skeletonRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    skeletonOrderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    skeletonOrderInfo: {
        flex: 1,
    },
    skeletonDish: {
        flexDirection: 'row',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    skeletonDishContent: {
        flex: 1,
        marginRight: SPACING.md,
    },
    loadingList: {
        paddingHorizontal: SPACING.lg,
    },
});
