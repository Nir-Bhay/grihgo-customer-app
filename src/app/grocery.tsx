/**
 * GRIHGO Customer App - Grocery Screen
 * Grocery delivery interface with categories and popular items
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Apple,
    Milk,
    Cookie,
    Wine,
    Home,
    Sparkles,
    Clock,
    Truck,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../constants';

// Grocery Categories with icons
const CATEGORIES = [
    { id: '1', name: 'Fruits & Veg', icon: Apple, color: '#E8F5E9', iconColor: '#2E7D32' },
    { id: '2', name: 'Dairy & Bread', icon: Milk, color: '#FFF3E0', iconColor: '#E65100' },
    { id: '3', name: 'Snacks', icon: Cookie, color: '#FFEBEE', iconColor: '#C62828' },
    { id: '4', name: 'Beverages', icon: Wine, color: '#E3F2FD', iconColor: '#1565C0' },
    { id: '5', name: 'Household', icon: Home, color: '#F3E5F5', iconColor: '#7B1FA2' },
    { id: '6', name: 'Personal Care', icon: Sparkles, color: '#E0F2F1', iconColor: '#00695C' },
];

// Popular Grocery Items
const POPULAR_ITEMS = [
    { id: 'g1', name: 'Farm Fresh Milk', volume: '1 L', price: 54, originalPrice: 60, isVeg: true },
    { id: 'g2', name: 'Whole Wheat Bread', volume: '400g', price: 45, originalPrice: 50, isVeg: true },
    { id: 'g3', name: 'Farm Eggs', volume: '6 pcs', price: 65, originalPrice: 75, isVeg: false },
    { id: 'g4', name: 'Amul Butter', volume: '100g', price: 56, isVeg: true },
    { id: 'g5', name: 'Fresh Bananas', volume: '6 pcs', price: 40, isVeg: true },
    { id: 'g6', name: 'Tomatoes', volume: '500g', price: 35, originalPrice: 45, isVeg: true },
];

export default function GroceryScreen() {
    const { colors, isDark } = useTheme();
    const { itemCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const handleCategoryPress = (category: typeof CATEGORIES[0]) => {
        Alert.alert(
            category.name,
            `Browse ${category.name} items. This feature will be available soon!`,
            [{ text: 'OK' }]
        );
    };

    const handleAddItem = (item: typeof POPULAR_ITEMS[0]) => {
        setQuantities(prev => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + 1,
        }));
    };

    const handleRemoveItem = (itemId: string) => {
        setQuantities(prev => {
            const current = prev[itemId] || 0;
            if (current <= 1) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: current - 1 };
        });
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            Alert.alert(
                'Search',
                `Searching for "${searchQuery}". This feature will be available soon!`,
                [{ text: 'OK' }]
            );
        }
    };

    const handleViewCart = () => {
        const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
        if (totalItems > 0) {
            Alert.alert(
                'Grocery Cart',
                `You have ${totalItems} grocery items. Checkout will be available soon!`,
                [{ text: 'OK' }]
            );
        } else {
            router.push('/cart');
        }
    };

    const groceryCartCount = Object.values(quantities).reduce((a, b) => a + b, 0);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Grocery Store</Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleViewCart}
                    accessibilityLabel={`Cart. ${groceryCartCount + itemCount} items`}
                    accessibilityRole="button"
                >
                    <ShoppingCart size={24} color={colors.text} />
                    {(groceryCartCount + itemCount) > 0 && (
                        <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.cartBadgeText}>{groceryCartCount + itemCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Search Bar */}
                <View
                    style={[styles.searchContainer, { backgroundColor: colors.surface }]}
                    accessibilityRole="search"
                >
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search for groceries..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        accessibilityLabel="Search for groceries"
                        accessibilityHint="Type to search for grocery items"
                    />
                </View>

                {/* Delivery Banner */}
                <View style={styles.bannerContainer}>
                    <View style={[styles.banner, { backgroundColor: colors.success + '15' }]}>
                        <View style={styles.bannerLeft}>
                            <View style={[styles.bannerIconContainer, { backgroundColor: colors.success + '20' }]}>
                                <Clock size={24} color={colors.success} />
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={[styles.bannerTitle, { color: colors.success }]}>
                                    10 Minute Delivery
                                </Text>
                                <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
                                    Get fresh groceries at your doorstep!
                                </Text>
                            </View>
                        </View>
                        <Truck size={32} color={colors.success} />
                    </View>
                </View>

                {/* Categories Grid */}
                <View style={styles.section}>
                    <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                        accessibilityRole="header"
                    >
                        Shop by Category
                    </Text>
                    <View
                        style={styles.categoryGrid}
                        accessibilityRole="list"
                        accessibilityLabel="Grocery categories"
                    >
                        {CATEGORIES.map((cat) => {
                            const CategoryIcon = cat.icon;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.categoryCard, { backgroundColor: cat.color }]}
                                    onPress={() => handleCategoryPress(cat)}
                                    accessibilityLabel={`${cat.name} category`}
                                    accessibilityRole="button"
                                    accessibilityHint="Tap to browse items in this category"
                                >
                                    <View style={styles.categoryIconContainer}>
                                        <CategoryIcon size={28} color={cat.iconColor} />
                                    </View>
                                    <Text style={[styles.categoryName, { color: cat.iconColor }]}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Popular Items */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text
                            style={[styles.sectionTitle, { color: colors.text }]}
                            accessibilityRole="header"
                        >
                            Popular Essentials
                        </Text>
                        <TouchableOpacity
                            accessibilityLabel="See all popular items"
                            accessibilityRole="button"
                        >
                            <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.itemsScroll}
                        accessibilityRole="list"
                        accessibilityLabel="Popular grocery items"
                    >
                        {POPULAR_ITEMS.map((item) => {
                            const quantity = quantities[item.id] || 0;

                            return (
                                <View
                                    key={item.id}
                                    style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    accessibilityRole="none"
                                    accessibilityLabel={`${item.name}, ${item.volume}, ${item.price} rupees${item.originalPrice ? `, original price ${item.originalPrice} rupees` : ''}${quantity > 0 ? `, ${quantity} in cart` : ''}`}
                                >
                                    {/* Discount Badge */}
                                    {item.originalPrice && (
                                        <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                                            <Text style={styles.discountText}>
                                                {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                            </Text>
                                        </View>
                                    )}

                                    {/* Veg/Non-veg Indicator */}
                                    <View
                                        style={[
                                            styles.vegIndicator,
                                            { borderColor: item.isVeg ? colors.success : colors.error },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.vegDot,
                                                { backgroundColor: item.isVeg ? colors.success : colors.error },
                                            ]}
                                        />
                                    </View>

                                    {/* Placeholder Image */}
                                    <View style={[styles.itemImageContainer, { backgroundColor: colors.border + '30' }]}>
                                        <Apple size={40} color={colors.textMuted} />
                                    </View>

                                    <Text
                                        style={[styles.itemName, { color: colors.text }]}
                                        numberOfLines={2}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.itemVolume, { color: colors.textSecondary }]}>
                                        {item.volume}
                                    </Text>

                                    <View style={styles.itemBottom}>
                                        <View>
                                            <Text style={[styles.itemPrice, { color: colors.text }]}>₹{item.price}</Text>
                                            {item.originalPrice && (
                                                <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                                                    ₹{item.originalPrice}
                                                </Text>
                                            )}
                                        </View>

                                        {quantity === 0 ? (
                                            <TouchableOpacity
                                                style={[styles.addButton, { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                                                onPress={() => handleAddItem(item)}
                                                accessibilityLabel={`Add ${item.name} to cart`}
                                                accessibilityRole="button"
                                            >
                                                <Plus size={14} color={colors.primary} />
                                                <Text style={[styles.addButtonText, { color: colors.primary }]}>ADD</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={[styles.quantityControl, { backgroundColor: colors.primary }]}>
                                                <TouchableOpacity
                                                    onPress={() => handleRemoveItem(item.id)}
                                                    style={styles.quantityButton}
                                                    accessibilityLabel={`Remove one ${item.name}`}
                                                    accessibilityRole="button"
                                                >
                                                    <Minus size={14} color="#FFFFFF" />
                                                </TouchableOpacity>
                                                <Text style={styles.quantityText}>{quantity}</Text>
                                                <TouchableOpacity
                                                    onPress={() => handleAddItem(item)}
                                                    style={styles.quantityButton}
                                                    accessibilityLabel={`Add one more ${item.name}`}
                                                    accessibilityRole="button"
                                                >
                                                    <Plus size={14} color="#FFFFFF" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Info Banner */}
                <View style={[styles.infoBanner, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.infoTitle, { color: colors.text }]}>
                        Why shop groceries with GRIHGO?
                    </Text>
                    <View style={styles.infoItems}>
                        <View style={styles.infoItem}>
                            <Clock size={16} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>10 min delivery</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Sparkles size={16} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Fresh products</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Truck size={16} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Free delivery</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Cart Button */}
            {groceryCartCount > 0 && (
                <TouchableOpacity
                    style={[styles.floatingCart, { backgroundColor: colors.primary }]}
                    onPress={handleViewCart}
                    accessibilityLabel={`View cart. ${groceryCartCount} items`}
                    accessibilityRole="button"
                >
                    <ShoppingCart size={20} color="#FFFFFF" />
                    <Text style={styles.floatingCartText}>
                        {groceryCartCount} item{groceryCartCount > 1 ? 's' : ''} added
                    </Text>
                    <Text style={styles.floatingCartAction}>View Cart</Text>
                </TouchableOpacity>
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
        borderBottomWidth: 1,
    },
    headerButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...TYPOGRAPHY.h4,
    },
    cartBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        ...TYPOGRAPHY.caption,
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    scrollContent: {
        paddingBottom: SPACING.xl,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: SPACING.lg,
        paddingHorizontal: SPACING.md,
        height: TOUCH_TARGETS.recommended,
        borderRadius: RADIUS.lg,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        ...TYPOGRAPHY.body,
    },
    bannerContainer: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    banner: {
        flexDirection: 'row',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: SPACING.md,
    },
    bannerIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '700',
        marginBottom: 2,
    },
    bannerSubtitle: {
        ...TYPOGRAPHY.caption,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    seeAllText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    categoryCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryName: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
        textAlign: 'center',
    },
    itemsScroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    itemCard: {
        width: 150,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
    },
    discountBadge: {
        position: 'absolute',
        top: SPACING.sm,
        left: SPACING.sm,
        paddingHorizontal: SPACING.xs,
        paddingVertical: 2,
        borderRadius: RADIUS.xs,
        zIndex: 1,
    },
    discountText: {
        ...TYPOGRAPHY.caption,
        fontSize: 9,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    vegIndicator: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        width: 14,
        height: 14,
        borderWidth: 1.5,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    vegDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    itemImageContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
        borderRadius: RADIUS.md,
    },
    itemName: {
        ...TYPOGRAPHY.bodySmallMedium,
        marginBottom: 2,
        minHeight: 36,
    },
    itemVolume: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.sm,
    },
    itemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        ...TYPOGRAPHY.bodyMedium,
    },
    originalPrice: {
        ...TYPOGRAPHY.caption,
        textDecorationLine: 'line-through',
        fontSize: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        gap: 2,
        minHeight: 32,
    },
    addButtonText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS.sm,
        minHeight: 32,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        ...TYPOGRAPHY.bodySmallMedium,
        color: '#FFFFFF',
        minWidth: 20,
        textAlign: 'center',
    },
    infoBanner: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
    },
    infoTitle: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    infoItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    infoItem: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    infoText: {
        ...TYPOGRAPHY.caption,
    },
    floatingCart: {
        position: 'absolute',
        bottom: SPACING.xl,
        left: SPACING.lg,
        right: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
        ...SHADOWS.lg,
    },
    floatingCartText: {
        ...TYPOGRAPHY.bodySmallMedium,
        color: '#FFFFFF',
        flex: 1,
        marginLeft: SPACING.sm,
    },
    floatingCartAction: {
        ...TYPOGRAPHY.bodyMedium,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
