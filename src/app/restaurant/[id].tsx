/**
 * GRIHGO Customer App - Restaurant Detail Screen
 * Premium Redesign with Sticky Headers and Sectioned Menu
 */

import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
    Image,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Restaurant, MenuItem } from '../../types';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { RESTAURANTS, ALL_MENU_ITEMS, MENU_ITEMS as DEFAULT_MENU } from '../../data/mockData';
import { VegIndicator } from '../../components/ui/Badge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

// Category definitions
const CATEGORIES = [
    { id: 'recommended', name: 'Recommended' },
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Main Course' },
    { id: 'breads', name: 'Breads' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
];

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams();
    const { colors } = useTheme();
    const { addItem, items: cartItems, total, itemCount } = useCart();

    // Determine restaurant and menu items
    const restaurantId = typeof id === 'string' ? id : '1';
    const restaurant = RESTAURANTS.find(r => r.id === restaurantId) || RESTAURANTS[0];
    const rawMenuItems = ALL_MENU_ITEMS[restaurantId] || DEFAULT_MENU;

    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
    const scrollY = useRef(new Animated.Value(0)).current;

    // Group items by category for sectioned display
    const sectionedMenu = useMemo(() => {
        const sections: { category: typeof CATEGORIES[0], items: MenuItem[] }[] = [];

        CATEGORIES.forEach(cat => {
            const catItems = rawMenuItems.filter(item =>
                (item.categoryId || 'recommended').toLowerCase() === cat.id.toLowerCase()
            );
            if (catItems.length > 0) {
                sections.push({ category: cat, items: catItems });
            }
        });

        // If no sections found (fallback), put everything in "Recommended"
        if (sections.length === 0) {
            sections.push({ category: CATEGORIES[0], items: rawMenuItems });
        }

        return sections;
    }, [rawMenuItems]);

    const handleAddItem = (item: MenuItem) => {
        addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            isVeg: item.isVeg,
        }, restaurant);
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
        outputRange: [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 3],
        extrapolate: 'clamp',
    });

    if (!restaurant) return null;

    return (
        <View style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Parallax Header Image */}
            <Animated.View style={[
                styles.headerImageContainer,
                { transform: [{ translateY: headerTranslateY }] }
            ]}>
                <Image
                    source={restaurant.image}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Sticky Navigation Header */}
            <Animated.View style={[
                styles.navbar,
                {
                    backgroundColor: colors.surface,
                    opacity: headerOpacity,
                    elevation: 4,
                }
            ]}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.navbarContent}>
                        <Text style={[styles.navTitle, { color: colors.text }]} numberOfLines={1}>
                            {restaurant.name}
                        </Text>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* Top Buttons (Back/Share) */}
            <SafeAreaView style={styles.topButtons} edges={['top']}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.back()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, { marginLeft: 12 }]}>
                    <MaterialCommunityIcons name="share-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Main Content */}
            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                stickyHeaderIndices={[1]} // Sticky Index 1: The Category Filter Bar
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* 0. Header Spacer + Info Card */}
                <View>
                    <View style={{ height: HEADER_HEIGHT - 60 }} /> {/* Push content down */}

                    <View style={[styles.restaurantCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.resCardHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.resName}>{restaurant.name}</Text>
                                <Text style={styles.resCuisines}>
                                    {restaurant.cuisines.join(', ')} • {restaurant.distance || '2.5 km'}
                                </Text>
                            </View>
                            <View style={styles.ratingBox}>
                                <Text style={styles.ratingText}>★ {restaurant.rating}</Text>
                                <View style={styles.ratingDivider} />
                                <Text style={styles.ratingCount}>1K+ ratings</Text>
                            </View>
                        </View>

                        <View style={styles.resMetaRow}>
                            <View style={styles.metaItem}>
                                <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
                                <Text style={styles.metaText}>{restaurant.deliveryTime} • Free delivery</Text>
                            </View>
                        </View>

                        {/* Coupon / Offer */}
                        {restaurant.offer && (
                            <View style={styles.couponContainer}>
                                <MaterialCommunityIcons
                                    name="ticket-percent-outline"
                                    size={20}
                                    color="#267E3E"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.couponText}>{restaurant.offer.text} up to ₹100</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* 1. Sticky Category Filters */}
                <View style={{ backgroundColor: '#F8F9FA', paddingBottom: 8, paddingTop: 8 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScroll}
                    >
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryPill,
                                    activeCategory === cat.id && styles.activeCategoryPill
                                ]}
                                onPress={() => setActiveCategory(cat.id)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    activeCategory === cat.id && styles.activeCategoryText
                                ]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 2. Menu List */}
                <View style={styles.menuList}>
                    {sectionedMenu.map((section) => (
                        <View key={section.category.id} style={styles.menuSection}>
                            <Text style={styles.sectionTitle}>{section.category.name}</Text>

                            {section.items.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.menuItemCard, { backgroundColor: colors.surface }]}
                                    onPress={() => router.push({ pathname: `/food/${item.id}`, params: { restaurantId: restaurant.id } })}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.itemInfo}>
                                        <View style={styles.vegRow}>
                                            <VegIndicator isVeg={item.isVeg} />
                                            {item.isBestseller && (
                                                <View style={styles.bestsellerTag}>
                                                    <MaterialCommunityIcons name="star" size={10} color="#E23744" />
                                                    <Text style={styles.bestsellerText}>Bestseller</Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>₹{item.price}</Text>

                                        {item.rating && (
                                            <View style={styles.itemRatingRow}>
                                                <MaterialCommunityIcons name="star" size={12} color="#F5A623" />
                                                <Text style={styles.itemRatingVal}>{item.rating}</Text>
                                                <Text style={styles.itemRatingCount}>({item.votes || 50})</Text>
                                            </View>
                                        )}

                                        <Text style={styles.itemDesc} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    </View>

                                    <View style={styles.itemImageContainer}>
                                        {item.image && (
                                            <Image source={item.image} style={styles.itemImage} />
                                        )}
                                        <View style={styles.addButtonContainer}>
                                            <TouchableOpacity
                                                style={[styles.addButton, { backgroundColor: colors.surface }]}
                                                onPress={() => handleAddItem(item)}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.addButtonLabel}>ADD</Text>
                                                <View style={styles.plusIcon}>
                                                    <Text style={{ fontSize: 14, color: '#27AE60', fontWeight: 'bold' }}>+</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}

                    {/* Bottom Padding for Cart Bar */}
                    <View style={{ height: 80 }} />
                </View>

            </Animated.ScrollView>

            {/* Cart Floating Bar */}
            {cartItems.length > 0 && (
                <Animated.View style={[styles.cartBarContainer, { backgroundColor: colors.primary }]}>
                    <View style={styles.cartBarContent}>
                        <View>
                            <Text style={styles.cartItemCount}>{itemCount} ITEM{itemCount !== 1 ? 'S' : ''} | ₹{total}</Text>
                            <Text style={styles.cartSubtext}>Extra charges may apply</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.viewCartBtn}
                            onPress={() => router.push('/cart')}
                        >
                            <Text style={styles.viewCartText}>View Cart</Text>
                            <MaterialCommunityIcons name="cart-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 0,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    topButtons: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        paddingTop: Platform.OS === 'android' ? 10 : 0, // Extra padding for Android status bar
        zIndex: 20,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 90, // Covers status bar + title area
        zIndex: 10,
        justifyContent: 'flex-end',
        paddingBottom: 15,
        paddingHorizontal: SPACING.lg,
    },
    navbarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 40,
        marginRight: 40,
    },
    restaurantCard: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        paddingBottom: SPACING.md,
        marginHorizontal: 0,
        backgroundColor: '#FFFFFF',
        minHeight: 180,
    },
    resCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    resName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    resCuisines: {
        fontSize: 13,
        color: '#666',
    },
    ratingBox: {
        backgroundColor: '#267E3E', // Green rating box
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: 'center',
        elevation: 2,
    },
    ratingText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    ratingDivider: {
        height: 1,
        width: '80%',
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginVertical: 2,
    },
    ratingCount: {
        color: '#FFF',
        fontSize: 8,
    },
    resMetaRow: {
        flexDirection: 'row',
        marginTop: SPACING.md,
        marginBottom: SPACING.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    metaText: {
        fontSize: 12,
        color: '#444',
        marginLeft: 4,
        fontWeight: '600',
    },
    couponContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4', // Light green
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DCFCE7',
        marginTop: 4,
    },
    couponText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#267E3E',
        flex: 1,
    },

    // Categories
    categoryScroll: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: 10, // Gives space for shadow
        gap: 12,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    activeCategoryPill: {
        backgroundColor: '#267E3E', // Primary Green
        borderColor: '#267E3E',
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
    activeCategoryText: {
        color: '#FFF',
    },

    // Menu Item
    menuList: {
        backgroundColor: '#F8F9FA',
    },
    menuSection: {
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
        marginLeft: SPACING.lg,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    menuItemCard: {
        flexDirection: 'row',
        marginHorizontal: SPACING.lg,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        elevation: 1, // Subtle shadow for card look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    itemInfo: {
        flex: 1,
        paddingRight: 12,
    },
    vegRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    bestsellerTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        marginLeft: 8,
    },
    bestsellerText: {
        color: '#D97706',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    itemRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemRatingVal: {
        fontSize: 11,
        fontWeight: '700',
        color: '#F5A623',
        marginLeft: 2,
    },
    itemRatingCount: {
        fontSize: 11,
        color: '#999',
        marginLeft: 2,
    },
    itemDesc: {
        fontSize: 12,
        color: '#777',
        lineHeight: 18,
    },
    itemImageContainer: {
        width: 120,
        height: 120,
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#EEE',
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: -10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    addButtonLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#27AE60',
        marginRight: 4,
    },
    plusIcon: {
        position: 'absolute',
        top: -4,
        right: 4,
    },

    // Cart Bar
    cartBarContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        borderRadius: 12,
        padding: 12,
        paddingHorizontal: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    cartBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartItemCount: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cartSubtext: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
    },
    viewCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    viewCartText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
