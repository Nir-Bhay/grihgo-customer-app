/**
 * GRIHGO Customer App - Input Component
 * Text input with optional icon and phone number variant
 */

import React, { useState, forwardRef } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    onRightIconPress?: () => void;
    error?: string;
    hint?: string;
    containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            icon,
            rightIcon,
            onRightIconPress,
            error,
            hint,
            containerStyle,
            ...props
        },
        ref
    ) => {
        const { colors } = useTheme();
        const [isFocused, setIsFocused] = useState(false);

        const getBorderColor = () => {
            if (error) return colors.error;
            if (isFocused) return colors.primary;
            return colors.border;
        };

        return (
            <View style={[styles.container, containerStyle]}>
                {label && (
                    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                )}

                <View
                    style={[
                        styles.inputContainer,
                        {
                            backgroundColor: colors.surface,
                            borderColor: getBorderColor(),
                        },
                    ]}
                >
                    {icon && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={20}
                            color={isFocused ? colors.primary : colors.textSecondary}
                            style={styles.leftIcon}
                        />
                    )}

                    <TextInput
                        ref={ref}
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.textMuted}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />

                    {rightIcon && (
                        <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
                            <MaterialCommunityIcons
                                name={rightIcon}
                                size={20}
                                color={colors.textSecondary}
                                style={styles.rightIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {error && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                )}

                {hint && !error && (
                    <Text style={[styles.hintText, { color: colors.textSecondary }]}>{hint}</Text>
                )}
            </View>
        );
    }
);

Input.displayName = 'Input';

// Phone Input Variant
interface PhoneInputProps extends Omit<TextInputProps, 'style' | 'keyboardType' | 'maxLength'> {
    label?: string;
    error?: string;
    countryCode?: string;
    containerStyle?: ViewStyle;
}

export const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
    ({ label, error, countryCode = '+91', containerStyle, ...props }, ref) => {
        const { colors } = useTheme();
        const [isFocused, setIsFocused] = useState(false);

        const getBorderColor = () => {
            if (error) return colors.error;
            if (isFocused) return colors.primary;
            return colors.border;
        };

        return (
            <View style={[styles.container, containerStyle]}>
                {label && (
                    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                )}

                <View
                    style={[
                        styles.inputContainer,
                        {
                            backgroundColor: colors.surface,
                            borderColor: getBorderColor(),
                        },
                    ]}
                >
                    <View style={styles.phonePrefix}>
                        <Text style={styles.flag}>🇮🇳</Text>
                        <Text style={[styles.countryCode, { color: colors.text }]}>
                            {countryCode}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TextInput
                        ref={ref}
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.textMuted}
                        keyboardType="phone-pad"
                        maxLength={10}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                </View>

                {error && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                )}
            </View>
        );
    }
);

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    label: {
        ...TYPOGRAPHY.bodySmallMedium,
        marginBottom: SPACING.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        paddingHorizontal: SPACING.lg,
        ...SHADOWS.sm,
    },
    input: {
        flex: 1,
        ...TYPOGRAPHY.body,
        padding: 0,
    },
    leftIcon: {
        marginRight: SPACING.md,
    },
    rightIcon: {
        marginLeft: SPACING.md,
    },
    phonePrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    flag: {
        fontSize: 20,
    },
    countryCode: {
        ...TYPOGRAPHY.bodyMedium,
    },
    divider: {
        width: 1,
        height: 24,
        marginHorizontal: SPACING.md,
    },
    errorText: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
    },
    hintText: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
    },
});
