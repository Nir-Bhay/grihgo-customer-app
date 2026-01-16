/**
 * GRIHGO Customer App - Theme Context
 * Provides light/dark mode theming across the app
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, ThemeColors, ColorScheme } from '../constants/Colors';

const THEME_STORAGE_KEY = '@grihgo_theme';

interface ThemeContextType {
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (scheme: ColorScheme) => void;
    colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const systemColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme === 'light' || savedTheme === 'dark') {
                    setColorScheme(savedTheme);
                } else {
                    // Default to light mode as requested
                    setColorScheme('light');
                }
            } catch (error) {
                console.warn('Failed to load theme:', error);
                setColorScheme('light'); // Fallback to light
            } finally {
                setIsLoaded(true);
            }
        };
        loadTheme();
    }, []);

    // Save theme changes
    const setTheme = async (scheme: ColorScheme) => {
        setColorScheme(scheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    };

    const toggleTheme = () => {
        setTheme(colorScheme === 'light' ? 'dark' : 'light');
    };

    const value = useMemo(
        () => ({
            isDark: colorScheme === 'dark',
            colors: COLORS[colorScheme],
            toggleTheme,
            setTheme,
            colorScheme,
        }),
        [colorScheme]
    );

    // Don't render until theme is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Helper hook for creating themed styles
export function useThemedStyles<T>(
    createStyles: (colors: ThemeColors, isDark: boolean) => T
): T {
    const { colors, isDark } = useTheme();
    return useMemo(() => createStyles(colors, isDark), [colors, isDark, createStyles]);
}
