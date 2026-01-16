/**
 * GRIHGO Customer App - Auth Context
 * Manages authentication state and user session
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@grihgo_auth';
const USER_STORAGE_KEY = '@grihgo_user';
const ONBOARDING_KEY = '@grihgo_onboarding_complete';

export interface User {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    hasCompletedOnboarding: boolean;
    user: User | null;
}

interface AuthContextType extends AuthState {
    login: (phone: string, otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Load auth state on mount
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const [authToken, userData, onboardingComplete] = await Promise.all([
                    AsyncStorage.getItem(AUTH_STORAGE_KEY),
                    AsyncStorage.getItem(USER_STORAGE_KEY),
                    AsyncStorage.getItem(ONBOARDING_KEY),
                ]);

                if (authToken && userData) {
                    setIsAuthenticated(true);
                    setUser(JSON.parse(userData));
                }

                setHasCompletedOnboarding(onboardingComplete === 'true');
            } catch (error) {
                console.warn('Failed to load auth state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthState();
    }, []);

    // Login function
    const login = async (phone: string, otp: string): Promise<boolean> => {
        try {
            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock verification (in production, verify with backend)
            if (otp.length === 6) {
                const mockUser: User = {
                    id: 'user_' + Date.now(),
                    name: 'Rahul Sharma',
                    phone: phone,
                    email: 'rahul@example.com',
                };

                // Save to storage
                await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'mock_token_' + Date.now());
                await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));

                setUser(mockUser);
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Update user profile
    const updateUser = async (userData: Partial<User>): Promise<void> => {
        try {
            if (user) {
                const updatedUser = { ...user, ...userData };
                await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    // Mark onboarding as complete
    const completeOnboarding = async (): Promise<void> => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            setHasCompletedOnboarding(true);
        } catch (error) {
            console.error('Failed to save onboarding state:', error);
        }
    };

    const value = useMemo(
        () => ({
            isAuthenticated,
            isLoading,
            hasCompletedOnboarding,
            user,
            login,
            logout,
            updateUser,
            completeOnboarding,
        }),
        [isAuthenticated, isLoading, hasCompletedOnboarding, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
