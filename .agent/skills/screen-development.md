---
name: Screen Development
description: Expert skill for creating complete React Native screens with Expo Router, navigation, and all required states
---

# Screen Development Skill

> **Purpose:** Use this skill when creating new screens for the GRIHGO app. Follow these patterns for consistent, production-ready screen implementations.

---

## 🎯 When to Use This Skill

- Creating new app screens
- Implementing screen layouts from designs
- Building navigation flows
- Adding new routes to the app

---

## 📁 Screen File Locations

```
src/app/
├── (auth)/                    # Authentication screens
│   ├── onboarding.tsx
│   ├── login.tsx
│   └── otp.tsx
├── (tabs)/                    # Main tab screens
│   ├── index.tsx              # Home
│   ├── search.tsx
│   ├── reorder.tsx
│   ├── favorites.tsx
│   └── profile.tsx
├── restaurant/
│   └── [id].tsx               # Dynamic route
├── food/
│   └── [id].tsx
├── cart/
│   ├── index.tsx
│   └── checkout.tsx
├── order/
│   ├── [id].tsx
│   └── rate.tsx
├── settings/
│   ├── addresses.tsx
│   ├── notifications.tsx
│   └── help.tsx
└── _layout.tsx                # Root layout
```

---

## 🏗️ Complete Screen Template

```typescript
// src/app/[category]/screen-name.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
// import components as needed

// ========================================
// TYPES
// ========================================

interface ScreenData {
  id: string;
  title: string;
  // ... other fields
}

type ScreenState = 'loading' | 'error' | 'empty' | 'success';

// ========================================
// SCREEN COMPONENT
// ========================================

export default function ScreenName() {
  // Hooks
  const { colors, theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  
  // State
  const [data, setData] = useState<ScreenData | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ========================================
  // DATA FETCHING
  // ========================================
  
  const fetchData = useCallback(async () => {
    try {
      setScreenState('loading');
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await api.get(`/endpoint/${params.id}`);
      // setData(response.data);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData: ScreenData = { id: '1', title: 'Example' };
      
      if (!mockData) {
        setScreenState('empty');
        return;
      }
      
      setData(mockData);
      setScreenState('success');
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setScreenState('error');
    }
  }, [params.id]);
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);
  
  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // ========================================
  // EVENT HANDLERS
  // ========================================
  
  const handlePrimaryAction = useCallback(() => {
    // Primary button action
    router.push('/next-screen');
  }, [router]);
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  // ========================================
  // RENDER HELPERS
  // ========================================
  
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.statusText, { color: colors.textSecondary }]}>
        Loading...
      </Text>
    </View>
  );
  
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={[styles.errorText, { color: colors.error }]}>
        {error || 'Something went wrong'}
      </Text>
      <Pressable 
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={fetchData}
        accessibilityRole="button"
        accessibilityLabel="Retry loading"
      >
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </View>
  );
  
  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Data Found
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Check back later or try refreshing.
      </Text>
    </View>
  );
  
  const renderContent = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Main content here */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {data?.title}
        </Text>
      </View>
      
      {/* Add more sections... */}
      
      {/* Bottom spacing for safe area */}
      <View style={{ height: insets.bottom + SPACING.xl }} />
    </ScrollView>
  );
  
  // ========================================
  // MAIN RENDER
  // ========================================
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Configuration */}
      <Stack.Screen
        options={{
          title: 'Screen Title',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: 'Back',
        }}
      />
      
      {/* Status Bar */}
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      
      {/* Content based on state */}
      {screenState === 'loading' && renderLoading()}
      {screenState === 'error' && renderError()}
      {screenState === 'empty' && renderEmpty()}
      {screenState === 'success' && renderContent()}
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  statusText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
  },
  
  // Error state
  errorText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  retryText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Empty state
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  
  // Content sections
  section: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
  },
});
```

---

## 🧭 Navigation Patterns

### Basic Navigation

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Push to screen
router.push('/restaurant/123');

// Replace current screen
router.replace('/home');

// Go back
router.back();

// Navigate with params
router.push({
  pathname: '/restaurant/[id]',
  params: { id: restaurantId },
});
```

### Receiving Route Params

```typescript
import { useLocalSearchParams } from 'expo-router';

// For dynamic routes like [id].tsx
const { id } = useLocalSearchParams<{ id: string }>();

// For search params ?query=pizza
const { query } = useLocalSearchParams<{ query?: string }>();
```

### Header Configuration

```typescript
<Stack.Screen
  options={{
    title: 'Page Title',
    headerShown: true,
    headerStyle: { 
      backgroundColor: colors.background,
    },
    headerTintColor: colors.text,
    headerShadowVisible: false,
    headerLeft: () => (
      <Pressable onPress={handleBack} hitSlop={12}>
        <ChevronLeft color={colors.text} size={24} />
      </Pressable>
    ),
    headerRight: () => (
      <Pressable onPress={handleShare} hitSlop={12}>
        <Share color={colors.text} size={24} />
      </Pressable>
    ),
  }}
/>
```

---

## 📱 Screen States

Every screen MUST handle these states:

### 1. Loading State
```typescript
if (screenState === 'loading') {
  return <LoadingScreen />;
}
```

### 2. Error State
```typescript
if (screenState === 'error') {
  return (
    <ErrorScreen 
      message={error} 
      onRetry={fetchData} 
    />
  );
}
```

### 3. Empty State
```typescript
if (screenState === 'empty') {
  return (
    <EmptyScreen 
      title="No items found"
      subtitle="Try adjusting your filters"
      actionLabel="Browse All"
      onAction={handleBrowseAll}
    />
  );
}
```

### 4. Success State
```typescript
if (screenState === 'success') {
  return <ContentView data={data} />;
}
```

---

## 📐 Layout Patterns

### Safe Area Handling

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

// Top padding (for custom headers)
<View style={{ paddingTop: insets.top }}>

// Bottom padding (for footer buttons)
<View style={{ paddingBottom: insets.bottom + SPACING.lg }}>
```

### Scroll with Sticky Footer

```typescript
<View style={styles.container}>
  <ScrollView style={styles.scrollView}>
    {/* Content */}
  </ScrollView>
  
  {/* Sticky Footer */}
  <View style={[
    styles.footer, 
    { 
      paddingBottom: insets.bottom + SPACING.lg,
      backgroundColor: colors.background,
    }
  ]}>
    <Button title="Continue" onPress={handleContinue} />
  </View>
</View>

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
  },
});
```

### FlatList with Header

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  ListHeaderComponent={<HeaderSection />}
  ListEmptyComponent={<EmptyState />}
  contentContainerStyle={{ 
    paddingHorizontal: SPACING.lg,
    paddingBottom: insets.bottom,
  }}
/>
```

---

## 🔄 Pull-to-Refresh

```typescript
import { RefreshControl } from 'react-native';

const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]} // Android
    />
  }
>
```

---

## ⌨️ Keyboard Handling

```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
>
  {/* Content with inputs */}
</KeyboardAvoidingView>
```

---

## ✅ Screen Checklist

Before submitting any screen:

- [ ] All 4 states handled (loading, error, empty, success)
- [ ] Pull-to-refresh implemented (if applicable)
- [ ] Safe area padding applied
- [ ] Keyboard avoiding behavior (if has inputs)
- [ ] Header configured correctly
- [ ] Dark mode tested
- [ ] Accessibility labels on interactive elements
- [ ] Navigation works correctly
- [ ] Loading indicators visible
- [ ] Error messages are user-friendly
