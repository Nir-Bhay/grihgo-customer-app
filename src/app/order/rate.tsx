/**
 * GRIHGO Customer App - Rate Order Screen
 * Rate delivery partner and food quality after order
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { Button, StarRating } from '../../components/ui';

const QUICK_FEEDBACK = [
    { id: '1', label: 'On Time', emoji: '⏱️' },
    { id: '2', label: 'Polite', emoji: '😊' },
    { id: '3', label: 'Good Packaging', emoji: '📦' },
    { id: '4', label: 'Followed Instructions', emoji: '✅' },
];

const FOOD_FEEDBACK = [
    { id: '1', label: 'Tasty', emoji: '😋' },
    { id: '2', label: 'Fresh', emoji: '🥗' },
    { id: '3', label: 'Good Quantity', emoji: '👍' },
    { id: '4', label: 'Well Packed', emoji: '📦' },
];

export default function RateOrderScreen() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [deliveryRating, setDeliveryRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [selectedDeliveryFeedback, setSelectedDeliveryFeedback] = useState<string[]>([]);
    const [selectedFoodFeedback, setSelectedFoodFeedback] = useState<string[]>([]);
    const [tip, setTip] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleDeliveryFeedback = (id: string) => {
        setSelectedDeliveryFeedback((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const toggleFoodFeedback = (id: string) => {
        setSelectedFoodFeedback((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Rate Your Experience</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Delivery Rating */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.emojiContainer, { backgroundColor: colors.primary + '15' }]}>
                            <Text style={styles.emoji}>🛵</Text>
                        </View>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Delivery Experience
                            </Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                                Rahul S. delivered your order
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ratingContainer}>
                        <StarRating
                            rating={deliveryRating}
                            size="large"
                            interactive
                            onRatingChange={setDeliveryRating}
                        />
                    </View>

                    {deliveryRating > 0 && (
                        <View style={styles.feedbackChips}>
                            {QUICK_FEEDBACK.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: selectedDeliveryFeedback.includes(item.id)
                                                ? colors.primary
                                                : colors.background,
                                            borderColor: selectedDeliveryFeedback.includes(item.id)
                                                ? colors.primary
                                                : colors.border,
                                        },
                                    ]}
                                    onPress={() => toggleDeliveryFeedback(item.id)}
                                >
                                    <Text style={styles.chipEmoji}>{item.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.chipLabel,
                                            {
                                                color: selectedDeliveryFeedback.includes(item.id)
                                                    ? '#FFFFFF'
                                                    : colors.text,
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Tip Section */}
                    {deliveryRating >= 4 && (
                        <View style={styles.tipSection}>
                            <Text style={[styles.tipTitle, { color: colors.text }]}>
                                Add a tip for Rahul? 💜
                            </Text>
                            <View style={styles.tipOptions}>
                                {[0, 20, 30, 50].map((amount) => (
                                    <TouchableOpacity
                                        key={amount}
                                        style={[
                                            styles.tipOption,
                                            {
                                                backgroundColor: tip === amount ? colors.primary : colors.background,
                                                borderColor: tip === amount ? colors.primary : colors.border,
                                            },
                                        ]}
                                        onPress={() => setTip(amount)}
                                    >
                                        <Text
                                            style={[
                                                styles.tipText,
                                                { color: tip === amount ? '#FFFFFF' : colors.text },
                                            ]}
                                        >
                                            {amount === 0 ? 'No tip' : `₹${amount}`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Food Rating */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.emojiContainer, { backgroundColor: colors.primary + '15' }]}>
                            <Text style={styles.emoji}>🍛</Text>
                        </View>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Food Quality
                            </Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                                Paradise Biryani
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ratingContainer}>
                        <StarRating
                            rating={foodRating}
                            size="large"
                            interactive
                            onRatingChange={setFoodRating}
                        />
                    </View>

                    {foodRating > 0 && (
                        <View style={styles.feedbackChips}>
                            {FOOD_FEEDBACK.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: selectedFoodFeedback.includes(item.id)
                                                ? colors.primary
                                                : colors.background,
                                            borderColor: selectedFoodFeedback.includes(item.id)
                                                ? colors.primary
                                                : colors.border,
                                        },
                                    ]}
                                    onPress={() => toggleFoodFeedback(item.id)}
                                >
                                    <Text style={styles.chipEmoji}>{item.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.chipLabel,
                                            {
                                                color: selectedFoodFeedback.includes(item.id)
                                                    ? '#FFFFFF'
                                                    : colors.text,
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Written Review */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.reviewTitle, { color: colors.text }]}>
                        Write a Review (Optional)
                    </Text>
                    <TextInput
                        style={[
                            styles.reviewInput,
                            {
                                color: colors.text,
                                borderColor: colors.border,
                                backgroundColor: colors.background,
                            },
                        ]}
                        placeholder="Share your experience..."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        value={review}
                        onChangeText={setReview}
                    />
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Submit Button */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    title="Submit Rating"
                    onPress={handleSubmit}
                    variant="primary"
                    loading={isSubmitting}
                    disabled={deliveryRating === 0 && foodRating === 0}
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>
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
        paddingVertical: SPACING.md,
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    content: {
        flex: 1,
    },
    section: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 24,
    },
    sectionTitle: {
        ...TYPOGRAPHY.bodyMedium,
    },
    sectionSubtitle: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    ratingContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    feedbackChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        gap: SPACING.xs,
    },
    chipEmoji: {
        fontSize: 14,
    },
    chipLabel: {
        ...TYPOGRAPHY.bodySmall,
    },
    tipSection: {
        marginTop: SPACING.lg,
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    tipTitle: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: SPACING.md,
    },
    tipOptions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    tipOption: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    tipText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    reviewTitle: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: SPACING.md,
    },
    reviewInput: {
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        minHeight: 100,
        textAlignVertical: 'top',
        ...TYPOGRAPHY.body,
    },
    footer: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
});
