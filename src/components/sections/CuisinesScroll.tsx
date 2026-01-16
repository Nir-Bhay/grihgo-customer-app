/**
 * GRIHGO Customer App - Cuisines Scroll
 * Horizontal scroll of cuisine categories
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

interface Cuisine {
    id: string;
    name: string;
    image: any;
}

const CUISINES: Cuisine[] = [
    { id: '1', name: 'Pizza', image: require('../../assets/images/cuisine/pizza.png') },
    { id: '2', name: 'Burgers', image: require('../../assets/images/cuisine/burger.png') },
    { id: '3', name: 'Biryani', image: require('../../assets/images/cuisine/biryani.png') },
    { id: '4', name: 'Noodles', image: require('../../assets/images/cuisine/noodles.png') },
    { id: '5', name: 'Thali', image: require('../../assets/images/cuisine/thali.png') },
    { id: '6', name: 'Desserts', image: require('../../assets/images/cuisine/dessert.png') },
    { id: '7', name: 'Healthy', image: require('../../assets/images/cuisine/healthy.png') },
    { id: '8', name: 'Coffee', image: require('../../assets/images/cuisine/coffee.png') },
];

interface CuisinesScrollProps {
    title?: string;
}

export function CuisinesScroll({ title = 'Popular Cuisines' }: CuisinesScrollProps) {
    const { colors } = useTheme();

    const handleCuisinePress = (cuisine: Cuisine) => {
        router.push({
            pathname: '/(tabs)/search',
            params: { query: cuisine.name },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {CUISINES.map((cuisine) => (
                    <TouchableOpacity
                        key={cuisine.id}
                        style={styles.cuisineItem}
                        onPress={() => handleCuisinePress(cuisine)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.imageContainer,
                                {
                                    backgroundColor: colors.surface,
                                    ...SHADOWS.sm,
                                },
                            ]}
                        >
                            <Image source={cuisine.image} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={[styles.name, { color: colors.text }]}>{cuisine.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.xxl,
    },
    title: {
        ...TYPOGRAPHY.h4,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    cuisineItem: {
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    imageContainer: {
        width: 72,
        height: 72,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        padding: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: RADIUS.full,
    },
    emojiContainer: { // Keeping for reference if needed, but unused now
        width: 64,
        height: 64,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    emoji: {
        fontSize: 32,
    },
    name: {
        ...TYPOGRAPHY.caption,
    },
});
