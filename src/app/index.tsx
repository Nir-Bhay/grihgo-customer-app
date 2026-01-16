/**
 * GRIHGO Customer App - Splash Screen
 * First screen shown on app launch with animated logo
 * Handles navigation based on auth state
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    withSequence,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { TYPOGRAPHY, SPACING } from '../constants';

export default function SplashScreen() {
    const { colors } = useTheme();
    const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuth();

    // Animation values
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const dotsOpacity = useSharedValue(0);

    // Navigate based on auth state
    const navigateToApp = () => {
        if (isAuthenticated) {
            // User is logged in - go to main app
            router.replace('/(tabs)');
        } else if (hasCompletedOnboarding) {
            // User has seen onboarding but not logged in - go to login
            router.replace('/(auth)/login');
        } else {
            // First time user - show onboarding
            router.replace('/(auth)/onboarding');
        }
    };

    useEffect(() => {
        // Start animations
        logoOpacity.value = withTiming(1, { duration: 400 });
        logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });

        textOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
        dotsOpacity.value = withDelay(800, withTiming(1, { duration: 300 }));
    }, []);

    useEffect(() => {
        // Wait for auth to load, then navigate
        if (!isLoading) {
            const timer = setTimeout(() => {
                navigateToApp();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, isAuthenticated, hasCompletedOnboarding]);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    const dotsAnimatedStyle = useAnimatedStyle(() => ({
        opacity: dotsOpacity.value,
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Logo */}
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
                    <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                </View>
            </Animated.View>

            {/* Brand Name & Tagline */}
            <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
                <Text style={[styles.brandName, { color: colors.primary }]}>
                    GRIHGO
                </Text>
                <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                    Fresh. Fast. For Everyone.
                </Text>
            </Animated.View>

            {/* Loading Dots */}
            <Animated.View style={[styles.dotsContainer, dotsAnimatedStyle]}>
                <LoadingDots color={colors.primary} />
            </Animated.View>
        </View>
    );
}

// Loading Dots Component
function LoadingDots({ color }: { color: string }) {
    const dot1Opacity = useSharedValue(0.3);
    const dot2Opacity = useSharedValue(0.3);
    const dot3Opacity = useSharedValue(0.3);

    useEffect(() => {
        // Animated pulse sequence
        const animate = () => {
            dot1Opacity.value = withSequence(
                withTiming(1, { duration: 300 }),
                withTiming(0.3, { duration: 300 })
            );
            dot2Opacity.value = withDelay(200, withSequence(
                withTiming(1, { duration: 300 }),
                withTiming(0.3, { duration: 300 })
            ));
            dot3Opacity.value = withDelay(400, withSequence(
                withTiming(1, { duration: 300 }),
                withTiming(0.3, { duration: 300 })
            ));
        };

        animate();
        const interval = setInterval(animate, 900);
        return () => clearInterval(interval);
    }, []);

    const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
    const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
    const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));

    return (
        <View style={styles.dots}>
            <Animated.View style={[styles.dot, { backgroundColor: color }, dot1Style]} />
            <Animated.View style={[styles.dot, { backgroundColor: color }, dot2Style]} />
            <Animated.View style={[styles.dot, { backgroundColor: color }, dot3Style]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: SPACING.xxl,
    },
    logoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 80,
        height: 80,
    },
    textContainer: {
        alignItems: 'center',
    },
    brandName: {
        ...TYPOGRAPHY.h1,
        letterSpacing: 2,
        marginBottom: SPACING.sm,
    },
    tagline: {
        ...TYPOGRAPHY.body,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 100,
    },
    dots: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
