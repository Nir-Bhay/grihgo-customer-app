/**
 * Shared Type Definitions
 */

export interface Restaurant {
    id: string;
    name: string;
    image: any;
    rating: number;
    reviewCount: number;
    cuisines: string[];
    deliveryTime: string;
    priceForTwo: number;
    distance?: string;
    isVeg?: boolean;
    isVerified?: boolean;
    offer?: {
        text: string;
        color?: string;
        code?: string;
    };
    isFavorite?: boolean;
    backgroundColor?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    isVeg: boolean;
    isBestseller?: boolean;
    rating?: number;
    ratingCount?: number;
    image?: any;
    categoryId: string;
    votes?: number; // Added for compatibility
}

export interface CartItem {
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image?: any; // Added for UI display
    isVeg?: boolean;
    customizations?: string[];
}

export interface User {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    savedAddresses: Address[];
}

export interface Address {
    id: string;
    type: 'Home' | 'Work' | 'Other';
    address: string;
    landmark?: string;
    isDefault: boolean;
    label?: string;
}

export interface Order {
    id: string;
    restaurantId: string;
    restaurantName: string;
    items: CartItem[];
    total: number;
    status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    createdAt: string;
}
