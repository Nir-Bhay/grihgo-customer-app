/**
 * GRIHGO Customer App - Reorder Section
 * Past orders for quick reordering
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { Button } from '../ui/Button';

interface PastOrder {
    id: string;
    restaurantName: string;
    items: string;
    price: number;
    image: any;
}

const PAST_ORDERS: PastOrder[] = [
    {
        id: '1',
        restaurantName: 'Biryani House',
        items: 'Chicken Biryani, Raita',
        price: 380,
        image: require('../../assets/images/cuisine/biryani.png'),
    },
    {
        id: '2',
        restaurantName: 'Pizza Hut',
        items: 'Margherita Pizza',
        price: 449,
        image: require('../../assets/images/cuisine/pizza.png'),
    },
    {
        id: '3',
        restaurantName: 'Burger King',
        items: 'Whopper Combo',
        price: 299,
        image: require('../../assets/images/cuisine/burger.png'),
    },
];

interface ReorderSectionProps {
    onReorder?: (orderId: string) => void;
}

export function ReorderSection({ onReorder }: ReorderSectionProps) {
    const { colors } = useTheme();

    if (PAST_ORDERS.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Hungry? Reorder 🔁</Text>
                <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {PAST_ORDERS.map((order) => (
                    <View
                        key={order.id}
                        style={[
                            styles.orderCard,
                            {
                                backgroundColor: colors.surface,
                                ...SHADOWS.md,
                            },
                        ]}
                    >
                        <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
                            <Image
                                source={order.image}
                                style={styles.foodImage}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.orderInfo}>
                            <Text
                                style={[styles.restaurantName, { color: colors.text }]}
                                numberOfLines={1}
                            >
                                {order.restaurantName}
                            </Text>
                            <Text
                                style={[styles.items, { color: colors.textSecondary }]}
                                numberOfLines={1}
                            >
                                {order.items}
                            </Text>
                            <Text style={[styles.price, { color: colors.text }]}>
                                ₹{order.price}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.reorderButton, { backgroundColor: colors.primary }]}
                            onPress={() => onReorder?.(order.id)}
                        >
                            <MaterialCommunityIcons name="refresh" size={16} color="#FFFFFF" />
                            <Text style={styles.reorderText}>Reorder</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h4,
    },
    seeAll: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    orderCard: {
        width: 160,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginRight: SPACING.md,
    },
    imageContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodImage: {
        width: '100%',
        height: '100%',
    },
    orderInfo: {
        padding: SPACING.md,
    },
    restaurantName: {
        ...TYPOGRAPHY.bodySmallMedium,
        marginBottom: 2,
    },
    items: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.xs,
    },
    price: {
        ...TYPOGRAPHY.priceSmall,
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        borderRadius: RADIUS.sm,
    },
    reorderText: {
        ...TYPOGRAPHY.buttonSmall,
        color: '#FFFFFF',
    },
});
