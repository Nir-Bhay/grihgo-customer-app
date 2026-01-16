/**
 * GRIHGO Customer App - Card Component
 * Base card with variants for different use cases
 */

import React, { ReactNode } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
    children: ReactNode;
    variant?: CardVariant;
    onPress?: () => void;
    padding?: keyof typeof SPACING;
    style?: ViewStyle;
    disabled?: boolean;
}

export function Card({
    children,
    variant = 'elevated',
    onPress,
    padding = 'lg',
    style,
    disabled = false,
}: CardProps) {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        if (onPress) {
            scale.value = withSpring(0.98, { damping: 15 });
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: colors.surface,
                    ...SHADOWS.md,
                };
            case 'outlined':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'filled':
                return {
                    backgroundColor: colors.surfaceElevated,
                };
        }
    };

    const cardStyles: ViewStyle[] = [
        styles.card,
        getVariantStyles(),
        { padding: SPACING[padding] },
        style as ViewStyle,
    ].filter(Boolean) as ViewStyle[];

    if (onPress) {
        return (
            <AnimatedTouchable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                disabled={disabled}
                style={[cardStyles, animatedStyle]}
            >
                {children}
            </AnimatedTouchable>
        );
    }

    return <View style={cardStyles}>{children}</View>;
}

// Stats Card - Common pattern for displaying metrics
interface StatsCardProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    onPress?: () => void;
    style?: ViewStyle;
}

export function StatsCard({
    icon,
    value,
    label,
    trend,
    onPress,
    style,
}: StatsCardProps) {
    const { colors } = useTheme();

    return (
        <Card variant="elevated" onPress={onPress} style={style}>
            <View style={styles.statsHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    {icon}
                </View>
                {trend && (
                    <View
                        style={[
                            styles.trendBadge,
                            {
                                backgroundColor: trend.isPositive
                                    ? colors.successBg
                                    : colors.errorBg,
                            },
                        ]}
                    >
                        <View
                            style={{
                                transform: [{ rotate: trend.isPositive ? '0deg' : '180deg' }],
                            }}
                        >
                            <MaterialCommunityIcons
                                name="arrow-up"
                                size={12}
                                color={trend.isPositive ? colors.success : colors.error}
                            />
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.statsContent}>
                <Text style={[styles.statsValue, { color: colors.text }]}>{value}</Text>
                <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                    {label}
                </Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    statsCard: {
        minWidth: 140,
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendBadge: {
        width: 24,
        height: 24,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContent: {
        gap: SPACING.xs,
    },
    statsValue: {
        ...TYPOGRAPHY.h3,
    },
    statsLabel: {
        ...TYPOGRAPHY.caption,
    },
});
