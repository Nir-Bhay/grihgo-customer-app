/**
 * GRIHGO Customer App - Onboarding Screen
 * Welcome carousel for first-time users
 */

import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ListRenderItemInfo,
} from 'react-native';
import { router } from 'expo-router';
import { Utensils, Zap, Wallet } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    icon: any;
    title: string;
    description: string;
}

const SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        icon: Utensils,
        title: 'Discover Local Favorites',
        description: 'Explore thousands of restaurants and cuisines near you.',
    },
    {
        id: '2',
        icon: Zap,
        title: 'Lightning Fast Delivery',
        description: 'Get your food delivered in minutes with real-time tracking.',
    },
    {
        id: '3',
        icon: Wallet,
        title: 'Save More, Eat More',
        description: 'Exclusive offers, loyalty rewards, and daily deals just for you.',
    },
];

export default function OnboardingScreen() {
    const { colors } = useTheme();
    const { completeOnboarding } = useAuth();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            // Mark onboarding as complete and go to login
            await completeOnboarding();
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = async () => {
        // Mark onboarding as complete and go to login
        await completeOnboarding();
        router.replace('/(auth)/login');
    };

    const renderItem = ({ item }: ListRenderItemInfo<OnboardingSlide>) => {
        return (
            <View style={styles.slide}>
                <View style={[styles.illustration, { backgroundColor: colors.surface }]}>
                    <item.icon size={100} color={colors.primary} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {item.description}
                    </Text>
                </View>
            </View>
        );
    }; const isLastSlide = currentIndex === SLIDES.length - 1;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                    );
                    setCurrentIndex(newIndex);
                }}
                keyExtractor={(item) => item.id}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {SLIDES.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index === currentIndex ? colors.primary : colors.border,
                                width: index === currentIndex ? 24 : 8,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                >
                    <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                        Skip
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: colors.primary }]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextText}>
                        {isLastSlide ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        width: SCREEN_WIDTH,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxxl,
    },
    illustration: {
        width: 280,
        height: 280,
        borderRadius: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.huge,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    title: {
        ...TYPOGRAPHY.h2,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    description: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xxl,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xxl,
        paddingBottom: SPACING.huge,
    },
    skipButton: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    skipText: {
        ...TYPOGRAPHY.button,
    },
    nextButton: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xxxl,
        borderRadius: RADIUS.md,
    },
    nextText: {
        ...TYPOGRAPHY.button,
        color: '#FFFFFF',
    },
});
