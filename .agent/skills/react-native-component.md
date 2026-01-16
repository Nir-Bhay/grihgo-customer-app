---
name: React Native Component Development
description: Expert skill for creating production-ready React Native components with TypeScript, theming, accessibility, and animations
---

# React Native Component Development Skill

> **Purpose:** Use this skill when creating new React Native components for the GRIHGO app. Follow these patterns for consistent, high-quality, accessible components.

---

## 🎯 When to Use This Skill

- Creating new UI components (buttons, cards, inputs, modals, etc.)
- Building screen-specific sections
- Implementing reusable component libraries
- Converting designs to code

---

## 📋 Pre-Development Checklist

Before creating any component, verify:

1. [ ] Does a similar component already exist in `src/components/`?
2. [ ] Is the design finalized (check `design-docs/` or `ui-mockups/`)?
3. [ ] What states are needed? (loading, error, empty, disabled, etc.)
4. [ ] Does it need dark mode support?
5. [ ] What accessibility requirements apply?

---

## 🏗️ Component Structure Template

```typescript
// src/components/[category]/ComponentName.tsx

import React, { memo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  ViewStyle,
  TextStyle,
  AccessibilityProps 
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue 
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';

// ========================================
// TYPES
// ========================================

interface ComponentNameProps extends AccessibilityProps {
  /** Main content or title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Component state variant */
  variant?: 'default' | 'outlined' | 'filled';
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Additional container styles */
  style?: ViewStyle;
  /** Test ID for automated testing */
  testID?: string;
}

// ========================================
// CONSTANTS
// ========================================

const SIZES = {
  small: { padding: SPACING.sm, fontSize: 14 },
  medium: { padding: SPACING.md, fontSize: 16 },
  large: { padding: SPACING.lg, fontSize: 18 },
} as const;

// ========================================
// COMPONENT
// ========================================

function ComponentNameBase({
  title,
  subtitle,
  variant = 'default',
  size = 'medium',
  isLoading = false,
  disabled = false,
  onPress,
  style,
  testID,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  ...rest
}: ComponentNameProps) {
  const { colors } = useTheme();
  
  // Animation values
  const scale = useSharedValue(1);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Handlers
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97);
  }, []);
  
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);
  
  // Dynamic styles based on props
  const containerStyles = [
    styles.container,
    { 
      padding: SIZES[size].padding,
      backgroundColor: variant === 'filled' ? colors.primary : colors.card,
      borderColor: variant === 'outlined' ? colors.border : 'transparent',
      borderWidth: variant === 'outlined' ? 1 : 0,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];
  
  const titleStyles = [
    styles.title,
    { 
      color: variant === 'filled' ? '#FFFFFF' : colors.text,
      fontSize: SIZES[size].fontSize,
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <View style={containerStyles} testID={`${testID}-loading`}>
        {/* Add Skeleton or ActivityIndicator here */}
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled, busy: isLoading }}
      {...rest}
    >
      <Animated.View style={[containerStyles, animatedStyle]}>
        <Text style={titleStyles} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text 
            style={[styles.subtitle, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
});

// ========================================
// EXPORT (Memoized for performance)
// ========================================

export const ComponentName = memo(ComponentNameBase);
export type { ComponentNameProps };
```

---

## 🎨 Theming Guidelines

### Always use theme colors from context:

```typescript
const { colors, theme } = useTheme();

// ✅ CORRECT
backgroundColor: colors.background
color: colors.text

// ❌ WRONG
backgroundColor: '#FFFFFF'
color: '#000000'
```

### Available theme colors:
- `colors.primary` - GRIHGO Green (#2ECC71)
- `colors.background` - Screen background
- `colors.surface` - Elevated surfaces
- `colors.card` - Card backgrounds
- `colors.text` - Primary text
- `colors.textSecondary` - Secondary text
- `colors.border` - Borders and dividers
- `colors.success`, `colors.warning`, `colors.error` - Status colors

---

## ♿ Accessibility Requirements

### Mandatory for all interactive components:

```typescript
<Pressable
  accessible={true}
  accessibilityLabel="Clear, descriptive label"
  accessibilityHint="What happens when activated"
  accessibilityRole="button" // button, link, image, header, etc.
  accessibilityState={{ 
    disabled: isDisabled,
    selected: isSelected,
    busy: isLoading,
  }}
>
```

### Common accessibility roles:
- `button` - Interactive buttons
- `link` - Navigation links
- `image` - Images (with alt text label)
- `header` - Section headers
- `text` - Static text
- `checkbox` - Toggle/checkbox items
- `switch` - Toggle switches

### Touch target minimum: 44x44 points

```typescript
// Use hitSlop for small visual elements
<Pressable hitSlop={12}>
```

---

## 🎬 Animation Patterns

### Use Reanimated for performant animations:

```typescript
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Shared value
const opacity = useSharedValue(0);

// Animated style
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

// Trigger animation
useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
}, []);

// Apply to component
<Animated.View style={animatedStyle}>
```

### Common animation configs:

```typescript
// Bouncy spring
withSpring(value, { damping: 15, stiffness: 150 })

// Smooth timing
withTiming(value, { duration: 250 })

// Scale on press
const scale = useSharedValue(1);
onPressIn: () => scale.value = withSpring(0.95)
onPressOut: () => scale.value = withSpring(1)
```

---

## 📝 File Organization

```
src/components/
├── ui/           # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── cards/        # Card components
│   ├── RestaurantCard.tsx
│   └── FoodItemCard.tsx
├── sections/     # Screen sections
│   ├── HomeBanner.tsx
│   └── CuisinesScroll.tsx
└── modals/       # Modal components
    └── ConfirmModal.tsx
```

---

## ✅ Quality Checklist

Before submitting any component:

- [ ] TypeScript: No `any` types, proper interfaces
- [ ] Theming: Uses `useTheme()` for all colors
- [ ] Accessibility: All interactive elements have labels
- [ ] States: Handles loading, error, empty, disabled
- [ ] Animation: Uses Reanimated (not Animated API)
- [ ] Memoization: Uses `memo()` for prevent re-renders
- [ ] Testing: Has `testID` props for automation
- [ ] Documentation: Props are documented with JSDoc

---

## 🚀 Quick Commands

```bash
# Create new component file
touch src/components/ui/NewComponent.tsx

# Run app to test
npx expo start

# Type check
npx tsc --noEmit
```
