/**
 * GRIHGO Customer App - Toggle Component
 * Switch/Toggle for settings and options
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';

interface ToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    size?: 'small' | 'medium';
    label?: string;
    sublabel?: string;
    style?: ViewStyle;
}

const AnimatedView = Animated.View;

export function Toggle({
    value,
    onValueChange,
    disabled = false,
    size = 'medium',
    label,
    sublabel,
    style,
}: ToggleProps) {
    const { colors } = useTheme();
    const progress = useSharedValue(value ? 1 : 0);

    React.useEffect(() => {
        progress.value = withSpring(value ? 1 : 0, { damping: 15 });
    }, [value]);

    const trackWidth = size === 'small' ? 44 : 52;
    const trackHeight = size === 'small' ? 24 : 28;
    const thumbSize = size === 'small' ? 20 : 24;

    const trackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            [colors.border, colors.primary]
        );
        return { backgroundColor };
    });

    const thumbStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            progress.value,
            [0, 1],
            [2, trackWidth - thumbSize - 2]
        );
        return { transform: [{ translateX }] };
    });

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const Content = (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <AnimatedView
                style={[
                    styles.track,
                    {
                        width: trackWidth,
                        height: trackHeight,
                        opacity: disabled ? 0.5 : 1,
                    },
                    trackStyle,
                ]}
            >
                <AnimatedView
                    style={[
                        styles.thumb,
                        {
                            width: thumbSize,
                            height: thumbSize,
                        },
                        thumbStyle,
                    ]}
                />
            </AnimatedView>
        </TouchableOpacity>
    );

    if (label) {
        return (
            <View style={[styles.container, style]}>
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                    {sublabel && (
                        <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
                            {sublabel}
                        </Text>
                    )}
                </View>
                {Content}
            </View>
        );
    }

    return Content;
}

// Status Toggle (Online/Offline style)
interface StatusToggleProps {
    isActive: boolean;
    onToggle: (value: boolean) => void;
    activeLabel?: string;
    inactiveLabel?: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export function StatusToggle({
    isActive,
    onToggle,
    activeLabel = 'Online',
    inactiveLabel = 'Offline',
    disabled = false,
    style,
}: StatusToggleProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => !disabled && onToggle(!isActive)}
            activeOpacity={0.8}
            disabled={disabled}
            style={[
                styles.statusToggle,
                {
                    backgroundColor: isActive ? colors.successBg : colors.errorBg,
                    borderColor: isActive ? colors.success : colors.error,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.statusDot,
                    { backgroundColor: isActive ? colors.success : colors.error },
                ]}
            />
            <Text
                style={[
                    styles.statusText,
                    { color: isActive ? colors.success : colors.error },
                ]}
            >
                {isActive ? activeLabel : inactiveLabel}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    labelContainer: {
        flex: 1,
        marginRight: SPACING.lg,
    },
    label: {
        ...TYPOGRAPHY.body,
    },
    sublabel: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
    },
    track: {
        borderRadius: RADIUS.full,
        justifyContent: 'center',
    },
    thumb: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.full,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    statusToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        gap: SPACING.sm,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
    },
});
