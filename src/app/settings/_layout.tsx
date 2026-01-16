/**
 * GRIHGO Customer App - Settings Layout
 * Stack navigator for settings screens
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="addresses" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="help" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="loyalty" />
            <Stack.Screen name="referral" />
            <Stack.Screen name="language" />
            <Stack.Screen name="edit-profile" />
        </Stack>
    );
}

