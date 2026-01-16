/**
 * GRIHGO Customer App - Auth Group Layout
 * Handles authentication screens (Onboarding, Login, OTP)
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function AuthLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
        </Stack>
    );
}
