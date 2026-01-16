/**
 * GRIHGO Customer App - Order Layout
 * Stack navigator for order screens
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function OrderLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="[id]" />
        </Stack>
    );
}
