/**
 * GRIHGO Customer App - Cart Layout
 * Stack navigator for cart screens
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function CartLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="checkout" />
        </Stack>
    );
}
