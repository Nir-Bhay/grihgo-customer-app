/**
 * GRIHGO Customer App - Star Rating Component
 * Display and interactive star ratings
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../../constants';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'small' | 'medium' | 'large';
    showValue?: boolean;
    showCount?: boolean;
    count?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function StarRating({
    rating,
    maxRating = 5,
    size = 'medium',
    showValue = false,
    showCount = false,
    count = 0,
    interactive = false,
    onRatingChange,
    style,
}: StarRatingProps) {
    const { colors } = useTheme();

    const starSize = size === 'small' ? 14 : size === 'medium' ? 18 : 24;
    const textStyle = size === 'small' ? TYPOGRAPHY.caption : TYPOGRAPHY.bodySmallMedium;

    const stars = Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalfFilled = !isFilled && starValue - 0.5 <= rating;

        let iconName: 'star' | 'star-half-full' | 'star-outline';
        if (isFilled) {
            iconName = 'star';
        } else if (isHalfFilled) {
            iconName = 'star-half-full';
        } else {
            iconName = 'star-outline';
        }

        const StarComponent = interactive ? (
            <AnimatedStar
                key={index}
                iconName={iconName}
                size={starSize}
                color={isFilled || isHalfFilled ? colors.rating : colors.border}
                onPress={() => onRatingChange?.(starValue)}
            />
        ) : (
            <MaterialCommunityIcons
                key={index}
                name={iconName}
                size={starSize}
                color={isFilled || isHalfFilled ? colors.rating : colors.border}
            />
        );

        return StarComponent;
    });

    return (
        <View style={[styles.container, style]}>
            <View style={styles.starsContainer}>{stars}</View>
            {showValue && (
                <Text style={[textStyle, { color: colors.text, marginLeft: SPACING.xs }]}>
                    {rating.toFixed(1)}
                </Text>
            )}
            {showCount && count > 0 && (
                <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginLeft: SPACING.xs }]}>
                    ({formatCount(count)})
                </Text>
            )}
        </View>
    );
}

// Animated Star for interactive rating
interface AnimatedStarProps {
    iconName: 'star' | 'star-half-full' | 'star-outline';
    size: number;
    color: string;
    onPress: () => void;
}

function AnimatedStar({ iconName, size, color, onPress }: AnimatedStarProps) {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(1.3, { damping: 10 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedTouchable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={animatedStyle}
        >
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
        </AnimatedTouchable>
    );
}

// Display rating in compact format (e.g., "4.3 ★")
interface CompactRatingProps {
    rating: number;
    count?: number;
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export function CompactRating({
    rating,
    count,
    size = 'medium',
    style,
}: CompactRatingProps) {
    const { colors } = useTheme();
    const isSmall = size === 'small';

    return (
        <View
            style={[
                styles.compactContainer,
                {
                    backgroundColor: colors.rating + '20',
                    paddingHorizontal: isSmall ? SPACING.sm : SPACING.md,
                    paddingVertical: isSmall ? 2 : SPACING.xs,
                },
                style,
            ]}
        >
            <Text
                style={[
                    isSmall ? TYPOGRAPHY.caption : TYPOGRAPHY.bodySmallMedium,
                    { color: colors.text },
                ]}
            >
                {rating.toFixed(1)}
            </Text>
            <MaterialCommunityIcons
                name="star"
                size={isSmall ? 12 : 14}
                color={colors.rating}
            />
            {count !== undefined && (
                <Text
                    style={[
                        TYPOGRAPHY.caption,
                        { color: colors.textSecondary, marginLeft: SPACING.xs },
                    ]}
                >
                    ({formatCount(count)})
                </Text>
            )}
        </View>
    );
}

// Format large numbers (e.g., 1500 -> 1.5K)
function formatCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        gap: 2,
    },
});
