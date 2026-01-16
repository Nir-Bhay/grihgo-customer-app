/**
 * GRIHGO Customer App - Payment Methods Screen
 * Manage saved payment methods
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    CreditCard,
    Smartphone,
    Wallet,
    Plus,
    Check,
    Trash2,
    MoreVertical,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { Button } from '../../components/ui';

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'wallet';
    name: string;
    subtitle: string;
    icon: string;
    isDefault: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: '1',
        type: 'card',
        name: 'HDFC Credit Card',
        subtitle: '•••• •••• •••• 4532',
        icon: 'visa',
        isDefault: true,
    },
    {
        id: '2',
        type: 'card',
        name: 'ICICI Debit Card',
        subtitle: '•••• •••• •••• 8721',
        icon: 'mastercard',
        isDefault: false,
    },
    {
        id: '3',
        type: 'upi',
        name: 'Google Pay',
        subtitle: 'rahul@okaxis',
        icon: 'gpay',
        isDefault: false,
    },
    {
        id: '4',
        type: 'upi',
        name: 'PhonePe',
        subtitle: 'rahul@ybl',
        icon: 'phonepe',
        isDefault: false,
    },
    {
        id: '5',
        type: 'wallet',
        name: 'Paytm Wallet',
        subtitle: '₹250 available',
        icon: 'paytm',
        isDefault: false,
    },
];

export default function PaymentsScreen() {
    const { colors } = useTheme();
    const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);

    const handleSetDefault = (id: string) => {
        setPaymentMethods((prev) =>
            prev.map((method) => ({
                ...method,
                isDefault: method.id === id,
            }))
        );
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Remove Payment Method',
            'Are you sure you want to remove this payment method?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
                    },
                },
            ]
        );
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'card':
                return CreditCard;
            case 'upi':
                return Smartphone;
            case 'wallet':
                return Wallet;
            default:
                return CreditCard;
        }
    };

    const getCardBrandColor = (icon: string) => {
        switch (icon) {
            case 'visa':
                return '#1A1F71';
            case 'mastercard':
                return '#EB001B';
            default:
                return colors.primary;
        }
    };

    const renderPaymentMethod = (method: PaymentMethod) => {
        const IconComponent = getIcon(method.type);
        const brandColor = getCardBrandColor(method.icon);

        return (
            <View
                key={method.id}
                style={[
                    styles.paymentCard,
                    { backgroundColor: colors.surface, ...SHADOWS.sm },
                ]}
            >
                <TouchableOpacity
                    style={styles.paymentMain}
                    onPress={() => handleSetDefault(method.id)}
                    accessibilityLabel={`${method.name}. ${method.subtitle}${method.isDefault ? '. Default payment method' : ''}`}
                    accessibilityRole="button"
                >
                    <View style={[styles.iconContainer, { backgroundColor: brandColor + '15' }]}>
                        <IconComponent size={22} color={brandColor} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <View style={styles.paymentHeader}>
                            <Text style={[styles.paymentName, { color: colors.text }]}>
                                {method.name}
                            </Text>
                            {method.isDefault && (
                                <View style={[styles.defaultBadge, { backgroundColor: colors.successBg }]}>
                                    <Check size={10} color={colors.success} />
                                    <Text style={[styles.defaultText, { color: colors.success }]}>
                                        Default
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.paymentSubtitle, { color: colors.textSecondary }]}>
                            {method.subtitle}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(method.id)}
                    accessibilityLabel={`Remove ${method.name}`}
                    accessibilityRole="button"
                >
                    <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
            </View>
        );
    };

    const cards = paymentMethods.filter((m) => m.type === 'card');
    const upi = paymentMethods.filter((m) => m.type === 'upi');
    const wallets = paymentMethods.filter((m) => m.type === 'wallet');

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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Methods</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Cards Section */}
                {cards.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            CARDS
                        </Text>
                        {cards.map(renderPaymentMethod)}
                    </View>
                )}

                {/* UPI Section */}
                {upi.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            UPI
                        </Text>
                        {upi.map(renderPaymentMethod)}
                    </View>
                )}

                {/* Wallets Section */}
                {wallets.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            WALLETS
                        </Text>
                        {wallets.map(renderPaymentMethod)}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Payment Button */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    title="Add Payment Method"
                    onPress={() => Alert.alert('Add Payment', 'This feature will be available soon!')}
                    variant="primary"
                    icon="plus"
                    iconPosition="left"
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
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        ...TYPOGRAPHY.caption,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.md,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
    },
    paymentMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    paymentName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    paymentSubtitle: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.xs,
        gap: 2,
    },
    defaultText: {
        ...TYPOGRAPHY.captionSmall,
        fontWeight: '600',
    },
    deleteButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
});
