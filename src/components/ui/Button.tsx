/**
 * GRIHGO Customer App - Button Component
 * Reusable button with multiple variants and states
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Get variant-specific styles
    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        const isDisabled = disabled || loading;

        switch (variant) {
            case 'primary':
                return {
                    container: {
                        backgroundColor: isDisabled ? colors.disabled : colors.primary,
                        ...SHADOWS.sm,
                    },
                    text: { color: '#FFFFFF' },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: isDisabled ? colors.disabled : colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                    },
                    text: { color: isDisabled ? colors.textMuted : colors.text },
                };
            case 'outline':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        borderColor: isDisabled ? colors.disabled : colors.primary,
                    },
                    text: { color: isDisabled ? colors.disabled : colors.primary },
                };
            case 'ghost':
                return {
                    container: { backgroundColor: 'transparent' },
                    text: { color: isDisabled ? colors.disabled : colors.primary },
                };
        }
    };

    // Get size-specific styles
    const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
        switch (size) {
            case 'small':
                return {
                    container: { height: 36, paddingHorizontal: SPACING.md },
                    text: TYPOGRAPHY.buttonSmall,
                    iconSize: 16,
                };
            case 'medium':
                return {
                    container: { height: 44, paddingHorizontal: SPACING.lg },
                    text: TYPOGRAPHY.button,
                    iconSize: 20,
                };
            case 'large':
                return {
                    container: { height: 52, paddingHorizontal: SPACING.xl },
                    text: TYPOGRAPHY.button,
                    iconSize: 22,
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const IconComponent = icon ? (
        <MaterialCommunityIcons
            name={icon}
            size={sizeStyles.iconSize}
            color={variantStyles.text.color as string}
            style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
        />
    ) : null;

    return (
        <AnimatedTouchable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
                fullWidth && styles.fullWidth,
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variantStyles.text.color as string}
                    size="small"
                />
            ) : (
                <View style={styles.content}>
                    {iconPosition === 'left' && IconComponent}
                    <Text style={[styles.text, sizeStyles.text, variantStyles.text, textStyle]}>
                        {title}
                    </Text>
                    {iconPosition === 'right' && IconComponent}
                </View>
            )}
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    iconLeft: {
        marginRight: SPACING.sm,
    },
    iconRight: {
        marginLeft: SPACING.sm,
    },
});
