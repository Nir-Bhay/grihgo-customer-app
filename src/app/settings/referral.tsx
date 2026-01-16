/**
 * GRIHGO Customer App - Refer & Earn Screen
 * Referral program with sharing functionality
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import {
    ArrowLeft,
    Gift,
    Copy,
    Share2,
    Users,
    Wallet,
    ChevronRight,
    Check,
    Clock,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';

interface Referral {
    id: string;
    name: string;
    status: 'pending' | 'completed';
    date: string;
    earnings: number;
}

const REFERRALS: Referral[] = [
    {
        id: '1',
        name: 'Priya S.',
        status: 'completed',
        date: '12 Jan 2024',
        earnings: 100,
    },
    {
        id: '2',
        name: 'Amit K.',
        status: 'completed',
        date: '8 Jan 2024',
        earnings: 100,
    },
    {
        id: '3',
        name: 'Neha R.',
        status: 'pending',
        date: '5 Jan 2024',
        earnings: 0,
    },
];

const HOW_IT_WORKS_STEPS = [
    { step: 1, title: 'Share your code', description: 'Send your referral code to friends' },
    { step: 2, title: 'Friend signs up', description: 'They create an account using your code' },
    { step: 3, title: 'Friend orders', description: 'They complete their first order' },
    { step: 4, title: 'You both earn!', description: 'Get ₹100 each in your wallet' },
];

export default function ReferralScreen() {
    const { colors } = useTheme();
    const referralCode = 'RAHUL100';
    const totalEarnings = 200;
    const totalReferrals = 2;

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(referralCode);
        Alert.alert('Copied!', 'Referral code copied to clipboard');
    };

    const handleShare = () => {
        Alert.alert(
            'Share',
            'Share functionality will open your device\'s share menu',
            [{ text: 'OK' }]
        );
    };

    const renderReferral = (referral: Referral) => {
        const isCompleted = referral.status === 'completed';
        const StatusIcon = isCompleted ? Check : Clock;
        const statusColor = isCompleted ? colors.success : colors.warning;
        const statusBgColor = isCompleted ? colors.successBg : colors.warningBg;

        return (
            <View
                key={referral.id}
                style={[styles.referralCard, { backgroundColor: colors.surface }]}
            >
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                        {referral.name.charAt(0)}
                    </Text>
                </View>
                <View style={styles.referralInfo}>
                    <Text style={[styles.referralName, { color: colors.text }]}>
                        {referral.name}
                    </Text>
                    <Text style={[styles.referralDate, { color: colors.textMuted }]}>
                        {referral.date}
                    </Text>
                </View>
                <View style={styles.referralRight}>
                    {isCompleted && (
                        <Text style={[styles.earningsText, { color: colors.success }]}>
                            +₹{referral.earnings}
                        </Text>
                    )}
                    <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                        <StatusIcon size={12} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {isCompleted ? 'Earned' : 'Pending'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Refer & Earn</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <LinearGradient
                    colors={[colors.secondary, '#D35400']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <View style={styles.giftIcon}>
                        <Gift size={40} color="#FFFFFF" />
                    </View>
                    <Text style={styles.heroTitle}>Get ₹100</Text>
                    <Text style={styles.heroSubtitle}>for every friend who orders</Text>
                    <Text style={styles.heroNote}>Your friend also gets ₹100 off!</Text>
                </LinearGradient>

                {/* Referral Code Card */}
                <View style={[styles.codeCard, { backgroundColor: colors.surface, ...SHADOWS.sm }]}>
                    <Text style={[styles.codeLabel, { color: colors.textSecondary }]}>
                        Your Referral Code
                    </Text>
                    <View style={[styles.codeContainer, { borderColor: colors.border }]}>
                        <Text style={[styles.codeText, { color: colors.text }]}>
                            {referralCode}
                        </Text>
                        <TouchableOpacity
                            onPress={handleCopyCode}
                            style={[styles.copyButton, { backgroundColor: colors.primary }]}
                            accessibilityLabel="Copy referral code"
                            accessibilityRole="button"
                        >
                            <Copy size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.shareButton, { borderColor: colors.primary }]}
                        onPress={handleShare}
                        accessibilityLabel="Share referral code"
                        accessibilityRole="button"
                    >
                        <Share2 size={18} color={colors.primary} />
                        <Text style={[styles.shareButtonText, { color: colors.primary }]}>
                            Share with Friends
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
                            <Users size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{totalReferrals}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Referrals</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
                            <Wallet size={20} color={colors.success} />
                        </View>
                        <Text style={[styles.statValue, { color: colors.text }]}>₹{totalEarnings}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Earned</Text>
                    </View>
                </View>

                {/* How It Works */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        How It Works
                    </Text>
                    {HOW_IT_WORKS_STEPS.map((item, index) => (
                        <View key={index} style={styles.stepItem}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                                <Text style={styles.stepNumberText}>{item.step}</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={[styles.stepTitle, { color: colors.text }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                    {item.description}
                                </Text>
                            </View>
                            {index < HOW_IT_WORKS_STEPS.length - 1 && (
                                <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Referral History */}
                {REFERRALS.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={[styles.historyTitle, { color: colors.text }]}>
                            Your Referrals
                        </Text>
                        {REFERRALS.map(renderReferral)}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
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
    backButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    heroCard: {
        borderRadius: RADIUS.xl,
        padding: SPACING.xxl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    giftIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    heroSubtitle: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    heroNote: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.sm,
    },
    codeCard: {
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
    },
    codeLabel: {
        ...TYPOGRAPHY.caption,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
    },
    codeText: {
        flex: 1,
        ...TYPOGRAPHY.h3,
        letterSpacing: 2,
        textAlign: 'center',
    },
    copyButton: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        gap: SPACING.sm,
    },
    shareButtonText: {
        ...TYPOGRAPHY.button,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    statValue: {
        ...TYPOGRAPHY.h3,
    },
    statLabel: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    section: {
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.lg,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
        position: 'relative',
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    stepContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    stepTitle: {
        ...TYPOGRAPHY.bodyMedium,
    },
    stepDesc: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    stepLine: {
        position: 'absolute',
        left: 13,
        top: 32,
        width: 2,
        height: 24,
    },
    historySection: {
        marginBottom: SPACING.lg,
    },
    historyTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.md,
    },
    referralCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...TYPOGRAPHY.h4,
    },
    referralInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    referralName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    referralDate: {
        ...TYPOGRAPHY.captionSmall,
        marginTop: 2,
    },
    referralRight: {
        alignItems: 'flex-end',
    },
    earningsText: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '700',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.xs,
        gap: 4,
    },
    statusText: {
        ...TYPOGRAPHY.captionSmall,
        fontWeight: '600',
    },
});
