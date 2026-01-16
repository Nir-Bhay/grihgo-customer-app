/**
 * GRIHGO Customer App - Login Screen
 * Phone number based authentication
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export default function LoginScreen() {
    const { colors } = useTheme();
    const [phoneNumber, setPhoneNumber] = useState('');

    const isValidPhone = phoneNumber.length === 10;

    const handleContinue = () => {
        if (isValidPhone) {
            router.push({
                pathname: '/(auth)/otp',
                params: { phone: phoneNumber },
            });
        }
    };

    const handleSocialLogin = (provider: 'google' | 'apple') => {
        // TODO: Implement social login
        console.log(`${provider} login`);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                    </View>
                </View>

                {/* Welcome Text */}
                <View style={styles.welcomeContainer}>
                    <Text style={[styles.welcomeSubtext, { color: colors.textSecondary }]}>
                        Welcome to
                    </Text>
                    <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                        GRIHGO
                    </Text>
                    <Text style={[styles.welcomeDescription, { color: colors.textSecondary }]}>
                        Order delicious food in just a few taps
                    </Text>
                </View>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                    <View
                        style={[
                            styles.phoneInput,
                            {
                                backgroundColor: colors.surface,
                                borderColor: phoneNumber ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <View style={styles.countryCode}>
                            <Text style={styles.flag}>🇮🇳</Text>
                            <Text style={[styles.code, { color: colors.text }]}>+91</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Enter mobile number"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        {
                            backgroundColor: isValidPhone ? colors.primary : colors.disabled,
                        },
                    ]}
                    onPress={handleContinue}
                    disabled={!isValidPhone}
                >
                    <Text style={styles.continueButtonText}>Continue with OTP</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                {/* Social Login */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, { borderColor: colors.border }]}
                        onPress={() => handleSocialLogin('google')}
                    >
                        <MaterialCommunityIcons name="google" size={20} color={colors.text} />
                        <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, { borderColor: colors.border }]}
                        onPress={() => handleSocialLogin('apple')}
                    >
                        <MaterialCommunityIcons name="apple" size={20} color={colors.text} />
                        <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Terms */}
                <Text style={[styles.terms, { color: colors.textMuted }]}>
                    By continuing, you agree to our{' '}
                    <Text style={{ color: colors.primary }}>Terms</Text> and{' '}
                    <Text style={{ color: colors.primary }}>Privacy Policy</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xxl,
        paddingTop: SPACING.huge,
        paddingBottom: SPACING.xxxl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 40,
        height: 40,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxxl,
    },
    welcomeSubtext: {
        ...TYPOGRAPHY.body,
        marginBottom: SPACING.xs,
    },
    welcomeTitle: {
        ...TYPOGRAPHY.h1,
        marginBottom: SPACING.sm,
    },
    welcomeDescription: {
        ...TYPOGRAPHY.bodySmall,
    },
    inputContainer: {
        marginBottom: SPACING.lg,
    },
    phoneInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        paddingHorizontal: SPACING.lg,
        ...SHADOWS.sm,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    flag: {
        fontSize: 20,
    },
    code: {
        ...TYPOGRAPHY.bodyMedium,
    },
    divider: {
        width: 1,
        height: 24,
        marginHorizontal: SPACING.md,
    },
    input: {
        flex: 1,
        ...TYPOGRAPHY.body,
    },
    continueButton: {
        height: 52,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    continueButtonText: {
        ...TYPOGRAPHY.button,
        color: '#FFFFFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        ...TYPOGRAPHY.bodySmall,
        marginHorizontal: SPACING.lg,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xxxl,
    },
    socialButton: {
        flex: 1,
        height: 52,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    socialButtonText: {
        ...TYPOGRAPHY.button,
    },
    terms: {
        ...TYPOGRAPHY.caption,
        textAlign: 'center',
        lineHeight: 20,
    },
});
