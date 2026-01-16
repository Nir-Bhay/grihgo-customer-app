/**
 * GRIHGO Customer App - Favorites Screen
 * Saved restaurants, dishes, and offers
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Star, Tag, Copy, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { RestaurantCard } from '../../components/cards';
import { EmptyState } from '../../components/ui';
import { VegIndicator } from '../../components/ui/Badge';
import { RESTAURANTS, FAVORITE_DISHES, OFFERS, FavoriteDish, Offer } from '../../data/mockData';

type TabType = 'restaurants' | 'dishes' | 'offers';

const TABS: { id: TabType; label: string; count?: number }[] = [
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'dishes', label: 'Dishes' },
    { id: 'offers', label: 'Offers' },
];

export default function FavoritesScreen() {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<TabType>('restaurants');
    const [refreshing, setRefreshing] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Favorite restaurants (mock - in real app would come from context/storage)
    const favoriteRestaurants = React.useMemo(() => {
        return (RESTAURANTS || []).slice(0, 3).map((r) => ({
            ...r,
            isFavorite: true,
        }));
    }, []);

    // Favorite dishes
    const favoriteDishes = FAVORITE_DISHES;

    // Saved offers
    const savedOffers = OFFERS.slice(0, 3);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    }, []);

    const handleCopyCode = async (code: string) => {
        await Clipboard.setStringAsync(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleRemoveFavorite = (id: string, type: 'restaurant' | 'dish') => {
        // In real app, would update context/storage
        console.log(`Remove ${type} ${id} from favorites`);
    };

    // Render favorite dish card
    const renderDishCard = (dish: FavoriteDish) => (
        <TouchableOpacity
            key={dish.id}
            style={[styles.dishCard, { backgroundColor: colors.surface, ...SHADOWS.sm }]}
            onPress={() => router.push({ pathname: `/food/${dish.id}`, params: { restaurantId: dish.restaurantId } })}
            accessibilityRole="button"
            accessibilityLabel={`${dish.name} from ${dish.restaurantName}, ${dish.isVeg ? 'vegetarian' : 'non-vegetarian'}, ₹${dish.price}`}
        >
            <Image source={dish.image} style={styles.dishImage} />
            <View style={styles.dishContent}>
                <View style={styles.dishHeader}>
                    <VegIndicator isVeg={dish.isVeg} />
                    <TouchableOpacity
                        onPress={() => handleRemoveFavorite(dish.id, 'dish')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityLabel="Remove from favorites"
                        accessibilityRole="button"
                    >
                        <Heart size={18} color={colors.error} fill={colors.error} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.dishName, { color: colors.text }]} numberOfLines={1}>
                    {dish.name}
                </Text>
                <Text style={[styles.dishRestaurant, { color: colors.textSecondary }]} numberOfLines={1}>
                    {dish.restaurantName}
                </Text>
                <View style={styles.dishFooter}>
                    <Text style={[styles.dishPrice, { color: colors.text }]}>₹{dish.price}</Text>
                    <View style={styles.dishRating}>
                        <Star size={12} color={colors.rating} fill={colors.rating} />
                        <Text style={[styles.dishRatingText, { color: colors.textSecondary }]}>
                            {dish.rating}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Render offer card
    const renderOfferCard = (offer: Offer) => (
        <View
            key={offer.id}
            style={[styles.offerCard, { backgroundColor: offer.backgroundColor }]}
            accessibilityRole="text"
            accessibilityLabel={`${offer.title}. ${offer.description}. Code: ${offer.code}`}
        >
            <View style={styles.offerContent}>
                <Text style={styles.offerEmoji}>{offer.emoji}</Text>
                <View style={styles.offerText}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text style={styles.offerDescription} numberOfLines={2}>
                        {offer.description}
                    </Text>
                </View>
            </View>
            <View style={styles.offerFooter}>
                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Code:</Text>
                    <Text style={styles.codeText}>{offer.code}</Text>
                </View>
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopyCode(offer.code)}
                    accessibilityLabel={`Copy code ${offer.code}`}
                    accessibilityRole="button"
                >
                    {copiedCode === offer.code ? (
                        <>
                            <Check size={14} color="#FFFFFF" />
                            <Text style={styles.copyText}>Copied!</Text>
                        </>
                    ) : (
                        <>
                            <Copy size={14} color="#FFFFFF" />
                            <Text style={styles.copyText}>Copy</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
            <Text style={styles.offerValidity}>
                Valid till {new Date(offer.validTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
            </View>

            {/* Tabs */}
            <View
                style={[styles.tabsContainer, { borderBottomColor: colors.border }]}
                accessibilityRole="tablist"
            >
                {TABS.map((tab) => {
                    const count = tab.id === 'restaurants' ? favoriteRestaurants.length :
                        tab.id === 'dishes' ? favoriteDishes.length :
                            savedOffers.length;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tab,
                                activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
                            ]}
                            onPress={() => setActiveTab(tab.id)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: activeTab === tab.id }}
                            accessibilityLabel={`${tab.label} tab, ${count} items`}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: activeTab === tab.id ? colors.primary : colors.textSecondary },
                                ]}
                            >
                                {tab.label}
                            </Text>
                            {count > 0 && (
                                <View style={[styles.tabBadge, { backgroundColor: activeTab === tab.id ? colors.primary : colors.textMuted }]}>
                                    <Text style={styles.tabBadgeText}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Content */}
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
                {/* Restaurants Tab */}
                {activeTab === 'restaurants' && (
                    favoriteRestaurants.length > 0 ? (
                        favoriteRestaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                variant="horizontal"
                            />
                        ))
                    ) : (
                        <EmptyState
                            variant="favorites"
                            title="No favorite restaurants"
                            subtitle="Tap the heart icon on restaurants to save them here"
                            actionText="Explore Restaurants"
                            onAction={() => router.push('/(tabs)')}
                        />
                    )
                )}

                {/* Dishes Tab */}
                {activeTab === 'dishes' && (
                    favoriteDishes.length > 0 ? (
                        <View style={styles.dishesGrid}>
                            {favoriteDishes.map(renderDishCard)}
                        </View>
                    ) : (
                        <EmptyState
                            variant="favorites"
                            title="No favorite dishes"
                            subtitle="Save your favorite dishes for quick ordering"
                            actionText="Browse Menu"
                            onAction={() => router.push('/(tabs)')}
                        />
                    )
                )}

                {/* Offers Tab */}
                {activeTab === 'offers' && (
                    savedOffers.length > 0 ? (
                        <View style={styles.offersContainer}>
                            {savedOffers.map(renderOfferCard)}
                        </View>
                    ) : (
                        <EmptyState
                            emoji="🏷️"
                            title="No saved offers"
                            subtitle="Save offers to use them later"
                            actionText="View All Offers"
                            onAction={() => router.push('/offers')}
                        />
                    )
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
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h2,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginHorizontal: SPACING.lg,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        marginRight: SPACING.xl,
        gap: SPACING.xs,
    },
    tabText: {
        ...TYPOGRAPHY.bodyMedium,
    },
    tabBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    tabBadgeText: {
        ...TYPOGRAPHY.captionSmall,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        marginTop: SPACING.md,
    },
    // Dishes styles
    dishesGrid: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    dishCard: {
        flexDirection: 'row',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    dishImage: {
        width: 100,
        height: 100,
    },
    dishContent: {
        flex: 1,
        padding: SPACING.md,
    },
    dishHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    dishName: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: 2,
    },
    dishRestaurant: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.sm,
    },
    dishFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dishPrice: {
        ...TYPOGRAPHY.price,
    },
    dishRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dishRatingText: {
        ...TYPOGRAPHY.caption,
    },
    // Offers styles
    offersContainer: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    offerCard: {
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
    },
    offerContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    offerEmoji: {
        fontSize: 32,
    },
    offerText: {
        flex: 1,
    },
    offerTitle: {
        ...TYPOGRAPHY.h4,
        color: '#FFFFFF',
        marginBottom: SPACING.xs,
    },
    offerDescription: {
        ...TYPOGRAPHY.bodySmall,
        color: 'rgba(255,255,255,0.9)',
    },
    offerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    codeLabel: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    codeText: {
        ...TYPOGRAPHY.bodyMedium,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        gap: SPACING.xs,
    },
    copyText: {
        ...TYPOGRAPHY.caption,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    offerValidity: {
        ...TYPOGRAPHY.captionSmall,
        color: 'rgba(255,255,255,0.7)',
    },
});
