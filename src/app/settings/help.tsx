/**
 * GRIHGO Customer App - Help & Support Screen
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

interface HelpItem {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    action?: () => void;
}

export default function HelpScreen() {
    const { colors } = useTheme();

    const helpItems: HelpItem[] = [
        {
            id: 'faq',
            icon: 'frequently-asked-questions',
            title: 'FAQs',
            subtitle: 'Find answers to common questions',
        },
        {
            id: 'chat',
            icon: 'message-text-outline',
            title: 'Chat with Us',
            subtitle: 'Get instant support via chat',
        },
        {
            id: 'call',
            icon: 'phone-outline',
            title: 'Call Us',
            subtitle: '+91 1800 123 4567 (Toll Free)',
            action: () => Linking.openURL('tel:18001234567'),
        },
        {
            id: 'email',
            icon: 'email-outline',
            title: 'Email Support',
            subtitle: 'support@grihgo.com',
            action: () => Linking.openURL('mailto:support@grihgo.com'),
        },
    ];

    const quickLinks: HelpItem[] = [
        {
            id: 'order',
            icon: 'receipt',
            title: 'Order Issues',
            subtitle: 'Problems with recent orders',
        },
        {
            id: 'refund',
            icon: 'cash-refund',
            title: 'Refunds',
            subtitle: 'Track or request refunds',
        },
        {
            id: 'account',
            icon: 'account-outline',
            title: 'Account & Payments',
            subtitle: 'Profile, wallet, payment issues',
        },
    ];

    const renderItem = (item: HelpItem) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.helpItem, { backgroundColor: colors.surface }]}
            onPress={item.action}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                    {item.subtitle}
                </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Contact Options */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
                <View style={styles.section}>
                    {helpItems.map((item) => renderItem(item))}
                </View>

                {/* Quick Help */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Help</Text>
                <View style={styles.section}>
                    {quickLinks.map((item) => renderItem(item))}
                </View>

                {/* App Info */}
                <View style={[styles.appInfo, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.appName, { color: colors.text }]}>GRIHGO</Text>
                    <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
                        Version 1.0.0
                    </Text>
                    <View style={styles.legal}>
                        <TouchableOpacity>
                            <Text style={[styles.legalLink, { color: colors.primary }]}>Terms of Service</Text>
                        </TouchableOpacity>
                        <Text style={[styles.legalDot, { color: colors.textMuted }]}>•</Text>
                        <TouchableOpacity>
                            <Text style={[styles.legalLink, { color: colors.primary }]}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        marginBottom: SPACING.md,
        marginTop: SPACING.lg,
    },
    section: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    helpItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        gap: SPACING.md,
        marginBottom: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        ...TYPOGRAPHY.bodyMedium,
    },
    itemSubtitle: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    appInfo: {
        alignItems: 'center',
        padding: SPACING.xxl,
        borderRadius: RADIUS.lg,
        marginTop: SPACING.xxl,
        marginBottom: SPACING.xxl,
    },
    appName: {
        ...TYPOGRAPHY.h3,
    },
    appVersion: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
    },
    legal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.lg,
        gap: SPACING.sm,
    },
    legalLink: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    legalDot: {
        fontSize: 8,
    },
});
