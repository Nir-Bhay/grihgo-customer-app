/**
 * GRIHGO Customer App - Restaurant List Section
 * Vertical list of restaurant cards
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../../constants';
import { Restaurant } from '../../types';
import { RestaurantCard } from '../cards/RestaurantCard';
import { RESTAURANTS } from '../../data/mockData';

// Mock data now imported


interface RestaurantListProps {
    title: string;
    subtitle?: string;
    restaurants?: Restaurant[];
    horizontal?: boolean;
    showAll?: boolean;
}

export function RestaurantList({
    title,
    subtitle,
    restaurants = RESTAURANTS,
    horizontal = false,
    showAll = true,
}: RestaurantListProps) {
    const { colors } = useTheme();

    if (horizontal) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                        {subtitle && (
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                    {showAll && (
                        <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                >
                    {restaurants.map((restaurant) => (
                        <View key={restaurant.id} style={{ width: 280, marginRight: SPACING.md }}>
                            <RestaurantCard
                                restaurant={restaurant}
                                variant="vertical"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {restaurants.map((restaurant) => (
                <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    variant="horizontal"
                />
            ))}
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
        alignItems: 'flex-start',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h4,
    },
    subtitle: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
    },
    seeAll: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    horizontalList: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
});
