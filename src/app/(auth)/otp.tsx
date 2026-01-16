/**
 * GRIHGO Customer App - OTP Verification Screen
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

const OTP_LENGTH = 6;
const RESEND_TIMER = 30;

export default function OTPScreen() {
    const { colors } = useTheme();
    const { login } = useAuth();
    const { phone } = useLocalSearchParams<{ phone: string }>();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [timer, setTimer] = useState(RESEND_TIMER);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (newOtp.every((digit) => digit !== '') && newOtp.length === OTP_LENGTH) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpCode: string) => {
        if (isLoading) return;

        setIsLoading(true);
        Keyboard.dismiss();

        try {
            const success = await login(phone || '', otpCode);

            if (success) {
                // Navigate to main app on success
                router.replace('/(tabs)');
            } else {
                Alert.alert('Invalid OTP', 'Please enter a valid OTP code.');
                // Clear OTP on failure
                setOtp(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = () => {
        if (canResend) {
            setTimer(RESEND_TIMER);
            setCanResend(false);
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
            // TODO: Call resend OTP API
        }
    };

    const isComplete = otp.every((digit) => digit !== '');
    const formattedTime = `00:${timer.toString().padStart(2, '0')}`;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    We've sent a 6-digit code to
                </Text>
                <Text style={[styles.phone, { color: colors.text }]}>
                    +91 {phone || '98765 43210'}
                </Text>
            </View>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputRefs.current[index] = ref; }}
                        style={[
                            styles.otpInput,
                            {
                                backgroundColor: colors.surface,
                                borderColor: focusedIndex === index ? colors.primary : colors.border,
                                color: colors.text,
                            },
                        ]}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => setFocusedIndex(index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        editable={!isLoading}
                    />
                ))}
            </View>

            {/* Timer / Resend */}
            <View style={styles.timerContainer}>
                {canResend ? (
                    <TouchableOpacity onPress={handleResend}>
                        <Text style={[styles.resendText, { color: colors.primary }]}>
                            Resend OTP
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                        Resend OTP in {formattedTime}
                    </Text>
                )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
                style={[
                    styles.verifyButton,
                    {
                        backgroundColor: isComplete && !isLoading ? colors.primary : colors.disabled,
                    },
                ]}
                onPress={() => handleVerify(otp.join(''))}
                disabled={!isComplete || isLoading}
            >
                <Text style={styles.verifyButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Text>
            </TouchableOpacity>

            {/* Alternative */}
            <View style={styles.alternativeContainer}>
                <Text style={[styles.alternativeText, { color: colors.textSecondary }]}>
                    Didn't receive code?
                </Text>
                <TouchableOpacity>
                    <Text style={[styles.callText, { color: colors.primary }]}>
                        Call me instead
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xxl,
    },
    backButton: {
        marginTop: SPACING.lg,
        padding: SPACING.sm,
        marginLeft: -SPACING.sm,
    },
    header: {
        marginTop: SPACING.xxl,
        marginBottom: SPACING.xxxl,
    },
    title: {
        ...TYPOGRAPHY.h2,
        marginBottom: SPACING.md,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
    },
    phone: {
        ...TYPOGRAPHY.bodyMedium,
        marginTop: SPACING.xs,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xxl,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        textAlign: 'center',
        ...TYPOGRAPHY.h3,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    timerText: {
        ...TYPOGRAPHY.body,
    },
    resendText: {
        ...TYPOGRAPHY.bodyMedium,
    },
    verifyButton: {
        height: 52,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    verifyButtonText: {
        ...TYPOGRAPHY.button,
        color: '#FFFFFF',
    },
    alternativeContainer: {
        alignItems: 'center',
        gap: SPACING.sm,
    },
    alternativeText: {
        ...TYPOGRAPHY.bodySmall,
    },
    callText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
});
