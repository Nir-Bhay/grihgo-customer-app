---
name: API Integration
description: Expert skill for integrating REST APIs, handling async state, and implementing service layers in React Native
---

# API Integration Skill

> **Purpose:** Use this skill when integrating backend APIs, creating service layers, or handling async data fetching in the GRIHGO app.

---

## 🎯 When to Use This Skill

- Replacing mock data with real API calls
- Creating new API service functions
- Implementing loading/error states
- Setting up axios or fetch configurations
- Handling authentication tokens
- Implementing WebSocket connections

---

## 📁 Service Layer Architecture

```
src/
├── services/
│   ├── api.ts                # Base API configuration
│   ├── auth.service.ts       # Authentication endpoints
│   ├── restaurant.service.ts # Restaurant endpoints
│   ├── order.service.ts      # Order endpoints
│   ├── cart.service.ts       # Cart endpoints
│   └── user.service.ts       # User endpoints
├── hooks/
│   ├── useRestaurants.ts     # Custom data hooks
│   ├── useOrder.ts
│   └── useAuth.ts
└── types/
    └── api.types.ts          # API response types
```

---

## 🔧 Base API Configuration

### api.ts - Axios Setup

```typescript
// src/services/api.ts

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// CONFIGURATION
// ========================================

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'https://api.grihgo.com/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  async (config) => {
    // Get auth token
    const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    if (__DEV__) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        await AsyncStorage.setItem('authToken', accessToken);
        
        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout user
        await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
        // Navigate to login (via event emitter or context)
        return Promise.reject(refreshError);
      }
    }
    
    // Log error in dev
    if (__DEV__) {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
      console.error(error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// ========================================
// HELPER FUNCTIONS
// ========================================

const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default api;

// ========================================
// TYPE-SAFE REQUEST HELPERS
// ========================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
```

---

## 🍽️ Service Examples

### Restaurant Service

```typescript
// src/services/restaurant.service.ts

import api, { ApiResponse, handleApiError } from './api';
import { Restaurant, MenuItem, Category } from '@/types';

// ========================================
// TYPES
// ========================================

interface GetRestaurantsParams {
  category?: string;
  minRating?: number;
  maxDeliveryTime?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'distance' | 'deliveryTime';
}

interface GetMenuParams {
  category?: string;
  isVeg?: boolean;
  search?: string;
}

// ========================================
// SERVICE
// ========================================

export const restaurantService = {
  /**
   * Get list of restaurants with filters
   */
  getAll: async (params?: GetRestaurantsParams): Promise<ApiResponse<Restaurant[]>> => {
    try {
      const response = await api.get('/restaurants', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get single restaurant by ID
   */
  getById: async (id: string): Promise<Restaurant> => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get restaurant menu items
   */
  getMenu: async (restaurantId: string, params?: GetMenuParams): Promise<MenuItem[]> => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu`, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get menu categories for a restaurant
   */
  getCategories: async (restaurantId: string): Promise<Category[]> => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/categories`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (restaurantId: string): Promise<boolean> => {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/favorite`);
      return response.data.data.isFavorite;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Search restaurants
   */
  search: async (query: string): Promise<Restaurant[]> => {
    try {
      const response = await api.get('/restaurants/search', { 
        params: { q: query } 
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

### Order Service

```typescript
// src/services/order.service.ts

import api, { handleApiError } from './api';
import { Order, OrderStatus, CreateOrderPayload } from '@/types';

export const orderService = {
  /**
   * Create a new order
   */
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    try {
      const response = await api.post('/orders', payload);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get order by ID
   */
  getById: async (id: string): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get order history
   */
  getHistory: async (page = 1, limit = 10): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { 
        params: { page, limit } 
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Cancel an order
   */
  cancel: async (id: string, reason?: string): Promise<void> => {
    try {
      await api.post(`/orders/${id}/cancel`, { reason });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Rate an order
   */
  rate: async (id: string, rating: number, comment?: string): Promise<void> => {
    try {
      await api.post(`/orders/${id}/rate`, { rating, comment });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Track order status (polling fallback)
   */
  getStatus: async (id: string): Promise<OrderStatus> => {
    try {
      const response = await api.get(`/orders/${id}/status`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

---

## 🪝 Custom Data Hooks

### useRestaurants Hook

```typescript
// src/hooks/useRestaurants.ts

import { useState, useEffect, useCallback } from 'react';
import { restaurantService } from '@/services/restaurant.service';
import { Restaurant } from '@/types';

interface UseRestaurantsParams {
  category?: string;
  minRating?: number;
}

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useRestaurants(params?: UseRestaurantsParams): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRestaurants = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await restaurantService.getAll({
        ...params,
        page: pageNum,
        limit: 10,
      });
      
      if (append) {
        setRestaurants(prev => [...prev, ...response.data]);
      } else {
        setRestaurants(response.data);
      }
      
      setHasMore(response.meta ? pageNum < response.meta.totalPages : false);
      setPage(pageNum);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.minRating]);

  const refetch = useCallback(async () => {
    await fetchRestaurants(1);
  }, [fetchRestaurants]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchRestaurants(page + 1, true);
    }
  }, [fetchRestaurants, page, isLoading, hasMore]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, isLoading, error, refetch, loadMore, hasMore };
}
```

### useOrder Hook

```typescript
// src/hooks/useOrder.ts

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types';

interface UseOrderReturn {
  order: Order | null;
  status: OrderStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrder(orderId: string): UseOrderReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [orderData, statusData] = await Promise.all([
        orderService.getById(orderId),
        orderService.getStatus(orderId),
      ]);
      
      setOrder(orderData);
      setStatus(statusData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    
    // Poll for status updates every 30 seconds
    const interval = setInterval(() => {
      if (status?.status !== 'delivered' && status?.status !== 'cancelled') {
        orderService.getStatus(orderId).then(setStatus);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [orderId]);

  return { order, status, isLoading, error, refetch: fetchOrder };
}
```

---

## 🔌 WebSocket for Real-Time Updates

### Order Tracking WebSocket

```typescript
// src/services/websocket.service.ts

import { OrderStatus } from '@/types';

type StatusCallback = (status: OrderStatus) => void;
type LocationCallback = (location: { lat: number; lng: number }) => void;

class OrderTrackingSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  private statusCallbacks: Map<string, StatusCallback> = new Map();
  private locationCallbacks: Map<string, LocationCallback> = new Map();

  connect(orderId: string, token: string) {
    const wsUrl = __DEV__
      ? `ws://localhost:3000/ws/orders/${orderId}`
      : `wss://api.grihgo.com/ws/orders/${orderId}`;

    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('🔌 WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Authenticate
      this.socket?.send(JSON.stringify({
        type: 'auth',
        token,
      }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'status_update':
          this.statusCallbacks.get(orderId)?.(data.payload);
          break;
        case 'location_update':
          this.locationCallbacks.get(orderId)?.(data.payload);
          break;
      }
    };

    this.socket.onclose = () => {
      console.log('🔌 WebSocket closed');
      this.handleReconnect(orderId, token);
    };

    this.socket.onerror = (error) => {
      console.error('🔌 WebSocket error:', error);
    };
  }

  private handleReconnect(orderId: string, token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        this.connect(orderId, token);
      }, delay);
    }
  }

  onStatusUpdate(orderId: string, callback: StatusCallback) {
    this.statusCallbacks.set(orderId, callback);
  }

  onLocationUpdate(orderId: string, callback: LocationCallback) {
    this.locationCallbacks.set(orderId, callback);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.statusCallbacks.clear();
    this.locationCallbacks.clear();
  }
}

export const orderTrackingSocket = new OrderTrackingSocket();
```

---

## 🧪 Mock Data Transition

### Gradual API Integration

```typescript
// src/services/restaurant.service.ts

import { RESTAURANTS } from '@/data/mockData';
import { Restaurant } from '@/types';

const USE_MOCK = __DEV__ && !process.env.USE_REAL_API;

export const restaurantService = {
  getAll: async (): Promise<Restaurant[]> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return RESTAURANTS;
    }
    
    // Real API call
    const response = await api.get('/restaurants');
    return response.data.data;
  },
};
```

---

## ⚠️ Error Handling Patterns

### In Components

```typescript
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  try {
    setIsLoading(true);
    setError(null);
    await orderService.create(orderPayload);
    router.push('/order/success');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to place order');
    // Optionally show toast
    Toast.show({
      type: 'error',
      text1: 'Order Failed',
      text2: error,
    });
  } finally {
    setIsLoading(false);
  }
};
```

### User-Friendly Error Messages

```typescript
// src/utils/errorMessages.ts

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You don\'t have permission to do this.';
      case 404:
        return 'The requested item was not found.';
      case 422:
        return error.response?.data?.message || 'Validation failed.';
      case 500:
      case 502:
      case 503:
        return 'Server is temporarily unavailable. Please try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
  
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network.';
  }
  
  return 'An unexpected error occurred.';
};
```

---

## ✅ API Integration Checklist

```markdown
### Service Setup
- [ ] Base API configured with interceptors
- [ ] Auth token handling in place
- [ ] Token refresh logic implemented
- [ ] Request/response logging in dev

### Service Functions
- [ ] All endpoints have TypeScript types
- [ ] Error handling with messages
- [ ] Proper HTTP methods used
- [ ] Query params handled correctly

### Hooks
- [ ] Loading state exposed
- [ ] Error state exposed
- [ ] Refetch function available
- [ ] Pagination support (if needed)  
- [ ] Cleanup on unmount

### Components
- [ ] Loading UI shown
- [ ] Error UI with retry
- [ ] Empty state handled
- [ ] Success state renders data
- [ ] Pull-to-refresh (if applicable)

### Testing
- [ ] Works with mock data
- [ ] Works with real API
- [ ] Handles network errors
- [ ] Handles API errors
- [ ] Token expiry handled
```
