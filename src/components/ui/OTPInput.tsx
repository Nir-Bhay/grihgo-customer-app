/**
 * GRIHGO Customer App - OTP Input Component
 * 6-digit OTP input with auto-focus
 */

import React, { useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

interface OTPInputProps {
    length?: number;
    value: string[];
    onChange: (value: string[]) => void;
    onComplete?: (otp: string) => void;
    error?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    containerStyle?: ViewStyle;
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    onComplete,
    error = false,
    disabled = false,
    autoFocus = true,
    containerStyle,
}: OTPInputProps) {
    const { colors } = useTheme();
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const shakeAnim = useSharedValue(0);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        if (error) {
            // Shake animation on error
            shakeAnim.value = withSequence(
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
        }
    }, [error]);

    const handleChange = (text: string, index: number) => {
        const newValue = [...value];
        newValue[index] = text.slice(-1);
        onChange(newValue);

        // Auto-focus next input
        if (text && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newValue.every((v) => v !== '') && newValue.length === length) {
            onComplete?.(newValue.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        // If focusing on an empty box and there's an earlier empty box, focus that instead
        const firstEmptyIndex = value.findIndex((v) => v === '');
        if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
            inputRefs.current[firstEmptyIndex]?.focus();
        }
    };

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeAnim.value }],
    }));

    return (
        <Animated.View style={[styles.container, containerAnimatedStyle, containerStyle]}>
            {Array.from({ length }).map((_, index) => {
                const isFilled = value[index] !== '';
                const isActive = index === value.findIndex((v) => v === '');

                return (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputRefs.current[index] = ref; }}
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.surface,
                                borderColor: error
                                    ? colors.error
                                    : isActive
                                        ? colors.primary
                                        : isFilled
                                            ? colors.primary + '50'
                                            : colors.border,
                                color: colors.text,
                            },
                        ]}
                        value={value[index]}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => handleFocus(index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        editable={!disabled}
                    />
                );
            })}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        maxWidth: 52,
        height: 56,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        textAlign: 'center',
        ...TYPOGRAPHY.h3,
    },
});
