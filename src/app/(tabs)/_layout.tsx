import { Tabs } from 'expo-router';
import { Home, Search, Clock, Heart, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY } from '../../constants';

export default function TabsLayout() {
    const { colors, isDark } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    ...TYPOGRAPHY.captionSmall,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused }) => (
                        <Search size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="reorder"
                options={{
                    title: 'Reorder',
                    tabBarIcon: ({ color, focused }) => (
                        <Clock size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, focused }) => (
                        <Heart size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
        </Tabs>
    );
}
