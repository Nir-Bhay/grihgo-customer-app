/**
 * GRIHGO Customer App - Design Token Colors
 * DO NOT MODIFY - Matches approved design spec
 */

export const COLORS = {
    // Light Mode
    light: {
        // Brand Colors
        primary: '#2ECC71',
        primaryDark: '#1E8449',
        primaryDeep: '#0D2818',
        secondary: '#E67E22', // Added secondary color (Orange)

        // Backgrounds
        background: '#F8F9FA',
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',

        // Text
        text: '#1A3A2D',
        textSecondary: '#5D6D7B',
        textMuted: '#9CA3AF',

        // Borders
        border: '#E5E7EB',
        borderLight: '#F3F4F6',

        // Status Colors
        success: '#27AE60',
        successBg: '#E8F5E9',
        warning: '#E67E22',
        warningBg: '#FFF4E5',
        error: '#E74C3C',
        errorBg: '#FFEBEE',
        info: '#3498DB',
        infoBg: '#E3F2FD',

        // Action Colors
        disabled: '#BDC3C7',
        overlay: 'rgba(0, 0, 0, 0.5)',

        // Special
        rating: '#F1C40F',
        favorite: '#E74C3C',
        veg: '#27AE60',
        nonVeg: '#E74C3C',
    },

    // Dark Mode
    dark: {
        // Brand Colors
        primary: '#2ECC71',
        primaryDark: '#1E8449',
        primaryDeep: '#0D2818',
        secondary: '#E67E22', // Added secondary color (Orange)

        // Backgrounds
        background: '#0D2818',
        surface: '#1A4D3E',
        surfaceElevated: '#245A4A',

        // Text
        text: '#ECFDF5',
        textSecondary: '#A5B8AB',
        textMuted: '#6B8276',

        // Borders
        border: '#4A6B5D',
        borderLight: '#2D4A3E',

        // Status Colors - Same intensity, adjusted for dark
        success: '#27AE60',
        successBg: '#1A4D3E',
        warning: '#E67E22',
        warningBg: '#4A3520',
        error: '#E74C3C',
        errorBg: '#4A2020',
        info: '#3498DB',
        infoBg: '#1A3A4D',

        // Action Colors
        disabled: '#4A5568',
        overlay: 'rgba(0, 0, 0, 0.7)',

        // Special
        rating: '#F1C40F',
        favorite: '#E74C3C',
        veg: '#27AE60',
        nonVeg: '#E74C3C',
    },
};

export type ThemeColors = typeof COLORS.light;
export type ColorScheme = 'light' | 'dark';
