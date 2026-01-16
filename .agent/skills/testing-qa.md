---
name: Testing & Quality Assurance
description: Expert skill for implementing unit tests, integration tests, and E2E tests for React Native apps
---

# Testing & Quality Assurance Skill

> **Purpose:** Use this skill when writing tests, setting up test infrastructure, or ensuring quality assurance for the GRIHGO app.

---

## 🎯 When to Use This Skill

- Writing unit tests for components
- Writing integration tests for screens
- Setting up E2E test automation
- Implementing test-driven development (TDD)
- Debugging test failures
- Improving code coverage

---

## 📁 Test Structure

```
src/
├── __tests__/                    # Test files
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── RestaurantCard.test.tsx
│   ├── screens/
│   │   ├── Home.test.tsx
│   │   └── Cart.test.tsx
│   ├── hooks/
│   │   └── useRestaurants.test.ts
│   ├── services/
│   │   └── restaurant.service.test.ts
│   └── utils/
│       └── helpers.test.ts
├── __mocks__/                    # Manual mocks
│   ├── @react-native-async-storage/
│   ├── expo-router/
│   └── fileMock.js
└── jest.setup.js                 # Jest configuration
```

---

## ⚙️ Jest Setup

### jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### jest.setup.js

```javascript
import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: () => null,
  },
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence warnings in tests
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock timers
jest.useFakeTimers();
```

---

## 🧪 Unit Testing Components

### Basic Component Test

```typescript
// src/__tests__/components/Button.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

// Test wrapper with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Button', () => {
  it('renders correctly', () => {
    renderWithProviders(<Button title="Click Me" onPress={() => {}} />);
    
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    renderWithProviders(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(screen.getByText('Click Me'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    renderWithProviders(
      <Button title="Click Me" onPress={onPressMock} disabled />
    );
    
    fireEvent.press(screen.getByText('Click Me'));
    
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    renderWithProviders(<Button title="Click Me" onPress={() => {}} isLoading />);
    
    expect(screen.getByTestId('button-loading')).toBeTruthy();
    expect(screen.queryByText('Click Me')).toBeNull();
  });

  it('applies variant styles correctly', () => {
    const { getByTestId } = renderWithProviders(
      <Button title="Primary" onPress={() => {}} variant="primary" testID="button" />
    );
    
    const button = getByTestId('button');
    expect(button).toHaveStyle({ backgroundColor: '#2ECC71' });
  });
});
```

### Testing Card Components

```typescript
// src/__tests__/components/RestaurantCard.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { mockRestaurant } from '../__fixtures__/restaurants';

describe('RestaurantCard', () => {
  const defaultProps = {
    restaurant: mockRestaurant,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays restaurant name', () => {
    const { getByText } = render(<RestaurantCard {...defaultProps} />);
    
    expect(getByText(mockRestaurant.name)).toBeTruthy();
  });

  it('displays rating', () => {
    const { getByText } = render(<RestaurantCard {...defaultProps} />);
    
    expect(getByText(mockRestaurant.rating.toString())).toBeTruthy();
  });

  it('shows delivery time', () => {
    const { getByText } = render(<RestaurantCard {...defaultProps} />);
    
    expect(getByText(`${mockRestaurant.deliveryTime} mins`)).toBeTruthy();
  });

  it('handles press event', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <RestaurantCard {...defaultProps} onPress={onPress} testID="restaurant-card" />
    );
    
    fireEvent.press(getByTestId('restaurant-card'));
    
    expect(onPress).toHaveBeenCalledWith(mockRestaurant.id);
  });

  it('shows closed indicator when restaurant is closed', () => {
    const closedRestaurant = { ...mockRestaurant, isOpen: false };
    const { getByText } = render(
      <RestaurantCard {...defaultProps} restaurant={closedRestaurant} />
    );
    
    expect(getByText('Closed')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(<RestaurantCard {...defaultProps} />);
    
    const expectedLabel = `${mockRestaurant.name}, ${mockRestaurant.rating} stars`;
    expect(getByLabelText(expectedLabel)).toBeTruthy();
  });
});
```

---

## 🪝 Testing Custom Hooks

```typescript
// src/__tests__/hooks/useRestaurants.test.ts

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useRestaurants } from '@/hooks/useRestaurants';
import { restaurantService } from '@/services/restaurant.service';

// Mock the service
jest.mock('@/services/restaurant.service');
const mockedService = restaurantService as jest.Mocked<typeof restaurantService>;

describe('useRestaurants', () => {
  const mockRestaurants = [
    { id: '1', name: 'Restaurant 1' },
    { id: '2', name: 'Restaurant 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedService.getAll.mockResolvedValue({
      data: mockRestaurants,
      meta: { page: 1, totalPages: 2, totalItems: 20 },
    });
  });

  it('starts with loading state', () => {
    const { result } = renderHook(() => useRestaurants());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.restaurants).toEqual([]);
  });

  it('fetches restaurants on mount', async () => {
    const { result } = renderHook(() => useRestaurants());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.restaurants).toEqual(mockRestaurants);
    expect(mockedService.getAll).toHaveBeenCalledTimes(1);
  });

  it('handles error state', async () => {
    mockedService.getAll.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useRestaurants());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.error).toBe('Network error');
    expect(result.current.restaurants).toEqual([]);
  });

  it('refetches data when refetch is called', async () => {
    const { result } = renderHook(() => useRestaurants());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(mockedService.getAll).toHaveBeenCalledTimes(2);
  });

  it('loads more data with pagination', async () => {
    const { result } = renderHook(() => useRestaurants());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    mockedService.getAll.mockResolvedValueOnce({
      data: [{ id: '3', name: 'Restaurant 3' }],
      meta: { page: 2, totalPages: 2, totalItems: 20 },
    });
    
    await act(async () => {
      await result.current.loadMore();
    });
    
    expect(result.current.restaurants).toHaveLength(3);
  });
});
```

---

## 📱 Testing Screens

```typescript
// src/__tests__/screens/Home.test.tsx

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { restaurantService } from '@/services/restaurant.service';

// Mock navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  Stack: { Screen: () => null },
}));

jest.mock('@/services/restaurant.service');

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  </AuthProvider>
);

const renderScreen = () => render(<HomeScreen />, { wrapper: Providers });

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (restaurantService.getAll as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', name: 'Pizza Palace', rating: 4.5 },
        { id: '2', name: 'Burger Barn', rating: 4.2 },
      ],
    });
  });

  it('renders loading state initially', () => {
    renderScreen();
    
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders restaurants after loading', async () => {
    renderScreen();
    
    await waitFor(() => {
      expect(screen.getByText('Pizza Palace')).toBeTruthy();
      expect(screen.getByText('Burger Barn')).toBeTruthy();
    });
  });

  it('navigates to restaurant detail on card press', async () => {
    renderScreen();
    
    await waitFor(() => {
      expect(screen.getByText('Pizza Palace')).toBeTruthy();
    });
    
    fireEvent.press(screen.getByText('Pizza Palace'));
    
    expect(mockPush).toHaveBeenCalledWith('/restaurant/1');
  });

  it('shows error state when fetch fails', async () => {
    (restaurantService.getAll as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch')
    );
    
    renderScreen();
    
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });
  });

  it('retries fetch when retry button is pressed', async () => {
    (restaurantService.getAll as jest.Mock).mockRejectedValueOnce(
      new Error('Failed')
    );
    
    renderScreen();
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeTruthy();
    });
    
    (restaurantService.getAll as jest.Mock).mockResolvedValueOnce({
      data: [{ id: '1', name: 'Pizza Palace' }],
    });
    
    fireEvent.press(screen.getByText('Try Again'));
    
    await waitFor(() => {
      expect(screen.getByText('Pizza Palace')).toBeTruthy();
    });
  });
});
```

---

## 🔄 Testing Context

```typescript
// src/__tests__/context/CartContext.test.tsx

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { CartProvider, useCart } from '@/context/CartContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  const mockItem = {
    id: '1',
    name: 'Pizza',
    price: 299,
    quantity: 1,
    restaurantId: 'rest-1',
  };

  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem(mockItem);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Pizza');
    expect(result.current.itemCount).toBe(1);
  });

  it('increases quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem(mockItem);
    });
    
    act(() => {
      result.current.removeItem(mockItem.id);
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem({ ...mockItem, price: 100 });
      result.current.addItem({ ...mockItem, id: '2', price: 200 });
    });
    
    // Assuming 5% tax and ₹40 delivery
    const subtotal = 100 + 200;
    const tax = subtotal * 0.05;
    const delivery = 40;
    const expectedTotal = subtotal + tax + delivery;
    
    expect(result.current.total).toBe(expectedTotal);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem({ ...mockItem, id: '2' });
    });
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });
});
```

---

## 🎭 E2E Testing with Maestro

### Install Maestro

```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Windows (via WSL)
# Use WSL and follow macOS/Linux instructions
```

### E2E Test Flow

```yaml
# e2e/flows/login-flow.yaml

appId: com.grihgo.customer
---
- launchApp

# Onboarding
- assertVisible: "Welcome to GRIHGO"
- tap: "Get Started"
- tap: "Skip"

# Login
- assertVisible: "Enter your phone"
- tapOn:
    id: "phone-input"
- inputText: "9876543210"
- tap: "Continue"

# OTP
- assertVisible: "Enter OTP"
- tapOn:
    id: "otp-input-1"
- inputText: "123456"

# Home Screen
- assertVisible: "What would you like to eat?"
```

### Order Flow E2E

```yaml
# e2e/flows/order-flow.yaml

appId: com.grihgo.customer
---
- runFlow: login-flow.yaml

# Search for restaurant
- tapOn:
    id: "search-input"
- inputText: "Pizza"
- tap: "Pizza Palace"

# Add item to cart
- scrollUntilVisible:
    element: "Margherita Pizza"
- tap: "Margherita Pizza"
- tap: "Add to Cart"

# Go to cart
- tap: "View Cart"
- assertVisible: "Margherita Pizza"

# Checkout
- tap: "Proceed to Checkout"
- assertVisible: "Select Address"
- tap: "Home"
- tap: "Cash on Delivery"
- tap: "Place Order"

# Confirmation
- assertVisible: "Order Placed"
```

---

## 🧰 Test Utilities

### Test Fixtures

```typescript
// src/__tests__/__fixtures__/restaurants.ts

export const mockRestaurant = {
  id: '1',
  name: 'Pizza Palace',
  cuisine: 'Italian',
  rating: 4.5,
  deliveryTime: '30-40',
  distance: '2.5 km',
  isOpen: true,
  imageUrl: 'https://example.com/pizza.jpg',
  address: '123 Main St',
  priceRange: '$$',
};

export const mockRestaurants = [
  mockRestaurant,
  { ...mockRestaurant, id: '2', name: 'Burger Barn', cuisine: 'American' },
  { ...mockRestaurant, id: '3', name: 'Sushi House', cuisine: 'Japanese' },
];
```

### Custom Render with Providers

```typescript
// src/__tests__/utils/test-utils.tsx

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  </AuthProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };
```

---

## 📊 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
maestro test e2e/flows/

# Update snapshots
npm test -- --updateSnapshot
```

---

## ✅ Testing Checklist

```markdown
### Unit Tests
- [ ] All components have tests
- [ ] All custom hooks have tests
- [ ] Edge cases covered
- [ ] Error states tested
- [ ] Loading states tested

### Integration Tests
- [ ] Screen navigation tested
- [ ] Context interactions tested
- [ ] API integration tested

### E2E Tests
- [ ] Critical user flows covered
- [ ] Login/logout flow
- [ ] Order flow
- [ ] Cart operations

### Coverage
- [ ] Lines: > 70%
- [ ] Functions: > 70%
- [ ] Branches: > 70%
- [ ] Critical paths: 100%
```
