/**
 * GRIHGO Customer App - Error State Component
 * Reusable error display with retry functionality
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
    WifiOff,
    ServerCrash,
    AlertTriangle,
    RefreshCcw,
    MapPinOff,
    LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS } from '../../constants';
import { Button } from './Button';

type ErrorType = 'network' | 'server' | 'notFound' | 'location' | 'generic';

interface ErrorStateProps {
    /** Type of error for predefined messaging */
    type?: ErrorType;
    /** Custom icon (overrides type icon) */
    icon?: LucideIcon;
    /** Custom title */
    title?: string;
    /** Custom message */
    message?: string;
    /** Retry button handler */
    onRetry?: () => void;
    /** Custom retry button text */
    retryText?: string;
    /** Secondary action text */
    secondaryActionText?: string;
    /** Secondary action handler */
    onSecondaryAction?: () => void;
    /** Whether retry is loading */
    isRetrying?: boolean;
    /** Show as inline (smaller) variant */
    inline?: boolean;
    /** Custom container style */
    style?: ViewStyle;
}

const ERROR_CONFIG: Record<ErrorType, {
    icon: LucideIcon;
    title: string;
    message: string;
}> = {
    network: {
        icon: WifiOff,
        title: 'No Internet Connection',
        message: 'Please check your connection and try again',
    },
    server: {
        icon: ServerCrash,
        title: 'Something Went Wrong',
        message: 'We\'re having trouble connecting to our servers. Please try again.',
    },
    notFound: {
        icon: AlertTriangle,
        title: 'Not Found',
        message: 'The content you\'re looking for doesn\'t exist or has been removed.',
    },
    location: {
        icon: MapPinOff,
        title: 'Location Unavailable',
        message: 'We couldn\'t detect your location. Please enable location services.',
    },
    generic: {
        icon: AlertTriangle,
        title: 'Oops! Something went wrong',
        message: 'An unexpected error occurred. Please try again.',
    },
};

export function ErrorState({
    type = 'generic',
    icon,
    title,
    message,
    onRetry,
    retryText = 'Try Again',
    secondaryActionText,
    onSecondaryAction,
    isRetrying = false,
    inline = false,
    style,
}: ErrorStateProps) {
    const { colors } = useTheme();
    const config = ERROR_CONFIG[type];

    const IconComponent = icon || config.icon;
    const displayTitle = title || config.title;
    const displayMessage = message || config.message;

    if (inline) {
        return (
            <View
                style={[styles.inlineContainer, { backgroundColor: colors.errorBg }, style]}
                accessibilityRole="alert"
            >
                <IconComponent size={20} color={colors.error} />
                <View style={styles.inlineContent}>
                    <Text style={[styles.inlineTitle, { color: colors.error }]}>
                        {displayTitle}
                    </Text>
                    {onRetry && (
                        <Text
                            style={[styles.inlineRetry, { color: colors.error }]}
                            onPress={onRetry}
                            accessibilityRole="button"
                        >
                            {retryText}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View
            style={[styles.container, style]}
            accessibilityRole="alert"
            accessibilityLabel={`${displayTitle}. ${displayMessage}`}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.errorBg }]}>
                <IconComponent size={48} color={colors.error} strokeWidth={1.5} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
                {displayTitle}
            </Text>

            <Text style={[styles.message, { color: colors.textSecondary }]}>
                {displayMessage}
            </Text>

            <View style={styles.actions}>
                {onRetry && (
                    <Button
                        title={retryText}
                        onPress={onRetry}
                        variant="primary"
                        loading={isRetrying}
                        icon="refresh-cw"
                        iconPosition="left"
                        style={styles.retryButton}
                        accessibilityLabel={`${retryText} button`}
                    />
                )}

                {secondaryActionText && onSecondaryAction && (
                    <Button
                        title={secondaryActionText}
                        onPress={onSecondaryAction}
                        variant="ghost"
                        style={styles.secondaryButton}
                    />
                )}
            </View>
        </View>
    );
}

/**
 * Inline error banner for forms and inputs
 */
interface ErrorBannerProps {
    message: string;
    onDismiss?: () => void;
    style?: ViewStyle;
}

export function ErrorBanner({ message, onDismiss, style }: ErrorBannerProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.banner,
                { backgroundColor: colors.errorBg, borderColor: colors.error },
                style
            ]}
            accessibilityRole="alert"
        >
            <AlertTriangle size={18} color={colors.error} />
            <Text style={[styles.bannerText, { color: colors.error }]} numberOfLines={2}>
                {message}
            </Text>
            {onDismiss && (
                <Text
                    style={[styles.dismissText, { color: colors.error }]}
                    onPress={onDismiss}
                    accessibilityRole="button"
                    accessibilityLabel="Dismiss error"
                >
                    Dismiss
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.huge,
    },
    iconContainer: {
        padding: SPACING.lg,
        borderRadius: 999,
        marginBottom: SPACING.xl,
    },
    title: {
        ...TYPOGRAPHY.h3,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    message: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING.xl,
    },
    actions: {
        alignItems: 'center',
        gap: SPACING.md,
    },
    retryButton: {
        minWidth: 160,
    },
    secondaryButton: {
        minWidth: 160,
    },
    // Inline styles
    inlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        gap: SPACING.sm,
    },
    inlineContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inlineTitle: {
        ...TYPOGRAPHY.bodySmallMedium,
        flex: 1,
    },
    inlineRetry: {
        ...TYPOGRAPHY.bodySmallMedium,
        textDecorationLine: 'underline',
    },
    // Banner styles
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    bannerText: {
        ...TYPOGRAPHY.bodySmall,
        flex: 1,
    },
    dismissText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
});
