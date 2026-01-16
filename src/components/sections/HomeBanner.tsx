/**
 * GRIHGO Customer App - Home Banner Carousel
 * Promotional banners with auto-scroll
 */

import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    ListRenderItemInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Percent, Truck, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - SPACING.lg * 2;
const BANNER_HEIGHT = 170;

interface Banner {
    id: string;
    title: string;
    subtitle: string;
    code?: string;
    backgroundColor: readonly [string, string, string];
    icon: any;
    patternOpacity: number;
}

const BANNERS: Banner[] = [
    {
        id: '1',
        title: '50% OFF',
        subtitle: 'On your first order!',
        code: 'FIRST50',
        backgroundColor: ['#11998e', '#38ef7d', '#00b09b'], // Lush Green
        icon: Percent,
        patternOpacity: 0.1,
    },
    {
        id: '2',
        title: 'Free Delivery',
        subtitle: 'On orders above ₹199',
        code: 'FREEDEL',
        backgroundColor: ['#F2994A', '#F2C94C', '#ff9966'], // Sunny Orange
        icon: Truck,
        patternOpacity: 0.15,
    },
    {
        id: '3',
        title: 'Weekend Special',
        subtitle: 'Flat ₹75 OFF',
        code: 'WEEKEND75',
        backgroundColor: ['#8E2DE2', '#4A00E0', '#8000FF'], // Deep Purple
        icon: Sparkles,
        patternOpacity: 0.1,
    },
];

export function HomeBanner() {
    const { colors, isDark } = useTheme();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % BANNERS.length;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }, 5000); // Slower scroll for better readability

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderBanner = ({ item }: ListRenderItemInfo<Banner>) => (
        <TouchableOpacity activeOpacity={0.95}>
            <LinearGradient
                colors={item.backgroundColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banner}
            >
                {/* Decorative Background Circles */}
                <View style={[styles.circle, { top: -20, right: -20, width: 100, height: 100, opacity: item.patternOpacity }]} />
                <View style={[styles.circle, { bottom: -30, left: 10, width: 80, height: 80, opacity: item.patternOpacity }]} />

                <View style={styles.bannerContent}>
                    <View style={styles.textContent}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>

                        <View style={styles.actionRow}>
                            {item.code && (
                                <View style={styles.ticketContainer}>
                                    <View style={[styles.ticketNotch, styles.ticketNotchLeft]} />
                                    <View style={styles.ticketContent}>
                                        <Text style={styles.codeLabel}>CODE</Text>
                                        <Text style={styles.code}>{item.code}</Text>
                                    </View>
                                    <View style={[styles.ticketNotch, styles.ticketNotchRight]} />
                                </View>
                            )}

                            <View style={styles.ctaButton}>
                                <Text style={styles.ctaText}>Claim</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.iconContainer}>
                        <View style={styles.iconGlow} />
                        <item.icon size={64} color="#FFFFFF" strokeWidth={1.5} />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={BANNERS}
                renderItem={renderBanner}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={BANNER_WIDTH + SPACING.md}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                getItemLayout={(data, index) => ({
                    length: BANNER_WIDTH + SPACING.md,
                    offset: (BANNER_WIDTH + SPACING.md) * index,
                    index,
                })}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise((resolve) => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / (BANNER_WIDTH + SPACING.md)
                    );
                    setCurrentIndex(index);
                }}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {BANNERS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index === currentIndex ? colors.primary : isDark ? '#333' : '#E0E0E0',
                                width: index === currentIndex ? 24 : 8,
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
    },
    banner: {
        width: BANNER_WIDTH,
        height: BANNER_HEIGHT,
        borderRadius: RADIUS.xl,
        marginRight: SPACING.md,
        overflow: 'hidden',
        // Card shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    // Decorative
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
    },
    bannerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    textContent: {
        flex: 1,
        zIndex: 1,
    },
    iconContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.sm,
    },
    iconGlow: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        transform: [{ scale: 1.5 }],
    },
    title: {
        ...TYPOGRAPHY.h1,
        fontSize: 28,
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        ...TYPOGRAPHY.bodyMedium,
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: SPACING.lg,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    // Ticket Styles
    ticketContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        position: 'relative',
        height: 36,
        paddingHorizontal: 12,
    },
    ticketContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ticketNotch: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.1)', // Subtle integration
        top: 13, // (36-8)/2 - centered vertically relative to height
    },
    ticketNotchLeft: {
        left: -5,
    },
    ticketNotchRight: {
        right: -5,
    },
    codeLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 0.5,
    },
    code: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    // CTA Button
    ctaButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ctaText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: SPACING.md,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
});
