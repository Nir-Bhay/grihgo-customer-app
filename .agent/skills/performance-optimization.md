---
name: Performance Optimization
description: Expert skill for optimizing React Native app performance with profiling, memoization, and best practices
---

# Performance Optimization Skill

> **Purpose:** Use this skill when optimizing app performance, fixing slow screens, or preventing performance issues in the GRIHGO app.

---

## 🎯 When to Use This Skill

- App feels sluggish or janky
- Screens take long to load
- Scrolling is not smooth (< 60 FPS)
- Memory usage is high
- Battery drain complaints
- Optimizing before release

---

## 📊 Performance Metrics

### Target Goals

| Metric | Target | Warning |
|--------|--------|---------|
| **FPS** | 60 fps | < 45 fps |
| **JS Thread** | < 16ms | > 32ms |
| **Initial Load** | < 3s | > 5s |
| **Screen Transition** | < 300ms | > 500ms |
| **Memory** | < 200MB | > 300MB |
| **Bundle Size** | < 10MB | > 15MB |

---

## 🔍 Profiling Tools

### React DevTools Profiler

```bash
# Install
npm install -g react-devtools

# Run
react-devtools

# Then connect from Expo
npx expo start
# Shake device > Debug Remote JS
```

### Flipper (Recommended)

- Performance monitoring
- Network inspector
- Layout inspector
- React DevTools integration

### Built-in Performance Monitor

```typescript
// In app, shake device or Cmd+D/Ctrl+D
// Select "Toggle Performance Monitor"

// Metrics shown:
// - RAM usage
// - JS FPS (JavaScript thread)
// - UI FPS (Native UI thread)
```

---

## ⚡ Component Optimization

### 1. Memoization with React.memo

```typescript
// ❌ BAD: Re-renders on every parent render
const RestaurantCard = ({ restaurant }: Props) => {
  return <View>...</View>;
};

// ✅ GOOD: Only re-renders when props change
const RestaurantCard = memo(({ restaurant }: Props) => {
  return <View>...</View>;
});

// ✅ BEST: Custom comparison for complex props
const RestaurantCard = memo(
  ({ restaurant }: Props) => {
    return <View>...</View>;
  },
  (prevProps, nextProps) => {
    return prevProps.restaurant.id === nextProps.restaurant.id &&
           prevProps.restaurant.rating === nextProps.restaurant.rating;
  }
);
```

### 2. useCallback for Event Handlers

```typescript
// ❌ BAD: Creates new function every render
<FlatList
  data={items}
  renderItem={({ item }) => (
    <ItemCard 
      item={item} 
      onPress={() => handlePress(item.id)}  // New function!
    />
  )}
/>

// ✅ GOOD: Stable callback reference
const handleItemPress = useCallback((id: string) => {
  navigation.navigate('Item', { id });
}, [navigation]);

<FlatList
  data={items}
  renderItem={({ item }) => (
    <ItemCard 
      item={item} 
      onPress={handleItemPress}
    />
  )}
/>
```

### 3. useMemo for Expensive Calculations

```typescript
// ❌ BAD: Recalculates on every render
const filteredRestaurants = restaurants
  .filter(r => r.rating >= minRating)
  .sort((a, b) => b.rating - a.rating);

// ✅ GOOD: Only recalculates when dependencies change
const filteredRestaurants = useMemo(() => {
  return restaurants
    .filter(r => r.rating >= minRating)
    .sort((a, b) => b.rating - a.rating);
}, [restaurants, minRating]);
```

---

## 📋 List Optimization

### FlatList Best Practices

```typescript
<FlatList
  data={data}
  keyExtractor={(item) => item.id}  // ✅ Stable, unique key
  renderItem={renderItem}
  
  // Performance props
  removeClippedSubviews={true}       // Remove offscreen items
  maxToRenderPerBatch={10}           // Batch size for initial render
  updateCellsBatchingPeriod={50}     // Time between batch renders
  windowSize={5}                     // Render window (5 = 2 screens each way)
  initialNumToRender={10}            // Initial items to render
  
  // Avoid re-renders
  getItemLayout={(data, index) => ({  // Skip measurement if possible
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  
  // Memory optimization
  maintainVisibleContentPosition={{
    minIndexForVisible: 0,
  }}
/>
```

### Item Separation

```typescript
// ❌ BAD: Creates new style objects
renderItem={({ item }) => (
  <View style={{ marginBottom: 16 }}>
    <ItemCard item={item} />
  </View>
)}

// ✅ GOOD: Use ItemSeparatorComponent
<FlatList
  data={data}
  renderItem={({ item }) => <ItemCard item={item} />}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
/>

const styles = StyleSheet.create({
  separator: { height: 16 },
});
```

### Avoid Anonymous Functions in Lists

```typescript
// ❌ BAD: New function for each item
renderItem={({ item }) => (
  <Pressable onPress={() => onItemPress(item.id)}>
    ...
  </Pressable>
)}

// ✅ GOOD: Extract to component
const ItemCard = memo(({ item, onPress }: Props) => (
  <Pressable onPress={() => onPress(item.id)}>
    ...
  </Pressable>
));

// In parent
const handlePress = useCallback((id: string) => {
  // handle press
}, []);

renderItem={({ item }) => <ItemCard item={item} onPress={handlePress} />}
```

---

## 🖼️ Image Optimization

### Use Proper Image Sizes

```typescript
// ❌ BAD: Full size image for thumbnail
<Image 
  source={{ uri: restaurant.imageUrl }}
  style={{ width: 100, height: 100 }}
/>

// ✅ GOOD: Request appropriate size from CDN
<Image 
  source={{ uri: `${restaurant.imageUrl}?w=200&h=200&fit=crop` }}
  style={{ width: 100, height: 100 }}
/>
```

### Use expo-image for Better Performance

```typescript
import { Image } from 'expo-image';

<Image
  source={imageUrl}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  placeholder={blurhash}  // Blurhash placeholder
  transition={200}        // Smooth fade-in
  cachePolicy="memory-disk"
/>
```

### Lazy Loading Images

```typescript
// In FlatList, images load as they come into view
<FlatList
  data={restaurants}
  renderItem={({ item }) => (
    <View>
      <Image 
        source={{ uri: item.imageUrl }}
        style={styles.image}
        // Only loads when visible
      />
    </View>
  )}
  // windowSize controls pre-loading
  windowSize={3}  // Smaller = less pre-loading
/>
```

---

## 🎬 Animation Optimization

### Use Reanimated (Not Animated API)

```typescript
// ❌ BAD: JavaScript-driven animations
import { Animated } from 'react-native';

// ✅ GOOD: UI thread animations
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.95);
};
```

### Avoid Layout Animations During Scroll

```typescript
// ❌ BAD: Animating layout during scroll
<Animated.View style={{ height: animatedHeight }}>

// ✅ GOOD: Use transform instead
<Animated.View style={{ transform: [{ translateY: offset }] }}>
```

---

## 🧹 Memory Management

### Clean Up Effects

```typescript
useEffect(() => {
  const subscription = someService.subscribe(handleUpdate);
  
  // ✅ CLEANUP: Prevent memory leaks
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Avoid Memory Leaks in Async Operations

```typescript
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    const result = await api.getData();
    
    // Only update if still mounted
    if (isMounted) {
      setData(result);
    }
  };
  
  fetchData();
  
  return () => {
    isMounted = false;
  };
}, []);
```

### Use Weak References for Cache

```typescript
// For caching objects that can be garbage collected
const cache = new WeakMap();
```

---

## 📦 Bundle Optimization

### Analyze Bundle Size

```bash
# Generate bundle stats
npx expo export --platform android
npx react-native-bundle-visualizer
```

### Tree Shaking Imports

```typescript
// ❌ BAD: Imports entire library
import _ from 'lodash';
_.map(items, transform);

// ✅ GOOD: Import only what you need
import map from 'lodash/map';
map(items, transform);
```

### Lazy Loading Screens

```typescript
// Heavy screens can be lazy loaded
const HeavyScreen = lazy(() => import('./HeavyScreen'));

// Use with Suspense
<Suspense fallback={<LoadingScreen />}>
  <HeavyScreen />
</Suspense>
```

---

## 🔥 Common Performance Issues

### 1. Inline Styles

```typescript
// ❌ BAD: New object on every render
<View style={{ padding: 16, backgroundColor: 'white' }}>

// ✅ GOOD: StyleSheet (single object, flattened)
<View style={styles.container}>

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' },
});
```

### 2. Complex Nested Components

```typescript
// ❌ BAD: Deep nesting causes re-renders
<Parent>
  <Child1>
    <Child2>
      <Child3>
        <ExpensiveComponent data={data} />
      </Child3>
    </Child2>
  </Child1>
</Parent>

// ✅ GOOD: Flatten structure with composition
<Parent>
  <Child1Content />
  <Child2Content />
  <ExpensiveComponent data={data} />
</Parent>
```

### 3. Context Overuse

```typescript
// ❌ BAD: Everything re-renders on any state change
const AppContext = createContext({
  user, cart, theme, notifications, settings, ...
});

// ✅ GOOD: Split contexts by domain
const UserContext = createContext({ user });
const CartContext = createContext({ cart });
const ThemeContext = createContext({ theme });

// Components only subscribe to what they need
```

### 4. Unnecessary State

```typescript
// ❌ BAD: Derived value stored in state
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0));
}, [items]);

// ✅ GOOD: Compute derived values
const total = useMemo(() => 
  items.reduce((sum, i) => sum + i.price, 0),
  [items]
);
```

---

## ✅ Performance Checklist

Before release, verify:

```markdown
### Rendering
- [ ] All list components use FlatList/SectionList
- [ ] Heavy components are memoized with memo()
- [ ] Event handlers use useCallback
- [ ] Expensive computations use useMemo
- [ ] No inline styles in render (use StyleSheet)

### Images
- [ ] Images are appropriately sized
- [ ] Using expo-image with caching
- [ ] Placeholders for loading images

### Animations
- [ ] Using react-native-reanimated
- [ ] No layout animations during scroll
- [ ] Animations run at 60 FPS

### Memory
- [ ] Effects have cleanup functions
- [ ] No memory leaks in async operations
- [ ] Large lists use virtualization

### Bundle
- [ ] Tree-shaking imports
- [ ] Heavy screens lazy loaded
- [ ] Bundle size under 10MB

### Testing
- [ ] Tested on low-end devices
- [ ] FPS stable at 60
- [ ] No jank during scroll
- [ ] Fast screen transitions
```

---

## 🏃 Quick Performance Fixes

```typescript
// 1. Wrap heavy components
export const HeavyComponent = memo(HeavyComponentBase);

// 2. Add key extractor to lists
keyExtractor={(item) => item.id}

// 3. Use windowSize for lists
windowSize={5}

// 4. Replace Animated with Reanimated
import Animated from 'react-native-reanimated';

// 5. Use StyleSheet.create
const styles = StyleSheet.create({ ... });

// 6. Add loading states
{isLoading ? <Skeleton /> : <Content />}
```
