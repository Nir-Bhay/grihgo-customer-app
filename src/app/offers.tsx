/**
 * GRIHGO Customer App - Offers Screen
 * List of available coupons and deals with copy functionality
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Percent,
    Copy,
    Check,
    Tag,
    Clock,
    Gift,
    Truck,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../constants';
import { OFFERS, getActiveOffers, Offer } from '../data/mockData';
import { LoadingList, EmptyState } from '../components/ui';

// Icon mapping for offer types
const getOfferIcon = (emoji: string) => {
    switch (emoji) {
        case '🎉':
            return Gift;
        case '🍕':
            return Tag;
        case '😋':
            return Percent;
        case '🚀':
            return Truck;
        default:
            return Tag;
    }
};

export default function OffersScreen() {
    const { colors, isDark } = useTheme();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [offers, setOffers] = useState<Offer[]>(getActiveOffers());

    // Handle pull to refresh
    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        // Simulate API fetch
        setTimeout(() => {
            setOffers(getActiveOffers());
            setIsLoading(false);
        }, 800);
    }, []);

    // Handle copy to clipboard
    const handleCopy = async (code: string) => {
        try {
            await Clipboard.setStringAsync(code);
            setCopiedCode(code);

            // Show success feedback
            Alert.alert(
                'Copied!',
                `Code "${code}" has been copied to clipboard.`,
                [{ text: 'OK' }],
                { cancelable: true }
            );

            // Reset copied state after 3 seconds
            setTimeout(() => {
                setCopiedCode(null);
            }, 3000);
        } catch (error) {
            Alert.alert('Error', 'Failed to copy code. Please try again.');
        }
    };

    // Format date for display
    const formatValidTill = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return `Valid till ${date.toLocaleDateString('en-IN', options)}`;
    };

    // Check if offer is expiring soon (within 7 days)
    const isExpiringSoon = (dateString: string): boolean => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Offers & Coupons</Text>
                <View style={{ width: TOUCH_TARGETS.minimum }} />
            </View>

            {isLoading ? (
                <LoadingList count={4} variant="order" />
            ) : offers.length === 0 ? (
                <EmptyState
                    variant="generic"
                    emoji="🎁"
                    title="No offers available"
                    subtitle="Check back later for exciting deals and discounts!"
                    actionText="Refresh"
                    onAction={handleRefresh}
                />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={handleRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                            title="Pull to refresh"
                            titleColor={colors.textSecondary}
                        />
                    }
                >
                    {/* Offers Count */}
                    <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                        accessibilityRole="header"
                    >
                        {offers.length} Coupon{offers.length !== 1 ? 's' : ''} Available
                    </Text>

                    {offers.map((offer) => {
                        const IconComponent = getOfferIcon(offer.emoji);
                        const isCopied = copiedCode === offer.code;
                        const expiringSoon = isExpiringSoon(offer.validTill);

                        return (
                            <View
                                key={offer.id}
                                style={[
                                    styles.offerCard,
                                    {
                                        backgroundColor: colors.surface,
                                        ...SHADOWS.sm,
                                    },
                                ]}
                                accessibilityRole="none"
                                accessibilityLabel={`${offer.title}. ${offer.description}. Code: ${offer.code}`}
                            >
                                {/* Expiring Soon Badge */}
                                {expiringSoon && (
                                    <View style={[styles.expiringBadge, { backgroundColor: '#FEF3C7' }]}>
                                        <Clock size={12} color="#D97706" />
                                        <Text style={styles.expiringText}>Expiring Soon</Text>
                                    </View>
                                )}

                                <View style={styles.offerMain}>
                                    {/* Icon */}
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: offer.backgroundColor + '20' },
                                        ]}
                                    >
                                        <Text style={styles.emojiText}>{offer.emoji}</Text>
                                    </View>

                                    {/* Content */}
                                    <View style={styles.contentContainer}>
                                        <Text style={[styles.offerTitle, { color: colors.text }]}>
                                            {offer.title}
                                        </Text>
                                        <Text
                                            style={[styles.offerDesc, { color: colors.textSecondary }]}
                                            numberOfLines={2}
                                        >
                                            {offer.description}
                                        </Text>

                                        {/* Offer Details */}
                                        <View style={styles.detailsRow}>
                                            <View style={[styles.detailChip, { backgroundColor: colors.border + '50' }]}>
                                                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                                                    Min: ₹{offer.minOrder}
                                                </Text>
                                            </View>
                                            <View style={[styles.detailChip, { backgroundColor: colors.border + '50' }]}>
                                                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                                                    Max: ₹{offer.maxDiscount}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Discount Badge */}
                                    <View
                                        style={[
                                            styles.discountBadge,
                                            { backgroundColor: offer.backgroundColor },
                                        ]}
                                    >
                                        <Text style={styles.discountText}>{offer.discount}</Text>
                                    </View>
                                </View>

                                {/* Dashed Divider */}
                                <View style={styles.dashedDivider}>
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <View
                                            key={i}
                                            style={[styles.dash, { backgroundColor: colors.border }]}
                                        />
                                    ))}
                                </View>

                                {/* Footer with Code and Copy */}
                                <View style={[styles.footer, { backgroundColor: colors.background + '50' }]}>
                                    <View style={styles.codeSection}>
                                        <View style={[styles.codeWrapper, { borderColor: colors.border }]}>
                                            <Text style={[styles.codeText, { color: colors.text }]}>
                                                {offer.code}
                                            </Text>
                                        </View>
                                        <Text style={[styles.validText, { color: colors.textMuted }]}>
                                            {formatValidTill(offer.validTill)}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.copyButton,
                                            {
                                                backgroundColor: isCopied ? colors.success + '20' : colors.primary + '15',
                                            },
                                        ]}
                                        onPress={() => handleCopy(offer.code)}
                                        disabled={isCopied}
                                        accessibilityLabel={isCopied ? 'Code copied' : `Copy code ${offer.code}`}
                                        accessibilityRole="button"
                                        accessibilityState={{ disabled: isCopied }}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check size={16} color={colors.success} />
                                                <Text style={[styles.copyText, { color: colors.success }]}>
                                                    COPIED
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} color={colors.primary} />
                                                <Text style={[styles.copyText, { color: colors.primary }]}>
                                                    COPY
                                                </Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}

                    {/* Terms Note */}
                    <View style={styles.termsContainer}>
                        <Text style={[styles.termsText, { color: colors.textMuted }]}>
                            * Coupons are subject to terms and conditions. Discount will be applied at checkout.
                        </Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
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
    backButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...TYPOGRAPHY.h4,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.lg,
    },
    offerCard: {
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
    },
    expiringBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        marginLeft: SPACING.md,
        marginTop: SPACING.md,
        borderRadius: RADIUS.sm,
        gap: 4,
    },
    expiringText: {
        ...TYPOGRAPHY.caption,
        color: '#D97706',
        fontWeight: '600',
    },
    offerMain: {
        flexDirection: 'row',
        padding: SPACING.md,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    emojiText: {
        fontSize: 28,
    },
    contentContainer: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    offerTitle: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: 4,
    },
    offerDesc: {
        ...TYPOGRAPHY.caption,
        lineHeight: 18,
        marginBottom: SPACING.sm,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    detailChip: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    detailText: {
        ...TYPOGRAPHY.caption,
        fontSize: 10,
    },
    discountBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        alignSelf: 'flex-start',
    },
    discountText: {
        ...TYPOGRAPHY.bodySmallMedium,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    dashedDivider: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
    },
    dash: {
        width: 6,
        height: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    codeSection: {
        flex: 1,
    },
    codeWrapper: {
        borderWidth: 1,
        borderStyle: 'dashed',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    codeText: {
        ...TYPOGRAPHY.bodySmallMedium,
        fontWeight: '700',
        letterSpacing: 1,
    },
    validText: {
        ...TYPOGRAPHY.caption,
        fontSize: 11,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        gap: SPACING.xs,
        minHeight: TOUCH_TARGETS.minimum,
        minWidth: 90,
        justifyContent: 'center',
    },
    copyText: {
        ...TYPOGRAPHY.buttonSmall,
        fontWeight: '700',
    },
    termsContainer: {
        marginTop: SPACING.md,
        padding: SPACING.md,
    },
    termsText: {
        ...TYPOGRAPHY.caption,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
