/**
 * GRIHGO Customer App - Food Details Screen
 * Detailed view of a specific food item
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, Heart, Share2, Clock, Info, Plus, Minus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { VegIndicator } from '../../components/ui/Badge';
import { ALL_MENU_ITEMS, RESTAURANTS, MENU_ITEMS as DEFAULT_MENU } from '../../data/mockData';
import { MenuItem, Restaurant } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';

export default function FoodDetailsScreen() {
    const { id, restaurantId } = useLocalSearchParams();
    const { colors } = useTheme();
    const { addItem } = useCart();

    // State
    const [item, setItem] = useState<MenuItem | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // In a real app, fetch data from API
        // For now, we search in our mock data
        let foundItem: MenuItem | undefined;
        let foundRestaurant: Restaurant | undefined;

        // Try to find item in all menus
        const rId = typeof restaurantId === 'string' ? restaurantId : '1';
        const items = ALL_MENU_ITEMS[rId] || DEFAULT_MENU;
        foundItem = items.find(i => i.id === id);

        // Fallback search if not found in specific restaurant
        if (!foundItem) {
            for (const key in ALL_MENU_ITEMS) {
                const found = ALL_MENU_ITEMS[key].find(i => i.id === id);
                if (found) {
                    foundItem = found;
                    foundRestaurant = RESTAURANTS.find(r => r.id === key);
                    break;
                }
            }
        } else {
            foundRestaurant = RESTAURANTS.find(r => r.id === rId);
        }

        // Final fallback for demo
        if (!foundItem && DEFAULT_MENU.length > 0) {
            foundItem = DEFAULT_MENU[0];
            foundRestaurant = RESTAURANTS[0];
        }

        setItem(foundItem || null);
        setRestaurant(foundRestaurant || RESTAURANTS[0]);

    }, [id, restaurantId]);

    const handleAddToCart = () => {
        if (!item || !restaurant) return;

        addItem(
            {
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: quantity,
                isVeg: item.isVeg,
            },
            restaurant
        );
        router.back();
    };

    const renderHeader = () => (
        <View style={styles.heroContainer}>
            <Image source={item.image} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                style={styles.heroGradient}
            />

            <SafeAreaView style={styles.headerAbsolute}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Share2 size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart size={24} color={isFavorite ? colors.error : "#FFF"} fill={isFavorite ? colors.error : 'transparent'} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );

    if (!item || !restaurant) {
        return <View style={[styles.container, { backgroundColor: colors.background }]} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
            >
                {renderHeader()}

                {/* Main Content Sheet */}
                <View style={[styles.sheetContainer, { backgroundColor: colors.surface }]}>

                    {/* Title & Badges */}
                    <View style={styles.titleSection}>
                        <View style={styles.badgesRow}>
                            <View style={[styles.badge, { borderColor: item.isVeg ? colors.success : colors.error }]}>
                                <View style={[styles.vegDot, { backgroundColor: item.isVeg ? colors.success : colors.error }]} />
                                <Text style={[styles.badgeText, { color: item.isVeg ? colors.success : colors.error }]}>
                                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                                </Text>
                            </View>

                            {item.rating && (
                                <View style={[styles.badge, { backgroundColor: '#FFF5E0', borderColor: '#FFD700', borderWidth: 0 }]}>
                                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                                    <Text style={[styles.badgeText, { color: '#B45309' }]}>{item.rating}</Text>
                                </View>
                            )}

                            {item.isBestseller && (
                                <View style={[styles.badge, { backgroundColor: colors.secondary + '15', borderColor: colors.secondary }]}>
                                    <Text style={[styles.badgeText, { color: colors.secondary }]}>Bestseller</Text>
                                </View>
                            )}
                        </View>

                        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price}</Text>

                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {item.description || 'A delicious preparation made with fresh ingredients and authentic spices.'}
                        </Text>
                    </View>

                    {/* Restaurant Info */}
                    <TouchableOpacity
                        style={[styles.restaurantCard, { backgroundColor: colors.background }]}
                        onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
                    >
                        <Image source={restaurant.image} style={styles.resThumb} />
                        <View style={styles.resInfo}>
                            <Text style={[styles.fromText, { color: colors.textSecondary }]}>From</Text>
                            <Text style={[styles.resName, { color: colors.text }]}>{restaurant.name}</Text>
                        </View>
                        <View style={[styles.arrowBtn, { backgroundColor: colors.surface }]}>
                            <ArrowLeft size={16} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
                        </View>
                    </TouchableOpacity>

                    {/* More Items Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Add to your meal</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                            {(ALL_MENU_ITEMS[restaurant.id] || DEFAULT_MENU)
                                .filter(i => i.id !== item?.id)
                                .slice(0, 5) // Limit items
                                .map(otherItem => (
                                    <TouchableOpacity
                                        key={otherItem.id}
                                        style={[styles.smallCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                                        onPress={() => router.push({ pathname: '/food/[id]', params: { id: otherItem.id, restaurantId: restaurant.id } })}
                                    >
                                        <Image source={otherItem.image} style={styles.smallCardImage} />
                                        <View style={styles.smallCardContent}>
                                            <Text style={[styles.smallCardTitle, { color: colors.text }]} numberOfLines={1}>
                                                {otherItem.name}
                                            </Text>
                                            <Text style={[styles.smallCardPrice, { color: colors.textSecondary }]}>
                                                ₹{otherItem.price}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                    </View>

                    {/* Bottom Padding */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Floating Action Bar */}
            <View style={[styles.floatingBar, { backgroundColor: colors.surface, ...SHADOWS.lg }]}>
                <View style={styles.barContent}>
                    <View style={[styles.quantityBox, { backgroundColor: colors.background }]}>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus size={18} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <Plus size={18} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: colors.primary }]}
                        onPress={handleAddToCart}
                    >
                        <Text style={styles.addBtnText}>Add to Cart</Text>
                        <Text style={styles.addBtnPrice}>₹{item.price * quantity}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroContainer: {
        width: '100%',
        height: 380, // Taller image
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    headerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.sm,
        zIndex: 10,
    },
    headerActions: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255,255,255,0.25)', // Glassmorphism
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    scrollContent: {
        flexGrow: 1,
    },
    sheetContainer: {
        flex: 1,
        marginTop: -40,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: SPACING.xl,
    },
    titleSection: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
        flexWrap: 'wrap',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100, // Capsule
        borderWidth: 1,
    },
    vegDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    itemName: {
        ...TYPOGRAPHY.h1,
        fontSize: 26,
        marginBottom: SPACING.xs,
        lineHeight: 34,
    },
    itemPrice: {
        ...TYPOGRAPHY.h2,
        fontSize: 24,
        marginBottom: SPACING.md,
    },
    description: {
        ...TYPOGRAPHY.body,
        color: '#666',
        lineHeight: 24,
        fontSize: 15,
    },
    restaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
    },
    resThumb: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.full,
        marginRight: SPACING.md,
    },
    resInfo: {
        flex: 1,
    },
    fromText: {
        fontSize: 12,
        fontWeight: '500',
    },
    resName: {
        fontSize: 16,
        fontWeight: '700',
    },
    arrowBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        fontSize: 18,
    },
    horizontalScroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    smallCard: {
        width: 150,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
    },
    smallCardImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    smallCardContent: {
        padding: SPACING.sm,
    },
    smallCardTitle: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
    smallCardPrice: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Bottom Floating Bar
    floatingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.md + 20, // Bottom safe/padding
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 20,
    },
    barContent: {
        flexDirection: 'row',
        gap: SPACING.md,
        height: 56,
    },
    quantityBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 120,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.full,
    },
    qtyBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    qtyText: {
        fontSize: 18,
        fontWeight: '700',
    },
    addBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.full,
    },
    addBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    addBtnPrice: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.9,
    },
});
