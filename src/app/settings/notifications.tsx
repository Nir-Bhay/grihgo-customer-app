/**
 * GRIHGO Customer App - Notification Settings Screen
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';
import { Toggle } from '../../components/ui';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export default function NotificationsScreen() {
    const { colors } = useTheme();
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'order',
            title: 'Order Updates',
            description: 'Get notified about your order status',
            enabled: true,
        },
        {
            id: 'offers',
            title: 'Offers & Promotions',
            description: 'Exclusive deals and discounts',
            enabled: true,
        },
        {
            id: 'recommendations',
            title: 'Recommendations',
            description: 'Personalized food suggestions',
            enabled: false,
        },
        {
            id: 'newsletter',
            title: 'Newsletter',
            description: 'Weekly food trends and tips',
            enabled: false,
        },
    ]);

    const toggleSetting = (id: string) => {
        setSettings((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    {settings.map((setting, index) => (
                        <View
                            key={setting.id}
                            style={[
                                styles.settingItem,
                                index < settings.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                },
                            ]}
                        >
                            <Toggle
                                value={setting.enabled}
                                onValueChange={() => toggleSetting(setting.id)}
                                label={setting.title}
                                sublabel={setting.description}
                            />
                        </View>
                    ))}
                </View>

                <Text style={[styles.note, { color: colors.textSecondary }]}>
                    You can always manage notification permissions in your device settings.
                </Text>
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
    section: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    settingItem: {
        padding: SPACING.lg,
    },
    note: {
        ...TYPOGRAPHY.caption,
        textAlign: 'center',
        marginTop: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
    },
});
