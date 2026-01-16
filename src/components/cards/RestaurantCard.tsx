/**
 * GRIHGO Customer App - Restaurant Card Component
 * Card for displaying restaurant info
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Restaurant } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { CompactRating, OfferBadge, VegIndicator } from '../ui';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Re-export for backwards compatibility
export type { Restaurant } from '../../types';

interface RestaurantCardProps {
    restaurant: Restaurant;
    variant?: 'vertical' | 'horizontal';
    onFavorite?: () => void;
}

export function RestaurantCard({
    restaurant,
    variant = 'vertical',
    onFavorite,
}: RestaurantCardProps) {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        router.push(`/restaurant/${restaurant.id}`);
    };

    if (variant === 'horizontal') {
        return (
            <AnimatedTouchable
                style={[
                    styles.horizontalCard,
                    { backgroundColor: colors.surface, ...SHADOWS.md },
                    animatedStyle,
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={[styles.horizontalImage, { backgroundColor: colors.background }]}>
                    <Image
                        source={restaurant.image}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                    <View style={styles.offerBadgeHorizontal}>
                        {restaurant.offer && (
                            <OfferBadge text={restaurant.offer.text} compact />
                        )}
                    </View>
                </View>

                <View style={styles.horizontalContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                            {restaurant.name}
                        </Text>
                        <CompactRating rating={restaurant.rating} />
                    </View>

                    <Text style={[styles.cuisines, { color: colors.textSecondary }]} numberOfLines={1}>
                        {restaurant.cuisines.join(', ')}
                    </Text>

                    <View style={styles.bottomRow}>
                        <Text style={[styles.time, { color: colors.textSecondary }]}>
                            {restaurant.deliveryTime}
                        </Text>
                        <Text style={[styles.dot, { color: colors.textSecondary }]}> • </Text>
                        <Text style={[styles.price, { color: colors.textSecondary }]}>
                            ₹{restaurant.priceForTwo} for two
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
                    <MaterialCommunityIcons
                        name={restaurant.isFavorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={restaurant.isFavorite ? colors.primary : colors.textSecondary}
                    />
                </TouchableOpacity>
            </AnimatedTouchable>
        );
    }

    return (
        <AnimatedTouchable
            style={[
                styles.verticalCard,
                { backgroundColor: colors.surface, ...SHADOWS.md },
                animatedStyle,
            ]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <View style={[styles.verticalImage, { backgroundColor: colors.background }]}>
                <Image
                    source={restaurant.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />

                <View style={styles.offerBadgeVertical}>
                    {restaurant.offer && (
                        <OfferBadge text={restaurant.offer.text} />
                    )}
                </View>

                {onFavorite && (
                    <TouchableOpacity
                        style={[styles.favButtonOverlay, { backgroundColor: colors.surface }]}
                        onPress={onFavorite}
                    >
                        <MaterialCommunityIcons
                            name={restaurant.isFavorite ? 'heart' : 'heart'}
                            size={18}
                            color={restaurant.isFavorite ? colors.primary : '#ccc'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.verticalContent}>
                <View style={styles.headerRow}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    <CompactRating rating={restaurant.rating} />
                </View>

                <View style={styles.infoRow}>
                    {restaurant.isVeg && <VegIndicator isVeg={true} style={{ marginRight: 4 }} />}
                    <Text style={[styles.cuisines, { color: colors.textSecondary }]} numberOfLines={1}>
                        {restaurant.cuisines.join(', ')}
                    </Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>
                        {restaurant.deliveryTime}
                    </Text>
                    <Text style={[styles.dot, { color: colors.textSecondary }]}> • </Text>
                    <Text style={[styles.price, { color: colors.textSecondary }]}>
                        ₹{restaurant.priceForTwo} for two
                    </Text>
                </View>
            </View>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    verticalCard: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.md,
        width: '100%',
    },
    verticalImage: {
        height: 180,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticalContent: {
        padding: SPACING.md,
    },
    favButtonOverlay: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        width: 32,
        height: 32,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    offerBadgeVertical: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },

    // Horizontal Card
    horizontalCard: {
        flexDirection: 'row',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    horizontalImage: {
        width: 100,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
    },
    offerBadgeHorizontal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    horizontalContent: {
        flex: 1,
        padding: SPACING.md,
        justifyContent: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
    },

    // Common
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    name: {
        ...TYPOGRAPHY.bodyMedium,
        flex: 1,
    },
    cuisines: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.xs,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    dot: {
        fontSize: 8,
    },
    time: {
        ...TYPOGRAPHY.caption,
    },
    price: {
        ...TYPOGRAPHY.caption,
    },
});
