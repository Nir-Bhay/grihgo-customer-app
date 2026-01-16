/**
 * GRIHGO Customer App - Profile Screen
 * User account and settings
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    MapPin,
    CreditCard,
    FileText,
    Wallet,
    Star,
    Gift,
    Bell,
    Globe,
    HelpCircle,
    Info,
    LogOut,
    ChevronRight,
    Pencil,
    Crown,
    Moon,
    Sun,
    ShieldCheck,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { Toggle } from '../../components/ui';

interface MenuItem {
    id: string;
    icon: any;
    label: string;
    subtitle?: string;
    route?: string;
    badge?: string;
    onPress?: () => void;
}

const ACCOUNT_ITEMS: MenuItem[] = [
    { id: 'addresses', icon: MapPin, label: 'My Addresses', route: '/settings/addresses' },
    { id: 'payments', icon: CreditCard, label: 'Payment Methods', subtitle: '2 cards saved', route: '/settings/payments' },
    { id: 'orders', icon: FileText, label: 'Order History', route: '/settings/orders' },
    { id: 'wallet', icon: Wallet, label: 'GRIHGO Wallet', subtitle: '₹150 available' },
];

const REWARDS_ITEMS: MenuItem[] = [
    { id: 'points', icon: Star, label: 'Loyalty Points', badge: '250 pts', route: '/settings/loyalty' },
    { id: 'refer', icon: Gift, label: 'Refer & Earn', subtitle: 'Get ₹100 per referral', route: '/settings/referral' },
];

const SETTINGS_ITEMS: MenuItem[] = [
    { id: 'notifications', icon: Bell, label: 'Notifications', route: '/settings/notifications' },
    { id: 'language', icon: Globe, label: 'Language', subtitle: 'English', route: '/settings/language' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', route: '/settings/help' },
    { id: 'about', icon: Info, label: 'About GRIHGO' },
];

export default function ProfileScreen() {
    const { colors, setTheme, isDark } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/(auth)/login');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleEditProfile = () => {
        router.push('/settings/edit-profile');
    };

    const handleRewardsPress = () => {
        Alert.alert(
            'Loyalty Rewards',
            'You have 250 points. Redeem them on your next order for discounts!',
            [{ text: 'OK' }]
        );
    };

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => {
                if (item.onPress) {
                    item.onPress();
                } else if (item.route) {
                    router.push(item.route as any);
                } else {
                    Alert.alert(item.label, 'This feature will be available soon!');
                }
            }}
            accessibilityLabel={`${item.label}${item.subtitle ? `. ${item.subtitle}` : ''}${item.badge ? `. ${item.badge}` : ''}`}
            accessibilityRole="button"
            accessibilityHint={item.route ? `Navigate to ${item.label}` : undefined}
        >
            <item.icon size={22} color={colors.textSecondary} />
            <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
                {item.subtitle && (
                    <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                        {item.subtitle}
                    </Text>
                )}
            </View>
            {item.badge && (
                <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{item.badge}</Text>
                </View>
            )}
            <ChevronRight size={20} color={colors.border} />
        </TouchableOpacity>
    );

    // Get user initials
    const getUserInitials = () => {
        if (user?.name) {
            const names = user.name.split(' ');
            return names.length > 1
                ? `${names[0][0]}${names[1][0]}`
                : names[0][0];
        }
        return 'U';
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text
                        style={[styles.title, { color: colors.text }]}
                        accessibilityRole="header"
                    >
                        Profile
                    </Text>
                </View>

                {/* User Card */}
                <TouchableOpacity
                    style={[styles.userCard, { backgroundColor: colors.surface, ...SHADOWS.md }]}
                    onPress={handleEditProfile}
                    accessibilityLabel={`Profile: ${user?.name || 'User'}. Phone: ${user?.phone || 'Not set'}. Tap to edit`}
                    accessibilityRole="button"
                >
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>{getUserInitials()}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            {user?.name || 'Rahul Sharma'}
                        </Text>
                        <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
                            {user?.phone || '+91 98765 43210'}
                        </Text>
                        <View style={styles.verifiedBadge}>
                            <ShieldCheck size={12} color={colors.success} />
                            <Text style={[styles.verifiedText, { color: colors.success }]}>Verified</Text>
                        </View>
                    </View>
                    <View style={styles.editButton}>
                        <Pencil size={18} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* Rewards Card */}
                <TouchableOpacity
                    style={[styles.rewardsCard, { backgroundColor: colors.primary }]}
                    onPress={handleRewardsPress}
                    accessibilityLabel="Loyalty rewards. 250 points available. Tap to redeem for discounts"
                    accessibilityRole="button"
                >
                    <View style={styles.rewardsLeft}>
                        <View style={styles.crownContainer}>
                            <Crown size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.rewardsText}>
                            <Text style={styles.rewardsTitle}>250 Points</Text>
                            <Text style={styles.rewardsSubtitle}>Redeem for discounts</Text>
                        </View>
                    </View>
                    <ChevronRight size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Account Section */}
                <View
                    style={[styles.section, { backgroundColor: colors.surface }]}
                    accessibilityRole="list"
                    accessibilityLabel="My Account section"
                >
                    <Text
                        style={[styles.sectionTitle, { color: colors.textSecondary }]}
                        accessibilityRole="header"
                    >
                        My Account
                    </Text>
                    {ACCOUNT_ITEMS.map(renderMenuItem)}
                </View>

                {/* Rewards Section */}
                <View
                    style={[styles.section, { backgroundColor: colors.surface }]}
                    accessibilityRole="list"
                    accessibilityLabel="Rewards section"
                >
                    <Text
                        style={[styles.sectionTitle, { color: colors.textSecondary }]}
                        accessibilityRole="header"
                    >
                        Rewards
                    </Text>
                    {REWARDS_ITEMS.map(renderMenuItem)}
                </View>

                {/* Settings Section */}
                <View
                    style={[styles.section, { backgroundColor: colors.surface }]}
                    accessibilityRole="list"
                    accessibilityLabel="Settings section"
                >
                    <Text
                        style={[styles.sectionTitle, { color: colors.textSecondary }]}
                        accessibilityRole="header"
                    >
                        Settings
                    </Text>

                    {/* Dark Mode Toggle */}
                    <View
                        style={styles.menuItem}
                        accessibilityRole="switch"
                        accessibilityLabel={`Dark mode. Currently ${isDark ? 'on' : 'off'}`}
                        accessibilityState={{ checked: isDark }}
                    >
                        {isDark ? (
                            <Moon size={22} color={colors.textSecondary} />
                        ) : (
                            <Sun size={22} color={colors.textSecondary} />
                        )}
                        <View style={styles.menuItemContent}>
                            <Text style={[styles.menuItemLabel, { color: colors.text }]}>Dark Mode</Text>
                            <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                                {isDark ? 'On' : 'Off'}
                            </Text>
                        </View>
                        <Toggle
                            value={isDark}
                            onValueChange={(newValue) => setTheme(newValue ? 'dark' : 'light')}
                            size="small"
                        />
                    </View>

                    {SETTINGS_ITEMS.map(renderMenuItem)}
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: colors.error + '50' }]}
                    onPress={handleLogout}
                    accessibilityLabel="Log out"
                    accessibilityRole="button"
                    accessibilityHint="Double tap to log out of your account"
                >
                    <LogOut size={20} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
                </TouchableOpacity>

                {/* Version & Legal */}
                <View style={styles.footer}>
                    <Text style={[styles.version, { color: colors.textMuted }]}>
                        Version 1.0.0
                    </Text>
                    <View style={styles.legalLinks}>
                        <TouchableOpacity
                            accessibilityLabel="Privacy Policy"
                            accessibilityRole="link"
                        >
                            <Text style={[styles.legalLink, { color: colors.textSecondary }]}>
                                Privacy Policy
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.legalDivider, { color: colors.textMuted }]}>•</Text>
                        <TouchableOpacity
                            accessibilityLabel="Terms of Service"
                            accessibilityRole="link"
                        >
                            <Text style={[styles.legalLink, { color: colors.textSecondary }]}>
                                Terms of Service
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h2,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        minHeight: TOUCH_TARGETS.recommended,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...TYPOGRAPHY.h3,
        color: '#FFFFFF',
    },
    userInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    userName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    userPhone: {
        ...TYPOGRAPHY.bodySmall,
        marginTop: 2,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    verifiedText: {
        ...TYPOGRAPHY.caption,
        fontSize: 11,
        fontWeight: '600',
    },
    editButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        minHeight: TOUCH_TARGETS.recommended,
    },
    rewardsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    crownContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardsText: {},
    rewardsTitle: {
        ...TYPOGRAPHY.bodyMedium,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    rewardsSubtitle: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    section: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    sectionTitle: {
        ...TYPOGRAPHY.caption,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        gap: SPACING.md,
        minHeight: TOUCH_TARGETS.recommended,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemLabel: {
        ...TYPOGRAPHY.body,
    },
    menuItemSubtitle: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    badgeText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
        fontSize: 11,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.md,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1.5,
        gap: SPACING.sm,
        minHeight: TOUCH_TARGETS.recommended,
    },
    logoutText: {
        ...TYPOGRAPHY.button,
    },
    footer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    version: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.sm,
    },
    legalLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    legalLink: {
        ...TYPOGRAPHY.caption,
    },
    legalDivider: {
        ...TYPOGRAPHY.caption,
    },
});
