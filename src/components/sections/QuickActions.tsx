/**
 * GRIHGO Customer App - Quick Actions
 * Category shortcuts (Food, Grocery, Offers, More)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Utensils, ShoppingBasket, Gift, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

interface QuickAction {
    id: string;
    label: string;
    icon: any;
    route?: string;
    color: string;
}

const ACTIONS: QuickAction[] = [
    { id: '1', label: 'Food', icon: Utensils, route: '/(tabs)/search', color: '#FF6B6B' },
    { id: '2', label: 'Grocery', icon: ShoppingBasket, route: '/grocery', color: '#4ECDC4' },
    { id: '3', label: 'Offers', icon: Gift, route: '/offers', color: '#FFE66D' },
    { id: '4', label: 'More', icon: MoreHorizontal, color: '#A8E6CF' },
];

export function QuickActions() {
    const { colors } = useTheme();

    const handlePress = (action: QuickAction) => {
        if (action.route) {
            router.push(action.route as any);
        }
    };

    return (
        <View style={styles.container}>
            {ACTIONS.map((action) => (
                <TouchableOpacity
                    key={action.id}
                    style={styles.actionItem}
                    onPress={() => handlePress(action)}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.iconContainer,
                            {
                                backgroundColor: colors.surface,
                                ...SHADOWS.sm,
                            },
                        ]}
                    >
                        <action.icon size={28} color={action.color} />
                    </View>
                    <Text style={[styles.label, { color: colors.text }]}>{action.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xxl,
    },
    actionItem: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    label: {
        ...TYPOGRAPHY.caption,
    },
});
