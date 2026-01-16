/**
 * GRIHGO Customer App - Root Layout
 * Configures providers and navigation structure with protected routes
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

function RootLayoutNav() {
    const { isDark, colors } = useTheme();
    const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuth();

    // Show nothing while loading auth state
    if (isLoading) {
        return null;
    }

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                    animation: 'slide_from_right',
                }}
            >
                {/* Initial route is always splash/index */}
                <Stack.Screen name="index" />

                {/* Auth Group - for unauthenticated users */}
                <Stack.Screen name="(auth)" />

                {/* Main App Tabs - for authenticated users */}
                <Stack.Screen name="(tabs)" />

                {/* Restaurant Detail */}
                <Stack.Screen
                    name="restaurant/[id]"
                    options={{
                        animation: 'slide_from_bottom',
                    }}
                />

                {/* Food Detail */}
                <Stack.Screen
                    name="food/[id]"
                    options={{
                        animation: 'slide_from_bottom',
                    }}
                />

                {/* Grocery */}
                <Stack.Screen name="grocery" />

                {/* Notifications */}
                <Stack.Screen name="notifications" />

                {/* Offers */}
                <Stack.Screen name="offers" />

                {/* Cart Screens */}
                <Stack.Screen name="cart" />

                {/* Order Screens */}
                <Stack.Screen name="order" />

                {/* Settings Screens */}
                <Stack.Screen name="settings" />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <RootLayoutNav />
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
