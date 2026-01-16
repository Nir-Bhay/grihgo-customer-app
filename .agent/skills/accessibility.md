---
name: Accessibility Implementation
description: Expert skill for implementing WCAG-compliant accessibility in React Native apps with screen reader support
---

# Accessibility Implementation Skill

> **Purpose:** Use this skill when implementing or auditing accessibility features to ensure the GRIHGO app is usable by everyone, including users with disabilities.

---

## 🎯 When to Use This Skill

- Adding accessibility to new components
- Auditing existing screens for accessibility
- Implementing screen reader support
- Fixing accessibility issues
- Meeting WCAG 2.1/2.2 compliance

---

## ♿ Core Accessibility Props

### Essential Props for Interactive Elements

```typescript
<Pressable
  accessible={true}                    // Enable accessibility focus
  accessibilityLabel="Add to cart"     // Screen reader announces this
  accessibilityHint="Adds item to your shopping cart"  // Additional context
  accessibilityRole="button"           // Semantic role
  accessibilityState={{
    disabled: isDisabled,              // Is element disabled?
    selected: isSelected,              // Is element selected?
    busy: isLoading,                   // Is element loading?
    checked: isChecked,                // For checkboxes/switches
    expanded: isExpanded,              // For collapsible elements
  }}
  onPress={handlePress}
>
  <Text>Add</Text>
</Pressable>
```

### Accessibility Roles Reference

| Role | Use For |
|------|---------|
| `button` | Buttons, pressable elements |
| `link` | Navigation links |
| `image` | Images (requires label as alt text) |
| `imagebutton` | Clickable images |
| `header` | Section headings |
| `text` | Static display text |
| `search` | Search input fields |
| `checkbox` | Checkbox inputs |
| `switch` | Toggle switches |
| `adjustable` | Sliders, pickers |
| `alert` | Alert messages |
| `menu` | Dropdown menus |
| `menuitem` | Items in a menu |
| `progressbar` | Progress indicators |
| `tab` | Tab buttons |
| `tablist` | Tab container |

---

## 🔊 Screen Reader Labels

### Good vs Bad Labels

```typescript
// ❌ BAD: Vague, unhelpful
accessibilityLabel="Button"
accessibilityLabel="Tap here"
accessibilityLabel="Image"

// ✅ GOOD: Clear, contextual
accessibilityLabel="Add Paneer Tikka to cart"
accessibilityLabel="Navigate to restaurant details"
accessibilityLabel="Restaurant logo for Pizza Palace"

// ✅ BEST: Include state/value when relevant
accessibilityLabel={`${item.name}, ${item.price} rupees, ${quantity} in cart`}
```

### Dynamic Labels

```typescript
// For items with changing states
const getAccessibilityLabel = () => {
  const baseLabel = `${restaurant.name}, ${restaurant.rating} stars`;
  const distance = `${restaurant.distance} away`;
  const status = restaurant.isOpen ? 'Open now' : 'Closed';
  return `${baseLabel}, ${distance}, ${status}`;
};

<Pressable
  accessibilityLabel={getAccessibilityLabel()}
  accessibilityHint="Opens restaurant menu"
>
```

### Hints for Complex Actions

```typescript
// Provide additional context when action isn't obvious
<Pressable
  accessibilityLabel="Reorder"
  accessibilityHint="Places the same order from your last visit"
>

<Pressable
  accessibilityLabel="Share restaurant"
  accessibilityHint="Opens sharing options to send restaurant link"
>
```

---

## 📐 Touch Target Guidelines

### Minimum Size: 44x44 points

```typescript
// ❌ BAD: Small icon, hard to tap
<Pressable style={{ width: 24, height: 24 }}>
  <Icon size={24} />
</Pressable>

// ✅ GOOD: Using hitSlop for invisible padding
<Pressable 
  style={{ width: 24, height: 24 }}
  hitSlop={12}  // Adds 12pt padding to all sides
>
  <Icon size={24} />
</Pressable>

// ✅ BETTER: Visible padding for better UX
<Pressable 
  style={{ 
    width: 48, 
    height: 48, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}
>
  <Icon size={24} />
</Pressable>
```

### Spacing Between Targets

```typescript
// Ensure adequate spacing between interactive elements
// Minimum: 8pt between touch targets

<View style={{ flexDirection: 'row', gap: SPACING.md }}>
  <Button title="Cancel" />
  <Button title="Confirm" />
</View>
```

---

## 🎨 Color & Contrast

### WCAG Contrast Requirements

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

### Testing Contrast

```typescript
// Use GRIHGO theme colors - they're pre-tested
const { colors } = useTheme();

// Primary on background - verified 4.5:1
<Text style={{ color: colors.text }}>Readable text</Text>

// Check secondary text meets 4.5:1
<Text style={{ color: colors.textSecondary }}>Secondary info</Text>
```

### Never Rely on Color Alone

```typescript
// ❌ BAD: Only color indicates status
<View style={{ backgroundColor: isError ? 'red' : 'green' }} />

// ✅ GOOD: Color + icon + text
<View style={[styles.status, { backgroundColor: isError ? colors.error : colors.success }]}>
  {isError ? <XCircle color="#FFF" /> : <CheckCircle color="#FFF" />}
  <Text style={styles.statusText}>
    {isError ? 'Error' : 'Success'}
  </Text>
</View>
```

---

## 📝 Text Accessibility

### Respect User Font Size

```typescript
// ❌ BAD: Fixed font size ignores user preferences
<Text style={{ fontSize: 14 }}>Fixed size text</Text>

// ✅ GOOD: Use Text component (respects system settings by default)
<Text style={TYPOGRAPHY.body}>Respects user preferences</Text>

// If you must limit scaling:
<Text 
  style={styles.text}
  maxFontSizeMultiplier={1.5}  // Limit to 150% of base size
>
  Limited scaling
</Text>
```

### Text Hierarchy

```typescript
// Use proper heading hierarchy
<Text accessibilityRole="header" style={styles.h1}>
  Restaurant Name
</Text>

<Text accessibilityRole="header" style={styles.h2}>
  Menu Section
</Text>

<Text style={styles.body}>
  Regular content
</Text>
```

---

## 🔄 Focus Management

### Grouping Related Elements

```typescript
// Group card content as single focusable element
<Pressable
  accessible={true}
  accessibilityLabel={`${restaurant.name}, ${restaurant.cuisine}, ${restaurant.rating} stars, ${restaurant.deliveryTime} delivery`}
  onPress={handlePress}
>
  <Image source={restaurant.image} accessible={false} />
  <Text>{restaurant.name}</Text>
  <Text>{restaurant.cuisine}</Text>
</Pressable>
```

### Hiding Decorative Elements

```typescript
// Hide decorative elements from screen readers
<Image 
  source={decorativeBackground}
  accessible={false}
  importantForAccessibility="no"  // Android
  accessibilityElementsHidden={true}  // iOS
/>

// Hide container from accessibility tree (includes children)
<View importantForAccessibility="no-hide-descendants">
  <DecorativeContent />
</View>
```

### Live Regions (Dynamic Updates)

```typescript
import { AccessibilityInfo, Platform } from 'react-native';

// Announce dynamic changes to screen readers
const announceChange = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

// Usage
const handleAddToCart = (item: Item) => {
  addItem(item);
  announceChange(`${item.name} added to cart`);
};
```

---

## 🧪 Testing Accessibility

### Manual Testing Checklist

```markdown
### Screen Reader Testing
□ Enable TalkBack (Android) or VoiceOver (iOS)
□ Navigate entire screen using swipe gestures
□ Verify all interactive elements are reachable
□ Verify labels make sense without visual context
□ Check focus order is logical (top-to-bottom, left-to-right)
□ Confirm all actions are completable

### Visual Testing
□ Test with largest system font size
□ Test with display zoom enabled
□ Test with color filters (grayscale, color blind modes)
□ Verify UI doesn't break or overlap
□ Check contrast with accessibility scanner

### Motor Testing
□ All touch targets are at least 44x44 points
□ No time-limited actions or add alternatives
□ No gesture-only controls without alternatives
□ Test with Switch Control (iOS) / Switch Access (Android)
```

### Enable Screen Readers

**iOS (VoiceOver):**
- Settings > Accessibility > VoiceOver > On
- Or ask Siri: "Turn on VoiceOver"

**Android (TalkBack):**
- Settings > Accessibility > TalkBack > On
- Or hold both volume buttons for 3 seconds

### Screen Reader Gestures

| Gesture | iOS | Android |
|---------|-----|---------|
| Move to next | Swipe right | Swipe right |
| Move to previous | Swipe left | Swipe left |
| Activate | Double tap | Double tap |
| Scroll | 3-finger swipe | 2-finger swipe |
| Go home | 4-finger tap bottom | Swipe up then left |

---

## 🚨 Common Accessibility Issues

### 1. Missing Labels

```typescript
// ❌ NO LABEL - Screen reader says "Button"
<Pressable onPress={handleDelete}>
  <TrashIcon />
</Pressable>

// ✅ WITH LABEL - Screen reader says "Delete item"
<Pressable 
  onPress={handleDelete}
  accessibilityLabel="Delete item"
  accessibilityRole="button"
>
  <TrashIcon />
</Pressable>
```

### 2. Image Without Alt Text

```typescript
// ❌ NO ALT TEXT
<Image source={restaurantImage} />

// ✅ CONTENT IMAGE - Needs description
<Image 
  source={restaurantImage}
  accessibilityLabel="Pizza Palace storefront"
  accessible={true}
/>

// ✅ DECORATIVE IMAGE - Hide from screen readers
<Image 
  source={decorativeImage}
  accessible={false}
/>
```

### 3. Unlabeled Form Inputs

```typescript
// ❌ NO LABEL
<TextInput placeholder="Enter phone" />

// ✅ LABELED INPUT
<View>
  <Text nativeID="phoneLabel">Phone Number</Text>
  <TextInput 
    placeholder="Enter phone"
    accessibilityLabel="Phone Number"
    accessibilityLabelledBy="phoneLabel"
  />
</View>
```

### 4. State Not Announced

```typescript
// ❌ STATE CHANGE NOT ANNOUNCED
<Switch value={isEnabled} onValueChange={setIsEnabled} />

// ✅ STATE PROPERLY ANNOUNCED
<Switch 
  value={isEnabled} 
  onValueChange={setIsEnabled}
  accessibilityLabel="Enable notifications"
  accessibilityRole="switch"
  accessibilityState={{ checked: isEnabled }}
/>
```

---

## ✅ Accessibility Checklist

Use this for every component and screen:

```markdown
### Labels & Roles
- [ ] All interactive elements have accessibilityLabel
- [ ] All interactive elements have accessibilityRole
- [ ] Labels are descriptive and contextual
- [ ] Icons have text alternatives

### States
- [ ] accessibilityState for disabled/selected/busy
- [ ] Dynamic state changes announced
- [ ] Loading states have label

### Touch Targets
- [ ] Minimum 44x44 points (or hitSlop)
- [ ] Adequate spacing between targets

### Visual
- [ ] Color contrast meets 4.5:1
- [ ] Information not conveyed by color alone
- [ ] Text scales with system settings
- [ ] UI works at 200% zoom

### Focus & Navigation
- [ ] Logical focus order
- [ ] Related elements grouped
- [ ] Decorative elements hidden
- [ ] Modal traps focus appropriately

### Testing
- [ ] Tested with VoiceOver (iOS)
- [ ] Tested with TalkBack (Android)
- [ ] Tested with large text
- [ ] Tested with color filters
```

---

## 📱 GRIHGO-Specific Patterns

### Restaurant Card

```typescript
<Pressable
  accessible={true}
  accessibilityLabel={`
    ${restaurant.name}, 
    ${restaurant.cuisine} restaurant, 
    ${restaurant.rating} star rating, 
    ${restaurant.deliveryTime} delivery time, 
    ${restaurant.distance} away
    ${restaurant.isPromoted ? ', Promoted' : ''}
  `.trim()}
  accessibilityHint="Opens restaurant menu"
  accessibilityRole="button"
>
  {/* Card content */}
</Pressable>
```

### Cart Item

```typescript
<View
  accessible={true}
  accessibilityLabel={`
    ${item.name}, 
    ${item.quantity} items, 
    ${formatPrice(item.price * item.quantity)}
  `}
>
  {/* Item content */}
  
  <Pressable
    accessibilityLabel={`Remove ${item.name} from cart`}
    accessibilityRole="button"
    onPress={() => removeItem(item.id)}
  >
    <MinusIcon />
  </Pressable>
  
  <Pressable
    accessibilityLabel={`Add another ${item.name}`}
    accessibilityRole="button"
    onPress={() => addItem(item)}
  >
    <PlusIcon />
  </Pressable>
</View>
```
