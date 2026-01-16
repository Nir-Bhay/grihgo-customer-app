/**
 * GRIHGO Customer App - Typography System
 * Font: Inter (System default fallback)
 */

import { TextStyle } from 'react-native';

export const TYPOGRAPHY = {
    // Headings
    h1: {
        fontSize: 32,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 31,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 28,
        letterSpacing: -0.2,
    },
    h4: {
        fontSize: 18,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 27,
    },

    // Body Text
    body: {
        fontSize: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 24,
    },
    bodyMedium: {
        fontSize: 16,
        fontWeight: '500' as TextStyle['fontWeight'],
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 22,
    },
    bodySmallMedium: {
        fontSize: 14,
        fontWeight: '500' as TextStyle['fontWeight'],
        lineHeight: 22,
    },

    // Caption & Labels
    caption: {
        fontSize: 12,
        fontWeight: '500' as TextStyle['fontWeight'],
        lineHeight: 18,
    },
    captionSmall: {
        fontSize: 10,
        fontWeight: '500' as TextStyle['fontWeight'],
        lineHeight: 14,
    },

    // Buttons
    button: {
        fontSize: 16,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 24,
    },
    buttonSmall: {
        fontSize: 14,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 20,
    },

    // Price (Bold, prominent)
    price: {
        fontSize: 18,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 24,
    },
    priceLarge: {
        fontSize: 24,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 32,
    },
    priceSmall: {
        fontSize: 14,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 20,
    },
};

export type TypographyKey = keyof typeof TYPOGRAPHY;
