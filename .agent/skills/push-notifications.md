---
name: Push Notifications
description: Expert skill for implementing Firebase Cloud Messaging (FCM) push notifications with Expo, including deep linking and in-app notifications
---

# Push Notifications Skill

> **Purpose:** Use this skill when implementing push notifications for order updates, promotions, and user engagement in the GRIHGO app.

---

## 🎯 When to Use This Skill

- Setting up Firebase Cloud Messaging (FCM)
- Requesting notification permissions
- Handling foreground/background notifications
- Implementing deep linking from notifications
- Building in-app notification center
- Sending targeted notifications (order updates, promos)
- Scheduling local notifications

---

## 📦 Installation

```bash
# Install Expo Notifications
npx expo install expo-notifications expo-device expo-constants

# For Firebase (optional - for custom FCM handling)
npx expo install @react-native-firebase/app @react-native-firebase/messaging
```

---

## ⚙️ Configuration

### app.json / app.config.js

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2ECC71",
          "sounds": ["./assets/sounds/notification.wav"],
          "defaultChannel": "default"
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### Android Notification Channels

```typescript
// src/utils/notificationChannels.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function setupNotificationChannels() {
  if (Platform.OS !== 'android') return;

  // Order Updates Channel (High Priority)
  await Notifications.setNotificationChannelAsync('orders', {
    name: 'Order Updates',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2ECC71',
    sound: 'notification.wav',
    description: 'Notifications about your order status',
  });

  // Promotions Channel (Default Priority)
  await Notifications.setNotificationChannelAsync('promotions', {
    name: 'Offers & Promotions',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'notification.wav',
    description: 'Deals, discounts, and special offers',
  });

  // General Channel (Low Priority)
  await Notifications.setNotificationChannelAsync('general', {
    name: 'General',
    importance: Notifications.AndroidImportance.LOW,
    description: 'General app notifications',
  });
}
```

---

## 🔑 Types

```typescript
// src/types/notification.types.ts

export type NotificationType =
  | 'order_placed'
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_ready'
  | 'order_picked_up'
  | 'order_delivered'
  | 'order_cancelled'
  | 'promotion'
  | 'reminder'
  | 'general';

export interface NotificationData {
  type: NotificationType;
  orderId?: string;
  restaurantId?: string;
  promoCode?: string;
  deepLink?: string;
  imageUrl?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data: NotificationData;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
  email: boolean;
  sms: boolean;
}
```

---

## 🔧 Notification Service

```typescript
// src/services/notification.service.ts

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { setupNotificationChannels } from '@/utils/notificationChannels';
import { NotificationData, PushNotification, NotificationPreferences } from '@/types/notification.types';

// ========================================
// CONFIGURATION
// ========================================

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ========================================
// SERVICE
// ========================================

class NotificationService {
  private expoPushToken: string | null = null;

  // ========================================
  // INITIALIZATION
  // ========================================

  async initialize(): Promise<string | null> {
    // Setup Android channels
    await setupNotificationChannels();

    // Request permissions and get token
    const token = await this.registerForPushNotifications();

    if (token) {
      this.expoPushToken = token;
      await this.sendTokenToServer(token);
    }

    return token;
  }

  // ========================================
  // PERMISSION & REGISTRATION
  // ========================================

  async registerForPushNotifications(): Promise<string | null> {
    // Must be physical device
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied');
      return null;
    }

    // Get Expo push token
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      return tokenData.data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  async checkPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  // ========================================
  // TOKEN MANAGEMENT
  // ========================================

  async sendTokenToServer(token: string): Promise<void> {
    try {
      await api.post('/notifications/register', {
        token,
        platform: Platform.OS,
        deviceId: Constants.deviceId,
      });
      await AsyncStorage.setItem('pushToken', token);
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  async removeTokenFromServer(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('pushToken');
      if (token) {
        await api.post('/notifications/unregister', { token });
        await AsyncStorage.removeItem('pushToken');
      }
    } catch (error) {
      console.error('Failed to unregister push token:', error);
    }
  }

  getToken(): string | null {
    return this.expoPushToken;
  }

  // ========================================
  // LOCAL NOTIFICATIONS
  // ========================================

  async scheduleLocalNotification(
    title: string,
    body: string,
    data: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'notification.wav',
        badge: 1,
      },
      trigger,
    });
    return id;
  }

  async scheduleOrderReminder(orderId: string, restaurantName: string): Promise<string> {
    // Remind user to rate order after 1 hour
    return this.scheduleLocalNotification(
      'How was your order?',
      `Rate your experience with ${restaurantName}`,
      {
        type: 'reminder',
        orderId,
        deepLink: `/order/${orderId}/rate`,
      },
      { seconds: 3600 } // 1 hour
    );
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // ========================================
  // BADGE MANAGEMENT
  // ========================================

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // ========================================
  // NOTIFICATION HISTORY
  // ========================================

  async getNotificationHistory(page = 1): Promise<PushNotification[]> {
    try {
      const response = await api.get('/notifications', {
        params: { page, limit: 20 },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.patch('/notifications/read-all');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.data.count;
    } catch (error) {
      return 0;
    }
  }

  // ========================================
  // PREFERENCES
  // ========================================

  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data.data;
    } catch (error) {
      // Default preferences
      return {
        orderUpdates: true,
        promotions: true,
        reminders: true,
        email: true,
        sms: false,
      };
    }
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      await api.patch('/notifications/preferences', preferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
```

---

## 🪝 useNotifications Hook

```typescript
// src/hooks/useNotifications.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notification.service';
import { NotificationData, PushNotification } from '@/types/notification.types';

interface UseNotificationsReturn {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  permissionStatus: 'granted' | 'denied' | 'undetermined' | null;
  unreadCount: number;
  requestPermission: () => Promise<boolean>;
  refreshUnreadCount: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const router = useRouter();

  // Handle deep linking from notification
  const handleNotificationResponse = useCallback((response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as NotificationData;

    if (data.deepLink) {
      router.push(data.deepLink);
      return;
    }

    // Default navigation based on type
    switch (data.type) {
      case 'order_placed':
      case 'order_confirmed':
      case 'order_preparing':
      case 'order_ready':
      case 'order_picked_up':
      case 'order_delivered':
      case 'order_cancelled':
        if (data.orderId) {
          router.push(`/order/${data.orderId}`);
        }
        break;

      case 'promotion':
        if (data.restaurantId) {
          router.push(`/restaurant/${data.restaurantId}`);
        } else {
          router.push('/offers');
        }
        break;

      default:
        router.push('/notifications');
    }
  }, [router]);

  // Initialize notifications
  useEffect(() => {
    const init = async () => {
      // Get initial permission status
      const status = await notificationService.checkPermissionStatus();
      setPermissionStatus(status);

      // Initialize service (request permission + get token)
      const token = await notificationService.initialize();
      setExpoPushToken(token);

      // Get unread count
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    };

    init();

    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        // Increment unread count
        setUnreadCount(prev => prev + 1);
      }
    );

    // Listener for user interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [handleNotificationResponse]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const token = await notificationService.registerForPushNotifications();
    if (token) {
      setExpoPushToken(token);
      setPermissionStatus('granted');
      await notificationService.sendTokenToServer(token);
      return true;
    }
    setPermissionStatus('denied');
    return false;
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  }, []);

  return {
    expoPushToken,
    notification,
    permissionStatus,
    unreadCount,
    requestPermission,
    refreshUnreadCount,
  };
}
```

---

## 📱 Notifications List Screen

```typescript
// src/app/notifications.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import {
  Package,
  Tag,
  Bell,
  ChevronRight,
  CheckCheck,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { notificationService } from '@/services/notification.service';
import { PushNotification, NotificationType } from '@/types/notification.types';

// ========================================
// HELPERS
// ========================================

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'order_placed':
    case 'order_confirmed':
    case 'order_preparing':
    case 'order_ready':
    case 'order_picked_up':
    case 'order_delivered':
    case 'order_cancelled':
      return Package;
    case 'promotion':
      return Tag;
    default:
      return Bell;
  }
};

// ========================================
// NOTIFICATION ITEM COMPONENT
// ========================================

interface NotificationItemProps {
  notification: PushNotification;
  onPress: (notification: PushNotification) => void;
}

function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { colors } = useTheme();
  const Icon = getNotificationIcon(notification.data.type);

  return (
    <Pressable
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.read ? colors.card : colors.primary + '10',
        },
      ]}
      onPress={() => onPress(notification)}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.body}`}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: notification.read ? colors.surface : colors.primary + '20' },
        ]}
      >
        <Icon
          size={20}
          color={notification.read ? colors.textSecondary : colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontWeight: notification.read ? '400' : '600',
            },
          ]}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text
          style={[styles.body, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {notification.body}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary }]}>
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </Text>
      </View>

      {!notification.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}

      <ChevronRight size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

// ========================================
// MAIN SCREEN
// ========================================

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async (pageNum = 1, refresh = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      }

      const data = await notificationService.getNotificationHistory(pageNum);

      if (refresh || pageNum === 1) {
        setNotifications(data);
      } else {
        setNotifications(prev => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleNotificationPress = async (notification: PushNotification) => {
    // Mark as read
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }

    // Navigate based on data
    const { data } = notification;
    if (data.deepLink) {
      router.push(data.deepLink);
    } else if (data.orderId) {
      router.push(`/order/${data.orderId}`);
    } else if (data.restaurantId) {
      router.push(`/restaurant/${data.restaurantId}`);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Bell size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Notifications
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        You'll see order updates and offers here
      </Text>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: unreadCount > 0
            ? () => (
                <Pressable onPress={handleMarkAllRead} hitSlop={12}>
                  <CheckCheck size={24} color={colors.primary} />
                </Pressable>
              )
            : undefined,
        }}
      />

      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyList,
          ]}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && notifications.length > 0 ? (
              <ActivityIndicator style={styles.footer} color={colors.primary} />
            ) : null
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: SPACING.sm,
  },
  emptyList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyMedium,
  },
  body: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  time: {
    ...TYPOGRAPHY.overline,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.lg,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  footer: {
    padding: SPACING.lg,
  },
});
```

---

## ⚙️ Notification Settings Screen

```typescript
// src/app/settings/notifications.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Bell, Package, Tag, Clock, Mail, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { Toggle } from '@/components/ui/Toggle';
import { notificationService } from '@/services/notification.service';
import { NotificationPreferences } from '@/types/notification.types';

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: true,
    reminders: true,
    email: true,
    sms: false,
  });
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      // Check system permission
      const { status } = await Notifications.getPermissionsAsync();
      setSystemEnabled(status === 'granted');

      // Load user preferences
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
      setIsLoading(false);
    };

    loadPreferences();
  }, []);

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const newPrefs = { ...preferences, [key]: value };
      setPreferences(newPrefs);
      await notificationService.updatePreferences({ [key]: value });
    } catch (error) {
      // Revert on error
      setPreferences(preferences);
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Notification Settings',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* System Permission Warning */}
        {!systemEnabled && (
          <Pressable
            style={[styles.warningCard, { backgroundColor: colors.warning + '20' }]}
            onPress={handleOpenSettings}
          >
            <Bell size={24} color={colors.warning} />
            <View style={styles.warningContent}>
              <Text style={[styles.warningTitle, { color: colors.text }]}>
                Notifications Disabled
              </Text>
              <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                Tap to open settings and enable notifications
              </Text>
            </View>
          </Pressable>
        )}

        {/* Push Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Push Notifications
          </Text>

          <View style={styles.settingRow}>
            <Package size={20} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Order Updates
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Get notified about your order status
              </Text>
            </View>
            <Toggle
              value={preferences.orderUpdates}
              onValueChange={(value) => handleToggle('orderUpdates', value)}
              disabled={!systemEnabled}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Tag size={20} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Offers & Promotions
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Deals, discounts, and special offers
              </Text>
            </View>
            <Toggle
              value={preferences.promotions}
              onValueChange={(value) => handleToggle('promotions', value)}
              disabled={!systemEnabled}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Reminders
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Rate orders and reorder reminders
              </Text>
            </View>
            <Toggle
              value={preferences.reminders}
              onValueChange={(value) => handleToggle('reminders', value)}
              disabled={!systemEnabled}
            />
          </View>
        </View>

        {/* Other Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Other Notifications
          </Text>

          <View style={styles.settingRow}>
            <Mail size={20} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Email Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Order confirmations and receipts
              </Text>
            </View>
            <Toggle
              value={preferences.email}
              onValueChange={(value) => handleToggle('email', value)}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <MessageSquare size={20} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                SMS Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Order updates via text message
              </Text>
            </View>
            <Toggle
              value={preferences.sms}
              onValueChange={(value) => handleToggle('sms', value)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  warningCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  warningText: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.overline,
    marginBottom: SPACING.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...TYPOGRAPHY.bodyMedium,
  },
  settingDescription: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.lg,
  },
});
```

---

## 🔔 Notification Badge Component

```typescript
// src/components/ui/NotificationBadge.tsx

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';
import { TYPOGRAPHY } from '@/constants';

function NotificationBadgeBase() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push('/notifications')}
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      accessibilityRole="button"
      hitSlop={12}
    >
      <Bell size={24} color={colors.text} />
      {unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.error }]}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    ...TYPOGRAPHY.overline,
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export const NotificationBadge = memo(NotificationBadgeBase);
```

---

## ✅ Push Notifications Checklist

```markdown
### Setup
- [ ] expo-notifications installed
- [ ] Android notification channels configured
- [ ] Firebase project created (for FCM)
- [ ] google-services.json added (Android)
- [ ] GoogleService-Info.plist added (iOS)
- [ ] EAS build configured for push notifications

### Permissions
- [ ] Permission request flow implemented
- [ ] Handle permission denied gracefully
- [ ] Link to system settings when denied

### Token Management
- [ ] Get Expo push token on app start
- [ ] Send token to backend
- [ ] Handle token refresh
- [ ] Remove token on logout

### Notification Handling
- [ ] Foreground notification handler
- [ ] Background/killed notification handler
- [ ] Notification tap handler with deep linking
- [ ] Badge count management

### Features
- [ ] Notification list screen
- [ ] Mark as read functionality
- [ ] Notification preferences screen
- [ ] Local notification scheduling

### Testing
- [ ] Test on physical devices (required)
- [ ] Test foreground notifications
- [ ] Test background notifications
- [ ] Test deep linking from notifications
- [ ] Test on both iOS and Android
```
