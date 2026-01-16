/**
 * GRIHGO Customer App - Spacing System
 * Based on 8px grid
 */

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    giant: 48,
};

export const RADIUS = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
};

// Touch target sizes (accessibility)
export const TOUCH_TARGETS = {
    minimum: 44,
    recommended: 48,
    large: 56,
};

// Icon sizes
export const ICON_SIZES = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
};

// Avatar sizes
export const AVATAR_SIZES = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
    xxl: 96,
};

export type SpacingKey = keyof typeof SPACING;
export type RadiusKey = keyof typeof RADIUS;
