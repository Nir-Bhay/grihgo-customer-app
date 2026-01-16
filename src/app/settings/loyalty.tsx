/**
 * GRIHGO Customer App - Loyalty Points Screen
 * Points dashboard and history
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    Crown,
    Star,
    Gift,
    TrendingUp,
    TrendingDown,
    HelpCircle,
    ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';

interface PointsTransaction {
    id: string;
    type: 'earned' | 'redeemed';
    description: string;
    points: number;
    date: string;
}

const POINTS_HISTORY: PointsTransaction[] = [
    {
        id: '1',
        type: 'earned',
        description: 'Order from Burger King',
        points: 54,
        date: 'Today, 8:30 PM',
    },
    {
        id: '2',
        type: 'redeemed',
        description: 'Discount on Pizza Hut order',
        points: 100,
        date: 'Yesterday, 1:15 PM',
    },
    {
        id: '3',
        type: 'earned',
        description: 'Order from McDonald\'s',
        points: 32,
        date: '14 Jan, 6:00 PM',
    },
    {
        id: '4',
        type: 'earned',
        description: 'Birthday Bonus',
        points: 100,
        date: '10 Jan, 12:00 AM',
    },
    {
        id: '5',
        type: 'earned',
        description: 'Order from Dominos',
        points: 45,
        date: '8 Jan, 7:45 PM',
    },
    {
        id: '6',
        type: 'redeemed',
        description: 'Free delivery',
        points: 50,
        date: '5 Jan, 2:30 PM',
    },
];

const HOW_IT_WORKS = [
    { icon: Star, title: 'Earn Points', description: 'Get 10 points for every ₹100 spent' },
    { icon: Gift, title: 'Redeem Rewards', description: 'Use points for discounts & free delivery' },
    { icon: Crown, title: 'Level Up', description: 'Earn more as you reach higher tiers' },
];

export default function LoyaltyScreen() {
    const { colors } = useTheme();
    const totalPoints = 250;
    const pointsValue = Math.floor(totalPoints / 10); // ₹1 per 10 points

    const renderTransaction = (transaction: PointsTransaction) => {
        const isEarned = transaction.type === 'earned';
        const IconComponent = isEarned ? TrendingUp : TrendingDown;
        const iconColor = isEarned ? colors.success : colors.error;
        const pointsColor = isEarned ? colors.success : colors.error;
        const bgColor = isEarned ? colors.successBg : colors.errorBg;

        return (
            <View
                key={transaction.id}
                style={[styles.transactionCard, { backgroundColor: colors.surface }]}
            >
                <View style={[styles.transactionIcon, { backgroundColor: bgColor }]}>
                    <IconComponent size={18} color={iconColor} />
                </View>
                <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDesc, { color: colors.text }]}>
                        {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: colors.textMuted }]}>
                        {transaction.date}
                    </Text>
                </View>
                <Text style={[styles.transactionPoints, { color: pointsColor }]}>
                    {isEarned ? '+' : '-'}{transaction.points} pts
                </Text>
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Loyalty Points</Text>
                <TouchableOpacity
                    style={styles.helpButton}
                    accessibilityLabel="Help"
                    accessibilityRole="button"
                >
                    <HelpCircle size={22} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Points Card */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pointsCard}
                >
                    <View style={styles.crownContainer}>
                        <Crown size={40} color="#FFFFFF" />
                    </View>
                    <Text style={styles.pointsLabel}>Your Points</Text>
                    <Text style={styles.pointsValue}>{totalPoints}</Text>
                    <Text style={styles.pointsEquivalent}>Worth ₹{pointsValue}</Text>

                    <TouchableOpacity style={styles.redeemButton}>
                        <Text style={styles.redeemButtonText}>Redeem Now</Text>
                        <ChevronRight size={18} color={colors.primary} />
                    </TouchableOpacity>
                </LinearGradient>

                {/* How It Works */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        How It Works
                    </Text>
                    {HOW_IT_WORKS.map((item, index) => (
                        <View key={index} style={styles.howItWorksItem}>
                            <View style={[styles.howItWorksIcon, { backgroundColor: colors.primary + '15' }]}>
                                <item.icon size={20} color={colors.primary} />
                            </View>
                            <View style={styles.howItWorksText}>
                                <Text style={[styles.howItWorksTitle, { color: colors.text }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.howItWorksDesc, { color: colors.textSecondary }]}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Points History */}
                <View style={styles.historySection}>
                    <Text style={[styles.historyTitle, { color: colors.text }]}>
                        Points History
                    </Text>
                    {POINTS_HISTORY.map(renderTransaction)}
                </View>

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
    helpButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    pointsCard: {
        borderRadius: RADIUS.xl,
        padding: SPACING.xxl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    crownContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    pointsLabel: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pointsValue: {
        fontSize: 56,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 64,
    },
    pointsEquivalent: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: SPACING.lg,
    },
    redeemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.full,
        gap: SPACING.xs,
    },
    redeemButtonText: {
        ...TYPOGRAPHY.button,
        color: '#2ECC71',
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
    howItWorksItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    howItWorksIcon: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    howItWorksText: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    howItWorksTitle: {
        ...TYPOGRAPHY.bodyMedium,
    },
    howItWorksDesc: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    historySection: {
        marginBottom: SPACING.lg,
    },
    historyTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.md,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    transactionDesc: {
        ...TYPOGRAPHY.bodySmall,
    },
    transactionDate: {
        ...TYPOGRAPHY.captionSmall,
        marginTop: 2,
    },
    transactionPoints: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '700',
    },
});
