/**
 * GRIHGO Customer App - Home Screen
 * Main discovery hub with all sections
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, ChevronDown, Bell, Search, Mic, ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import {
    HomeBanner,
    QuickActions,
    CuisinesScroll,
    ReorderSection,
    RestaurantList,
} from '../../components/sections';

export default function HomeScreen() {
    const { colors } = useTheme();
    const { itemCount } = useCart();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#0D2818' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.locationButton}>
                    <MapPin size={20} color={colors.primary} />
                    <View style={styles.locationText}>
                        <View style={styles.locationRow}>
                            <Text style={[styles.locationLabel, { color: colors.text }]}>Home</Text>
                            <ChevronDown size={18} color={colors.text} />
                        </View>
                        <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
                            123 Main Street, Koramangala
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.push('/cart')}
                    >
                        <ShoppingCart size={24} color={colors.text} />
                        {itemCount > 0 && (
                            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.badgeText}>{itemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.push('/notifications')}
                    >
                        <Bell size={24} color={colors.text} />
                        <View style={[styles.notificationBadge, { backgroundColor: colors.error }]} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Greeting */}
                <View style={styles.greetingContainer}>
                    <Text style={[styles.greeting, { color: colors.text }]}>
                        {getGreeting()}, Rahul! 👋
                    </Text>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={[styles.searchBar, { backgroundColor: colors.surface }]}
                    onPress={() => router.push('/(tabs)/search')}
                >
                    <Search size={24} color={colors.textSecondary} />
                    <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                        Search for food, restaurants...
                    </Text>
                    <View style={styles.micButton}>
                        <Mic size={20} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* Banner Carousel */}
                <HomeBanner />

                {/* Quick Actions */}
                <QuickActions />

                {/* Reorder Section */}
                <ReorderSection />

                {/* Popular Cuisines */}
                <CuisinesScroll />

                {/* For You - Horizontal */}
                <RestaurantList
                    title="For You ⭐"
                    subtitle="Based on your preferences"
                    horizontal
                />

                {/* All Restaurants - Vertical */}
                <RestaurantList
                    title="All Restaurants"
                    subtitle="Near you"
                    horizontal={false}
                    showAll={false}
                />

                {/* Bottom Padding */}
                <View style={{ height: SPACING.huge }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    locationText: {
        marginLeft: SPACING.sm,
        flex: 1,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationLabel: {
        ...TYPOGRAPHY.bodyMedium,
    },
    address: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
        backgroundColor: '#FFFFFF', // Or explicit color if needed, but shadows imply bg
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingTop: SPACING.md,
    },
    greetingContainer: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    greeting: {
        ...TYPOGRAPHY.h3,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        height: 52,
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING.lg,
    },
    searchPlaceholder: {
        flex: 1,
        ...TYPOGRAPHY.body,
        marginLeft: SPACING.md,
    },
    micButton: {
        padding: SPACING.xs,
    },
});
