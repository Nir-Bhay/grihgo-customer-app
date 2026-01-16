/**
 * GRIHGO Customer App - Edit Profile Screen
 * Edit user profile information
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Camera,
    User,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Check,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { Button } from '../../components/ui';

interface FormData {
    name: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    address: string;
}

export default function EditProfileScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        name: user?.name || 'Rahul Sharma',
        phone: user?.phone || '+91 98765 43210',
        email: 'rahul.sharma@email.com',
        dateOfBirth: '15 Aug 1995',
        address: '123 Main Street, Koramangala',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                'Profile Updated',
                'Your profile has been updated successfully!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }, 1000);
    };

    const handleChangePhoto = () => {
        Alert.alert(
            'Change Photo',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: () => { } },
                { text: 'Choose from Gallery', onPress: () => { } },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const getUserInitials = () => {
        if (formData.name) {
            const names = formData.name.split(' ');
            return names.length > 1
                ? `${names[0][0]}${names[1][0]}`
                : names[0][0];
        }
        return 'U';
    };

    const renderInput = (
        label: string,
        field: keyof FormData,
        icon: React.ReactNode,
        options?: {
            keyboardType?: 'default' | 'email-address' | 'phone-pad';
            editable?: boolean;
            multiline?: boolean;
        }
    ) => (
        <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                {label}
            </Text>
            <View
                style={[
                    styles.inputContainer,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
            >
                <View style={styles.inputIcon}>{icon}</View>
                <TextInput
                    style={[
                        styles.textInput,
                        { color: colors.text },
                        options?.multiline && styles.multilineInput,
                    ]}
                    value={formData[field]}
                    onChangeText={(value) => handleChange(field, value)}
                    keyboardType={options?.keyboardType || 'default'}
                    editable={options?.editable !== false}
                    multiline={options?.multiline}
                    placeholderTextColor={colors.textMuted}
                />
                {options?.editable === false && (
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.successBg }]}>
                        <Check size={12} color={colors.success} />
                    </View>
                )}
            </View>
            {field === 'phone' && (
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                    Phone number cannot be changed
                </Text>
            )}
        </View>
    );

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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{getUserInitials()}</Text>
                            <TouchableOpacity
                                style={[styles.cameraButton, { backgroundColor: colors.surface, ...SHADOWS.md }]}
                                onPress={handleChangePhoto}
                                accessibilityLabel="Change profile photo"
                                accessibilityRole="button"
                            >
                                <Camera size={18} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleChangePhoto}>
                            <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                                Change Photo
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        {renderInput(
                            'Full Name',
                            'name',
                            <User size={20} color={colors.textSecondary} />
                        )}

                        {renderInput(
                            'Phone Number',
                            'phone',
                            <Phone size={20} color={colors.textSecondary} />,
                            { keyboardType: 'phone-pad', editable: false }
                        )}

                        {renderInput(
                            'Email Address',
                            'email',
                            <Mail size={20} color={colors.textSecondary} />,
                            { keyboardType: 'email-address' }
                        )}

                        {renderInput(
                            'Date of Birth',
                            'dateOfBirth',
                            <Calendar size={20} color={colors.textSecondary} />
                        )}

                        {renderInput(
                            'Default Address',
                            'address',
                            <MapPin size={20} color={colors.textSecondary} />,
                            { multiline: true }
                        )}
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Save Button */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    variant="primary"
                    loading={isLoading}
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
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhotoText: {
        ...TYPOGRAPHY.bodyMedium,
        marginTop: SPACING.md,
    },
    form: {
        gap: SPACING.lg,
    },
    inputGroup: {},
    inputLabel: {
        ...TYPOGRAPHY.caption,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING.md,
        minHeight: 52,
    },
    inputIcon: {
        marginRight: SPACING.md,
    },
    textInput: {
        flex: 1,
        ...TYPOGRAPHY.body,
        paddingVertical: SPACING.md,
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    verifiedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    helperText: {
        ...TYPOGRAPHY.captionSmall,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
});
