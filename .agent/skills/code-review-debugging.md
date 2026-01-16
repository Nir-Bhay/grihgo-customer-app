---
name: Code Review & Debugging
description: Expert skill for reviewing React Native/Expo code, identifying issues, and debugging with systematic approaches
---

# Code Review & Debugging Skill

> **Purpose:** Use this skill when reviewing code, debugging issues, or performing quality audits on the GRIHGO app codebase.

---

## 🎯 When to Use This Skill

- Reviewing pull requests or code changes
- Debugging runtime errors or crashes
- Investigating performance issues
- Auditing code quality and best practices
- Finding and fixing TypeScript errors

---

## 🔍 Code Review Checklist

### 1. TypeScript & Type Safety

```
□ No `any` types (use proper interfaces)
□ Props interfaces are complete and documented
□ Return types are explicit for complex functions
□ Null/undefined handled with optional chaining
□ Type guards used for narrowing
```

**Review Template:**
```typescript
// ❌ BAD
const handleData = (data: any) => { ... }

// ✅ GOOD
interface UserData {
  id: string;
  name: string;
  email?: string;
}
const handleData = (data: UserData): void => { ... }
```

### 2. React Patterns

```
□ Components are memoized when appropriate
□ useCallback for event handlers passed as props
□ useMemo for expensive computations
□ No inline function definitions in JSX
□ Keys are stable and unique (not array index)
□ Effects have proper dependency arrays
```

**Common Issues:**
```typescript
// ❌ BAD: Creates new function on every render
<Button onPress={() => handlePress(item.id)} />

// ✅ GOOD: Memoized handler
const handleItemPress = useCallback((id: string) => {
  // ...
}, []);

<Button onPress={() => handleItemPress(item.id)} />

// ✅ BETTER: Use item component
<ItemButton item={item} onPress={handleItemPress} />
```

### 3. State Management

```
□ State is minimal (derived values computed)
□ No duplicate state
□ Context used appropriately (not for everything)
□ State updates are batched when possible
□ Async state has loading/error handling
```

### 4. Performance

```
□ FlatList used for long lists (not ScrollView + map)
□ Images optimized and properly sized
□ Heavy computations moved outside render
□ Animations use Reanimated (not Animated)
□ No unnecessary re-renders
```

### 5. Accessibility

```
□ All touchables have accessibilityLabel
□ accessibilityRole defined for interactive elements
□ accessibilityState for disabled/selected/busy
□ Touch targets are minimum 44x44 points
□ Color contrast meets WCAG standards
```

### 6. Security

```
□ No hardcoded secrets or API keys
□ User input is validated and sanitized
□ Sensitive data not logged to console
□ Secure storage used for tokens
□ Network requests use HTTPS
```

### 7. Code Style

```
□ Consistent naming (camelCase, PascalCase)
□ Files organized in correct directories
□ Imports are organized and clean
□ No unused variables or imports
□ Comments explain "why" not "what"
```

---

## 🐛 Debugging Workflow

### Step 1: Reproduce the Issue

```markdown
1. What is the exact error message?
2. What are the steps to reproduce?
3. Does it happen on iOS, Android, or both?
4. Is it intermittent or consistent?
5. When did it start happening?
```

### Step 2: Gather Information

```typescript
// Add strategic console logs
console.log('=== DEBUG START ===');
console.log('Props:', JSON.stringify(props, null, 2));
console.log('State:', { isLoading, items: items.length });
console.log('=== DEBUG END ===');

// Use React DevTools profiler for re-renders
// Use Flipper for network and database inspection
```

### Step 3: Common Error Patterns

#### TypeError: Cannot read property 'X' of undefined

```typescript
// Cause: Accessing nested property on null/undefined

// ❌ Crashes when restaurant is undefined
restaurant.address.street

// ✅ Safe access
restaurant?.address?.street ?? 'Address not available'
```

#### React Hook Errors

```typescript
// Cause: Conditional hook calls

// ❌ Hooks called conditionally
if (isLoggedIn) {
  const [user] = useUser(); // ERROR!
}

// ✅ Hook at top level
const [user] = useUser();
const displayUser = isLoggedIn ? user : null;
```

#### Navigation Errors

```typescript
// Cause: Navigating to non-existent route

// Debug navigation
import { useNavigation, useRoute } from '@react-navigation/native';

const navigation = useNavigation();
const route = useRoute();

console.log('Current route:', route.name);
console.log('Route params:', route.params);
```

#### Expo/React Native Bridge Errors

```typescript
// Cause: Native module not linked or incompatible

// Check Expo compatibility
npx expo install --check

// Clear caches
npx expo start -c
rm -rf node_modules && npm install
```

### Step 4: Stack Trace Analysis

```markdown
1. Find the FIRST error in the stack trace
2. Look for YOUR code files (not node_modules)
3. Note the line number and file
4. Check what function/component is involved
5. Trace data flow backwards from error point
```

---

## 🔧 Debugging Tools

### Console Debugging

```typescript
// Structured logging
const debug = (label: string, data: unknown) => {
  console.log(`[DEBUG:${label}]`, JSON.stringify(data, null, 2));
};

debug('user', user);
debug('cart-items', cartItems);
```

### React DevTools

```bash
# Install React DevTools
npm install -g react-devtools

# Run DevTools
react-devtools

# Then start Expo
npx expo start
```

### Flipper (Advanced)

- Network inspector: API calls, responses, timing
- Layout inspector: View hierarchy, styles
- React DevTools integration
- Database viewer (AsyncStorage)

### Performance Profiling

```typescript
// Measure render time
import { Profiler } from 'react';

<Profiler id="Home" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}}>
  <HomeScreen />
</Profiler>
```

---

## 📊 Code Review Response Format

When reviewing code, use this structure:

```markdown
## Code Review Summary

**Files Reviewed:** [list files]
**Severity:** 🔴 Critical / 🟡 Medium / 🟢 Minor

### 🔴 Critical Issues (Must Fix)

1. **[Issue Title]** - `file.tsx:L42`
   - **Problem:** Description of the issue
   - **Impact:** What could go wrong
   - **Solution:** 
   ```typescript
   // Fixed code here
   ```

### 🟡 Medium Issues (Should Fix)

1. **[Issue Title]** - `file.tsx:L85`
   - **Problem:** Description
   - **Suggestion:** 
   ```typescript
   // Improved code
   ```

### 🟢 Minor Issues (Nice to Have)

1. **[Issue Title]** - `file.tsx:L102`
   - **Suggestion:** Description of improvement

### ✅ What's Good

- [Positive observation 1]
- [Positive observation 2]

### 📋 Recommendations

1. [Future improvement suggestion]
2. [Refactoring opportunity]
```

---

## 🚨 Common GRIHGO-Specific Issues

### 1. Theme Not Applied

```typescript
// ❌ Missing useTheme
const styles = { color: '#000000' };

// ✅ Using theme colors
const { colors } = useTheme();
const styles = { color: colors.text };
```

### 2. Cart Context Issues

```typescript
// ❌ Modifying cart outside context
const items = [...cartItems];
items.push(newItem); // Direct mutation!

// ✅ Using cart context methods
const { addItem } = useCart();
addItem(newItem);
```

### 3. Navigation with Missing Params

```typescript
// ❌ Missing required params
router.push('/restaurant/[id]');

// ✅ Include required params
router.push(`/restaurant/${restaurantId}`);
```

### 4. Mock Data Leakage

```typescript
// ❌ Hardcoded mock data in component
const restaurants = [{ id: '1', name: 'Test' }];

// ✅ Import from mockData (for now)
import { RESTAURANTS } from '@/data/mockData';

// ✅ Future: Use API service
const { data: restaurants } = useRestaurants();
```

---

## 🧪 Debugging Commands

```bash
# Clear all caches
watchman watch-del-all
rm -rf node_modules
rm -rf .expo
npm install
npx expo start -c

# Check for dependency issues
npx expo install --check

# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint

# Run on specific platform
npx expo start --android
npx expo start --ios
```

---

## ✅ Review Approval Criteria

Code is ready for approval when:

- [ ] All critical issues resolved
- [ ] TypeScript compiles without errors
- [ ] Runs without crashes on both platforms
- [ ] Follows GRIHGO coding patterns
- [ ] Dark mode works correctly
- [ ] Accessibility labels present
- [ ] No console.log statements in production code
