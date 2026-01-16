---
name: Real-Time Order Tracking
description: Expert skill for implementing live order tracking with WebSocket, Maps, GPS, and order status management in React Native
---

# Real-Time Order Tracking Skill

> **Purpose:** Use this skill when implementing order tracking features including live delivery location, order status updates, and map visualization for the GRIHGO app.

---

## When to Use This Skill

- Building the order tracking screen (`app/order/[id].tsx`)
- Implementing WebSocket connections for live updates
- Adding map visualization with delivery partner location
- Creating order status state machines
- Implementing delivery countdown timers
- Building the delivery partner info component

---

## Order Status State Machine

### Status Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ORDER STATUS FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PLACED → CONFIRMED → PREPARING → READY → PICKED_UP → DELIVERED │
│     │         │           │         │         │           │     │
│     └─────────┴───────────┴─────────┴─────────┴───────────┘     │
│                           ↓                                      │
│                       CANCELLED                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### TypeScript Types

```typescript
// src/types/order.types.ts

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  message?: string;
  estimatedTime?: number; // minutes
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  rating: number;
  vehicleNumber?: string;
  vehicleType: 'bike' | 'scooter' | 'car';
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  heading?: number; // direction in degrees
  speed?: number;
  timestamp: string;
}

export interface OrderTrackingData {
  orderId: string;
  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  estimatedDeliveryTime: string;
  deliveryPartner?: DeliveryPartner;
  currentLocation?: DeliveryLocation;
  restaurantLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
}
```

---

## WebSocket Connection

### WebSocket Service

```typescript
// src/services/orderTracking.socket.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderStatusUpdate, DeliveryLocation } from '@/types/order.types';

type StatusCallback = (update: OrderStatusUpdate) => void;
type LocationCallback = (location: DeliveryLocation) => void;
type ConnectionCallback = (connected: boolean) => void;

interface WebSocketMessage {
  type: 'status_update' | 'location_update' | 'eta_update' | 'error';
  payload: unknown;
}

class OrderTrackingSocket {
  private socket: WebSocket | null = null;
  private orderId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  private statusCallbacks: Set<StatusCallback> = new Set();
  private locationCallbacks: Set<LocationCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();

  // ========================================
  // CONNECTION MANAGEMENT
  // ========================================

  async connect(orderId: string): Promise<void> {
    this.orderId = orderId;
    const token = await AsyncStorage.getItem('authToken');

    const wsUrl = __DEV__
      ? `ws://localhost:3000/ws/orders/${orderId}`
      : `wss://api.grihgo.com/ws/orders/${orderId}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('🔌 Order tracking WebSocket connected');
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(true);

      // Authenticate
      this.send({
        type: 'auth',
        token,
      });

      // Start ping to keep connection alive
      this.startPing();
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('🔌 WebSocket closed:', event.code, event.reason);
      this.stopPing();
      this.notifyConnectionChange(false);

      // Don't reconnect if closed intentionally or order completed
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('🔌 WebSocket error:', error);
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'status_update':
        const statusUpdate = message.payload as OrderStatusUpdate;
        this.statusCallbacks.forEach(cb => cb(statusUpdate));
        break;

      case 'location_update':
        const location = message.payload as DeliveryLocation;
        this.locationCallbacks.forEach(cb => cb(location));
        break;

      case 'eta_update':
        // Handle ETA updates
        break;

      case 'error':
        console.error('WebSocket error:', message.payload);
        break;
    }
  }

  private send(data: object): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // Ping every 30 seconds
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      if (this.orderId) {
        this.connect(this.orderId);
      }
    }, delay);
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach(cb => cb(connected));
  }

  // ========================================
  // PUBLIC API
  // ========================================

  onStatusUpdate(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  onLocationUpdate(callback: LocationCallback): () => void {
    this.locationCallbacks.add(callback);
    return () => this.locationCallbacks.delete(callback);
  }

  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.add(callback);
    return () => this.connectionCallbacks.delete(callback);
  }

  disconnect(): void {
    this.stopPing();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }

    this.orderId = null;
    this.statusCallbacks.clear();
    this.locationCallbacks.clear();
    this.connectionCallbacks.clear();
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const orderTrackingSocket = new OrderTrackingSocket();
```

---

## useOrderTracking Hook

```typescript
// src/hooks/useOrderTracking.ts

import { useState, useEffect, useCallback } from 'react';
import { orderTrackingSocket } from '@/services/orderTracking.socket';
import { orderService } from '@/services/order.service';
import {
  OrderTrackingData,
  OrderStatusUpdate,
  DeliveryLocation
} from '@/types/order.types';

interface UseOrderTrackingReturn {
  order: OrderTrackingData | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  currentLocation: DeliveryLocation | null;
  refetch: () => Promise<void>;
}

export function useOrderTracking(orderId: string): UseOrderTrackingReturn {
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation | null>(null);

  // Fetch initial order data
  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getTrackingData(orderId);
      setOrder(data);
      if (data.currentLocation) {
        setCurrentLocation(data.currentLocation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  // Handle status updates
  const handleStatusUpdate = useCallback((update: OrderStatusUpdate) => {
    setOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: update.status,
        statusHistory: [...prev.statusHistory, update],
        estimatedDeliveryTime: update.estimatedTime
          ? new Date(Date.now() + update.estimatedTime * 60000).toISOString()
          : prev.estimatedDeliveryTime,
      };
    });
  }, []);

  // Handle location updates
  const handleLocationUpdate = useCallback((location: DeliveryLocation) => {
    setCurrentLocation(location);
    setOrder(prev => {
      if (!prev) return prev;
      return { ...prev, currentLocation: location };
    });
  }, []);

  // Handle connection changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  useEffect(() => {
    // Fetch initial data
    fetchOrder();

    // Connect WebSocket
    orderTrackingSocket.connect(orderId);

    // Subscribe to updates
    const unsubStatus = orderTrackingSocket.onStatusUpdate(handleStatusUpdate);
    const unsubLocation = orderTrackingSocket.onLocationUpdate(handleLocationUpdate);
    const unsubConnection = orderTrackingSocket.onConnectionChange(handleConnectionChange);

    // Cleanup
    return () => {
      unsubStatus();
      unsubLocation();
      unsubConnection();
      orderTrackingSocket.disconnect();
    };
  }, [orderId, fetchOrder, handleStatusUpdate, handleLocationUpdate, handleConnectionChange]);

  return {
    order,
    isLoading,
    error,
    isConnected,
    currentLocation,
    refetch: fetchOrder,
  };
}
```

---

## Map Component

### Installation

```bash
npx expo install react-native-maps
```

### DeliveryMap Component

```typescript
// src/components/tracking/DeliveryMap.tsx

import React, { useRef, useEffect, memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { useTheme } from '@/context/ThemeContext';
import { DeliveryLocation } from '@/types/order.types';
import { SPACING, RADIUS } from '@/constants';

// ========================================
// TYPES
// ========================================

interface DeliveryMapProps {
  restaurantLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  currentLocation?: DeliveryLocation | null;
  showRoute?: boolean;
}

// ========================================
// DARK MODE MAP STYLE
// ========================================

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
];

// ========================================
// COMPONENT
// ========================================

function DeliveryMapBase({
  restaurantLocation,
  deliveryLocation,
  currentLocation,
  showRoute = true,
}: DeliveryMapProps) {
  const { colors, isDark } = useTheme();
  const mapRef = useRef<MapView>(null);

  // Calculate region to fit all markers
  const getRegion = (): Region => {
    const points = [restaurantLocation, deliveryLocation];
    if (currentLocation) {
      points.push({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }

    const latitudes = points.map(p => p.latitude);
    const longitudes = points.map(p => p.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5 || 0.01;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.01;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  // Animate to delivery partner when location updates
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }
  }, [currentLocation]);

  // Route coordinates (simplified - use Directions API for real routes)
  const routeCoordinates = currentLocation
    ? [
        { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        deliveryLocation,
      ]
    : [restaurantLocation, deliveryLocation];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={getRegion()}
        customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {/* Restaurant Marker */}
        <Marker
          coordinate={restaurantLocation}
          title="Restaurant"
          identifier="restaurant"
        >
          <View style={[styles.markerContainer, { backgroundColor: colors.primary }]}>
            <View style={styles.markerInner}>
              {/* Restaurant Icon */}
            </View>
          </View>
        </Marker>

        {/* Delivery Location Marker */}
        <Marker
          coordinate={deliveryLocation}
          title="Delivery Location"
          identifier="delivery"
        >
          <View style={[styles.markerContainer, { backgroundColor: colors.error }]}>
            <View style={styles.markerInner}>
              {/* Home Icon */}
            </View>
          </View>
        </Marker>

        {/* Delivery Partner Marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Delivery Partner"
            identifier="partner"
            rotation={currentLocation.heading || 0}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.bikeMarker}>
              {/* Bike/Scooter Icon */}
            </View>
          </Marker>
        )}

        {/* Route Line */}
        {showRoute && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.primary}
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
      </MapView>
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeMarker: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const DeliveryMap = memo(DeliveryMapBase);
```

---

## Order Status Timeline

```typescript
// src/components/tracking/OrderStatusTimeline.tsx

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Clock, ChefHat, Package, Bike, Home } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { OrderStatus, OrderStatusUpdate } from '@/types/order.types';

// ========================================
// TYPES
// ========================================

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: OrderStatusUpdate[];
}

interface StatusStep {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

// ========================================
// CONSTANTS
// ========================================

const STATUS_STEPS: StatusStep[] = [
  { status: 'confirmed', label: 'Order Confirmed', icon: Check },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'ready', label: 'Ready for Pickup', icon: Package },
  { status: 'picked_up', label: 'Out for Delivery', icon: Bike },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

const STATUS_ORDER: OrderStatus[] = [
  'placed',
  'confirmed',
  'preparing',
  'ready',
  'picked_up',
  'out_for_delivery',
  'delivered',
];

// ========================================
// COMPONENT
// ========================================

function OrderStatusTimelineBase({
  currentStatus,
  statusHistory
}: OrderStatusTimelineProps) {
  const { colors } = useTheme();

  const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

  const getStepState = (stepStatus: OrderStatus): 'completed' | 'current' | 'pending' => {
    const stepIndex = STATUS_ORDER.indexOf(stepStatus);
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'current';
    return 'pending';
  };

  const getStatusTime = (status: OrderStatus): string | null => {
    const update = statusHistory.find(h => h.status === status);
    if (!update) return null;
    return new Date(update.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {STATUS_STEPS.map((step, index) => {
        const state = getStepState(step.status);
        const time = getStatusTime(step.status);
        const isLast = index === STATUS_STEPS.length - 1;
        const Icon = step.icon;

        return (
          <View key={step.status} style={styles.stepContainer}>
            {/* Icon Circle */}
            <View style={styles.iconColumn}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor:
                      state === 'completed' ? colors.primary :
                      state === 'current' ? colors.primary :
                      colors.surface,
                    borderColor:
                      state === 'pending' ? colors.border : colors.primary,
                  },
                ]}
              >
                <Icon
                  size={18}
                  color={state === 'pending' ? colors.textSecondary : '#FFF'}
                />
              </View>

              {/* Connector Line */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        state === 'completed' ? colors.primary : colors.border,
                    },
                  ]}
                />
              )}
            </View>

            {/* Content */}
            <View style={styles.contentColumn}>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: state === 'pending' ? colors.textSecondary : colors.text,
                    fontWeight: state === 'current' ? '600' : '400',
                  },
                ]}
              >
                {step.label}
              </Text>

              {time && (
                <Text style={[styles.stepTime, { color: colors.textSecondary }]}>
                  {time}
                </Text>
              )}

              {state === 'current' && (
                <View style={[styles.currentBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Clock size={12} color={colors.primary} />
                  <Text style={[styles.currentText, { color: colors.primary }]}>
                    In Progress
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    minHeight: 60,
  },
  iconColumn: {
    width: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    flex: 1,
    width: 2,
    marginVertical: SPACING.xs,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  stepLabel: {
    ...TYPOGRAPHY.bodyMedium,
  },
  stepTime: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
    gap: 4,
  },
  currentText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});

export const OrderStatusTimeline = memo(OrderStatusTimelineBase);
```

---

## Delivery Partner Card

```typescript
// src/components/tracking/DeliveryPartnerCard.tsx

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Image } from 'react-native';
import { Phone, MessageCircle, Star } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '@/constants';
import { DeliveryPartner } from '@/types/order.types';

interface DeliveryPartnerCardProps {
  partner: DeliveryPartner;
}

function DeliveryPartnerCardBase({ partner }: DeliveryPartnerCardProps) {
  const { colors } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${partner.phone}`);
  };

  const handleMessage = () => {
    // Open in-app chat or SMS
    Linking.openURL(`sms:${partner.phone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, SHADOWS.md]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Your Delivery Partner
        </Text>
      </View>

      <View style={styles.content}>
        {/* Partner Photo */}
        <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
          {partner.photo ? (
            <Image source={{ uri: partner.photo }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {partner.name.charAt(0)}
            </Text>
          )}
        </View>

        {/* Partner Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {partner.name}
          </Text>

          <View style={styles.ratingRow}>
            <Star size={14} color={colors.warning} fill={colors.warning} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {partner.rating.toFixed(1)}
            </Text>
            {partner.vehicleNumber && (
              <Text style={[styles.vehicle, { color: colors.textSecondary }]}>
                • {partner.vehicleNumber}
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={handleCall}
            accessibilityLabel={`Call ${partner.name}`}
            accessibilityRole="button"
          >
            <Phone size={20} color={colors.primary} />
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={handleMessage}
            accessibilityLabel={`Message ${partner.name}`}
            accessibilityRole="button"
          >
            <MessageCircle size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  avatarText: {
    ...TYPOGRAPHY.h4,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  rating: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  vehicle: {
    ...TYPOGRAPHY.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const DeliveryPartnerCard = memo(DeliveryPartnerCardBase);
```

---

## ETA Countdown Timer

```typescript
// src/components/tracking/ETACountdown.tsx

import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';

interface ETACountdownProps {
  estimatedDeliveryTime: string; // ISO timestamp
}

function ETACountdownBase({ estimatedDeliveryTime }: ETACountdownProps) {
  const { colors } = useTheme();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eta = new Date(estimatedDeliveryTime).getTime();
      const diff = Math.max(0, eta - now);
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [estimatedDeliveryTime]);

  const formatTime = (ms: number): { minutes: number; seconds: number } => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(timeLeft);
  const isNearby = minutes < 5;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isNearby ? colors.primary : colors.surface }
      ]}
    >
      <Clock size={20} color={isNearby ? '#FFF' : colors.primary} />

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            { color: isNearby ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
          ]}
        >
          {isNearby ? 'Arriving in' : 'Estimated arrival'}
        </Text>

        <Text
          style={[
            styles.time,
            { color: isNearby ? '#FFF' : colors.text }
          ]}
        >
          {minutes > 0
            ? `${minutes} min${minutes > 1 ? 's' : ''}`
            : `${seconds} sec${seconds > 1 ? 's' : ''}`
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...TYPOGRAPHY.caption,
  },
  time: {
    ...TYPOGRAPHY.h3,
    marginTop: 2,
  },
});

export const ETACountdown = memo(ETACountdownBase);
```

---

## Complete Order Tracking Screen

```typescript
// src/app/order/[id].tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wifi, WifiOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { useOrderTracking } from '@/hooks/useOrderTracking';

// Components
import { DeliveryMap } from '@/components/tracking/DeliveryMap';
import { OrderStatusTimeline } from '@/components/tracking/OrderStatusTimeline';
import { DeliveryPartnerCard } from '@/components/tracking/DeliveryPartnerCard';
import { ETACountdown } from '@/components/tracking/ETACountdown';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    order,
    isLoading,
    error,
    isConnected,
    currentLocation,
    refetch
  } = useOrderTracking(id);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading order...
        </Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error || 'Order not found'}
        </Text>
      </View>
    );
  }

  const showDeliveryPartner = order.deliveryPartner &&
    ['picked_up', 'out_for_delivery'].includes(order.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: `Order #${id.slice(-6).toUpperCase()}`,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      {/* Connection Status */}
      <View style={[styles.connectionBar, { backgroundColor: isConnected ? colors.success : colors.error }]}>
        {isConnected ? (
          <>
            <Wifi size={14} color="#FFF" />
            <Text style={styles.connectionText}>Live Tracking</Text>
          </>
        ) : (
          <>
            <WifiOff size={14} color="#FFF" />
            <Text style={styles.connectionText}>Reconnecting...</Text>
          </>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + SPACING.xl }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {/* Map */}
        <DeliveryMap
          restaurantLocation={order.restaurantLocation}
          deliveryLocation={order.deliveryLocation}
          currentLocation={currentLocation}
        />

        {/* ETA */}
        <View style={styles.section}>
          <ETACountdown estimatedDeliveryTime={order.estimatedDeliveryTime} />
        </View>

        {/* Delivery Partner */}
        {showDeliveryPartner && order.deliveryPartner && (
          <View style={styles.section}>
            <DeliveryPartnerCard partner={order.deliveryPartner} />
          </View>
        )}

        {/* Status Timeline */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Status
          </Text>
          <OrderStatusTimeline
            currentStatus={order.status}
            statusHistory={order.statusHistory}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
  },
  errorText: {
    ...TYPOGRAPHY.body,
  },
  connectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  connectionText: {
    ...TYPOGRAPHY.caption,
    color: '#FFF',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  section: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    padding: SPACING.lg,
    paddingBottom: 0,
  },
});
```

---

## Checklist

Before implementing order tracking:

```markdown
### Setup
- [ ] Install react-native-maps: `npx expo install react-native-maps`
- [ ] Configure Google Maps API key (android/app/src/main/AndroidManifest.xml)
- [ ] Configure Google Maps for iOS (app.json expo config)

### WebSocket
- [ ] WebSocket service created
- [ ] Connection/reconnection logic
- [ ] Ping/pong for keep-alive
- [ ] Authentication via token
- [ ] Status update handlers
- [ ] Location update handlers

### Components
- [ ] DeliveryMap with markers and route
- [ ] OrderStatusTimeline with states
- [ ] DeliveryPartnerCard with call/message
- [ ] ETACountdown with live updates

### Hook
- [ ] useOrderTracking with all state
- [ ] Initial data fetch
- [ ] WebSocket subscription
- [ ] Cleanup on unmount

### Accessibility
- [ ] Map has accessible labels
- [ ] Call/message buttons labeled
- [ ] Status updates announced

### Testing
- [ ] Test with mock WebSocket
- [ ] Test reconnection logic
- [ ] Test all order statuses
- [ ] Test on both platforms
```
