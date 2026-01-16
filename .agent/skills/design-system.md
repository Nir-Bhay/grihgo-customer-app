---
name: Design System Implementation
description: Expert skill for implementing and maintaining the GRIHGO design system with colors, typography, spacing, and theme variants
---

# Design System Implementation Skill

> **Purpose:** Use this skill when working with the GRIHGO design system, creating new design tokens, or ensuring consistent styling across the app.

---

## 🎯 When to Use This Skill

- Creating new design tokens
- Implementing dark/light mode
- Maintaining style consistency
- Building themed components
- Updating the design system

---

## 🎨 GRIHGO Brand Identity

### Primary Colors

```
GRIHGO Green: #2ECC71
├── Primary:      #2ECC71  (Main brand color)
├── Primary Dark: #27AE60  (Pressed states)
└── Primary Light:#58D68D  (Hover, highlights)
```

### Brand Guidelines

- **Green** represents freshness, health, and eco-friendliness
- Use consistently across all apps in the ecosystem
- Minimum contrast ratio: 4.5:1 for text on primary

---

## 📦 Design Tokens Structure

### constants/index.ts

```typescript
// src/constants/index.ts

// ========================================
// COLORS
// ========================================

export const COLORS = {
  // Brand Colors
  primary: '#2ECC71',
  primaryDark: '#27AE60',
  primaryLight: '#58D68D',
  
  // Semantic Colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Neutrals - Light Mode
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  
  // Neutrals - Dark Mode
  dark50: '#2D2D2D',
  dark100: '#252525',
  dark200: '#1E1E1E',
  dark300: '#181818',
  dark400: '#121212',
  
  // Transparent overlays
  overlay10: 'rgba(0, 0, 0, 0.1)',
  overlay20: 'rgba(0, 0, 0, 0.2)',
  overlay50: 'rgba(0, 0, 0, 0.5)',
  overlayLight10: 'rgba(255, 255, 255, 0.1)',
  overlayLight20: 'rgba(255, 255, 255, 0.2)',
} as const;

// ========================================
// THEME COLOR SCHEMES
// ========================================

export const LIGHT_THEME = {
  primary: COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryLight: COLORS.primaryLight,
  
  background: COLORS.white,
  surface: COLORS.gray50,
  card: COLORS.white,
  
  text: COLORS.gray900,
  textSecondary: COLORS.gray600,
  textTertiary: COLORS.gray500,
  textInverse: COLORS.white,
  
  border: COLORS.gray200,
  divider: COLORS.gray100,
  
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  info: COLORS.info,
  
  // Component specific
  inputBackground: COLORS.gray50,
  inputBorder: COLORS.gray300,
  inputPlaceholder: COLORS.gray500,
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: COLORS.overlay50,
} as const;

export const DARK_THEME = {
  primary: COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryLight: COLORS.primaryLight,
  
  background: COLORS.dark400,
  surface: COLORS.dark200,
  card: COLORS.dark50,
  
  text: COLORS.white,
  textSecondary: COLORS.gray400,
  textTertiary: COLORS.gray500,
  textInverse: COLORS.gray900,
  
  border: COLORS.dark100,
  divider: COLORS.dark200,
  
  success: '#34D399',  // Lighter for dark mode
  warning: '#FBBF24',
  error: '#F87171',
  info: '#38BDF8',
  
  // Component specific
  inputBackground: COLORS.dark200,
  inputBorder: COLORS.dark100,
  inputPlaceholder: COLORS.gray500,
  
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

export const FONT_FAMILY = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: FONT_SIZE['4xl'],
    fontFamily: FONT_FAMILY.bold,
    lineHeight: FONT_SIZE['4xl'] * LINE_HEIGHT.tight,
  },
  h2: {
    fontSize: FONT_SIZE['3xl'],
    fontFamily: FONT_FAMILY.bold,
    lineHeight: FONT_SIZE['3xl'] * LINE_HEIGHT.tight,
  },
  h3: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: FONT_FAMILY.semibold,
    lineHeight: FONT_SIZE['2xl'] * LINE_HEIGHT.tight,
  },
  h4: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.semibold,
    lineHeight: FONT_SIZE.xl * LINE_HEIGHT.tight,
  },
  
  // Body
  body: {
    fontSize: FONT_SIZE.base,
    fontFamily: FONT_FAMILY.regular,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.normal,
  },
  bodyMedium: {
    fontSize: FONT_SIZE.base,
    fontFamily: FONT_FAMILY.medium,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.normal,
  },
  bodySmall: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    lineHeight: FONT_SIZE.md * LINE_HEIGHT.normal,
  },
  
  // Others
  caption: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.normal,
  },
  overline: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    lineHeight: FONT_SIZE.xs * LINE_HEIGHT.normal,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  button: {
    fontSize: FONT_SIZE.base,
    fontFamily: FONT_FAMILY.semibold,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.tight,
  },
  link: {
    fontSize: FONT_SIZE.base,
    fontFamily: FONT_FAMILY.medium,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.normal,
    textDecorationLine: 'underline' as const,
  },
} as const;

// ========================================
// SPACING (8px base grid)
// ========================================

export const SPACING = {
  xs: 4,    // 0.5x
  sm: 8,    // 1x
  md: 12,   // 1.5x
  lg: 16,   // 2x
  xl: 20,   // 2.5x
  xxl: 24,  // 3x
  huge: 32, // 4x
  massive: 48, // 6x
} as const;

// ========================================
// BORDER RADIUS
// ========================================

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

// ========================================
// SHADOWS
// ========================================

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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ========================================
// ANIMATION
// ========================================

export const ANIMATION = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ========================================
// LAYOUT
// ========================================

export const LAYOUT = {
  screenPadding: SPACING.lg,
  cardPadding: SPACING.lg,
  sectionGap: SPACING.xxl,
  itemGap: SPACING.md,
  
  headerHeight: 56,
  tabBarHeight: 64,
  bottomSheetHandleHeight: 24,
} as const;
```

---

## 🌓 Theme Context

### ThemeContext.tsx

```typescript
// src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_THEME, DARK_THEME } from '@/constants';

// ========================================
// TYPES
// ========================================

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  colors: typeof LIGHT_THEME;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// ========================================
// CONTEXT
// ========================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((saved) => {
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemeModeState(saved as ThemeMode);
      }
      setIsLoaded(true);
    });
  }, []);

  // Determine actual theme
  const theme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme ?? 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  // Get colors based on theme
  const colors = useMemo(() => {
    return theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  }, [theme]);

  // Set theme mode and persist
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem('themeMode', mode);
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    const newMode = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const value = useMemo(() => ({
    theme,
    themeMode,
    colors,
    isDark: theme === 'dark',
    setThemeMode,
    toggleTheme,
  }), [theme, themeMode, colors]);

  if (!isLoaded) {
    return null; // Or loading screen
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## 🎨 Using the Design System

### In Components

```typescript
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '@/constants';

function MyComponent() {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.card },
      SHADOWS.md,
    ]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Hello World
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  title: {
    ...TYPOGRAPHY.h3,
  },
});
```

### Dynamic Styles Pattern

```typescript
// For complex dynamic styling
const useDynamicStyles = () => {
  const { colors } = useTheme();
  
  return useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
  }), [colors]);
};

function MyComponent() {
  const styles = useDynamicStyles();
  // ...
}
```

---

## 📐 Spacing Guidelines

### 8px Grid System

```
┌─────────────────────────────────────┐
│ Screen Padding: 16px (SPACING.lg)   │
│ ┌─────────────────────────────────┐ │
│ │ Card Padding: 16px              │ │
│ │                                 │ │
│ │ Section Title ─────────────────│ │
│ │         ↕ 12px (SPACING.md)    │ │
│ │ Item 1                          │ │
│ │         ↕ 8px (SPACING.sm)     │ │
│ │ Item 2                          │ │
│ └─────────────────────────────────┘ │
│         ↕ 24px (SPACING.xxl)        │
│ ┌─────────────────────────────────┐ │
│ │ Next Section                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Usage

```typescript
// Screen-level
<View style={{ padding: SPACING.lg }}>

// Between sections
<View style={{ marginBottom: SPACING.xxl }}>

// Between items in a list
<View style={{ gap: SPACING.sm }}>

// Card internal padding
<View style={{ padding: SPACING.lg }}>

// Inline spacing (icons, text)
<View style={{ gap: SPACING.xs }}>
```

---

## ✍️ Typography Guidelines

### Hierarchy

```
H1 (32px Bold)      → Main screen titles
H2 (28px Bold)      → Section headers
H3 (24px SemiBold)  → Card titles
H4 (20px SemiBold)  → Subsection titles
Body (16px Regular) → Main content
Caption (12px)      → Metadata, timestamps
Overline (10px)     → Labels, categories
```

### Usage

```typescript
// Page title
<Text style={[TYPOGRAPHY.h1, { color: colors.text }]}>
  Home
</Text>

// Section header
<Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>
  Popular Restaurants
</Text>

// Body text
<Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>
  Description text here
</Text>

// Caption/metadata
<Text style={[TYPOGRAPHY.caption, { color: colors.textTertiary }]}>
  20 min ago
</Text>
```

---

## 🌓 Dark Mode Checklist

When implementing dark mode support:

```markdown
### Colors
- [ ] Text colors adapt (text, textSecondary, textTertiary)
- [ ] Background colors adapt (background, surface, card)
- [ ] Border colors adapt
- [ ] No hardcoded colors (#FFFFFF, #000000)

### Images
- [ ] Text on images readable in both modes
- [ ] Consider image overlays for contrast
- [ ] Icons adapt or use theme colors

### Shadows
- [ ] Shadows visible in light mode
- [ ] Consider elevation instead of drop shadows in dark mode

### Status Bar
- [ ] Light content in dark mode
- [ ] Dark content in light mode

### Testing
- [ ] Toggle between modes rapidly
- [ ] Test system theme changes
- [ ] Verify all screens
```

---

## ✅ Design System Checklist

```markdown
### Tokens
- [ ] All colors defined in constants
- [ ] Typography scale complete
- [ ] Spacing grid applied
- [ ] Border radius standardized
- [ ] Shadows defined

### Theme
- [ ] Light theme colors complete
- [ ] Dark theme colors complete
- [ ] Theme context working
- [ ] Persistence working

### Components
- [ ] Using useTheme() for colors
- [ ] Using SPACING for spacing
- [ ] Using TYPOGRAPHY for text
- [ ] Using RADIUS for corners
- [ ] Consistent patterns

### Quality
- [ ] No hardcoded colors
- [ ] No hardcoded spacing
- [ ] Dark mode works
- [ ] Accessibility contrast
```
