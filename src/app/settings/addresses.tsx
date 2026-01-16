/**
 * GRIHGO Customer App - Manage Addresses Screen
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
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { Button } from '../../components/ui';

interface Address {
    id: string;
    type: string;
    address: string;
    landmark: string;
    isDefault: boolean;
    icon: string;
}

const ADDRESSES: Address[] = [
    {
        id: '1',
        type: 'Home',
        address: '123 Main Street, Koramangala, Bangalore 560034',
        landmark: 'Near Cafe Coffee Day',
        isDefault: true,
        icon: 'home',
    },
    {
        id: '2',
        type: 'Work',
        address: '456 Tech Park, Whitefield, Bangalore 560066',
        landmark: 'Building 5, Floor 3',
        isDefault: false,
        icon: 'office-building',
    },
];

export default function AddressesScreen() {
    const { colors } = useTheme();
    const [addresses, setAddresses] = useState(ADDRESSES);

    const handleSetDefault = (id: string) => {
        setAddresses((prev) =>
            prev.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Addresses</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {addresses.map((address) => (
                    <View
                        key={address.id}
                        style={[
                            styles.addressCard,
                            { backgroundColor: colors.surface, ...SHADOWS.sm },
                        ]}
                    >
                        <View style={styles.addressHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                                <MaterialCommunityIcons
                                    name={address.icon as any}
                                    size={20}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.addressType}>
                                <Text style={[styles.typeName, { color: colors.text }]}>{address.type}</Text>
                                {address.isDefault && (
                                    <View style={[styles.defaultBadge, { backgroundColor: colors.successBg }]}>
                                        <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.addressText, { color: colors.text }]}>
                            {address.address}
                        </Text>
                        <Text style={[styles.landmark, { color: colors.textSecondary }]}>
                            {address.landmark}
                        </Text>

                        {!address.isDefault && (
                            <TouchableOpacity
                                style={[styles.setDefaultBtn, { borderColor: colors.border }]}
                                onPress={() => handleSetDefault(address.id)}
                            >
                                <Text style={[styles.setDefaultText, { color: colors.primary }]}>
                                    Set as Default
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Address Button */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    title="Add New Address"
                    onPress={() => { }}
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
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    addressCard: {
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressType: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: SPACING.md,
        gap: SPACING.sm,
    },
    typeName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    defaultBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.xs,
    },
    defaultText: {
        ...TYPOGRAPHY.captionSmall,
    },
    addressText: {
        ...TYPOGRAPHY.body,
        marginBottom: SPACING.xs,
    },
    landmark: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.md,
    },
    setDefaultBtn: {
        paddingVertical: SPACING.sm,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    setDefaultText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    footer: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
});
