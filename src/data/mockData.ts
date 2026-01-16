/**
 * GRIHGO Customer App - Mock Data
 * Shared data across the application
 */

import { Restaurant, MenuItem } from '../types';

export const RESTAURANTS: Restaurant[] = [
    {
        id: '1',
        name: 'Paradise Biryani',
        image: require('../assets/images/restaurant/paradise_biryani.png'),
        rating: 4.3,
        reviewCount: 1250,
        cuisines: ['Biryani', 'Hyderabadi', 'North Indian'],
        deliveryTime: '25-30 min',
        distance: '2.5 km',
        priceForTwo: 400,
        isVerified: true,
        offer: { text: '50% OFF up to ₹100', color: '#E67E22' },
    },
    {
        id: '2',
        name: 'Domino\'s Pizza',
        image: require('../assets/images/restaurant/dominos.png'),
        rating: 4.1,
        reviewCount: 3200,
        cuisines: ['Pizza', 'Italian', 'Fast Food'],
        deliveryTime: '20-25 min',
        distance: '1.8 km',
        priceForTwo: 350,
        isVerified: true,
        offer: { text: 'Buy 1 Get 1 Free', color: '#2ECC71' },
    },
    {
        id: '3',
        name: 'Burger King',
        image: require('../assets/images/restaurant/burger_king.png'),
        rating: 4.0,
        reviewCount: 890,
        cuisines: ['Burgers', 'American', 'Fast Food'],
        deliveryTime: '15-20 min',
        distance: '1.2 km',
        priceForTwo: 300,
        isVerified: true,
    },
    {
        id: '4',
        name: 'Saravana Bhavan',
        image: require('../assets/images/restaurant/saravana_bhavan.png'),
        rating: 4.5,
        reviewCount: 2100,
        cuisines: ['South Indian', 'Vegetarian', 'Dosa'],
        deliveryTime: '30-35 min',
        distance: '3.0 km',
        priceForTwo: 250,
        isVerified: true,
        offer: { text: '20% OFF', color: '#3498DB' },
    },
    {
        id: '5',
        name: 'Pizza Hut',
        image: require('../assets/images/restaurant/pizza_hut.png'),
        rating: 3.9,
        reviewCount: 1500,
        cuisines: ['Pizza', 'Fast Food', 'Italian'],
        deliveryTime: '35-40 min',
        distance: '3.5 km',
        priceForTwo: 450,
        isVerified: true,
        offer: { text: 'Free Choco Lava Cake', color: '#E74C3C' },
    },
    {
        id: '6',
        name: 'KFC',
        image: require('../assets/images/restaurant/kfc.png'),
        rating: 4.2,
        reviewCount: 2800,
        cuisines: ['Burger', 'Fast Food', 'American'],
        deliveryTime: '25-30 min',
        distance: '2.0 km',
        priceForTwo: 500,
        isVerified: true,
    },
    {
        id: '7',
        name: 'Subway',
        image: require('../assets/images/restaurant/subway.png'),
        rating: 4.4,
        reviewCount: 950,
        cuisines: ['Healthy', 'Sandwiches', 'Salads'],
        deliveryTime: '15-20 min',
        distance: '1.0 km',
        priceForTwo: 300,
        isVerified: true,
        offer: { text: 'Flat ₹100 OFF', color: '#27AE60' },
    },
    {
        id: '8',
        name: 'Chinese Wok',
        image: require('../assets/images/cuisine/noodles.png'),
        rating: 4.1,
        reviewCount: 650,
        cuisines: ['Chinese', 'Asian', 'Noodles'],
        deliveryTime: '40-45 min',
        distance: '4.2 km',
        priceForTwo: 350,
        isVerified: true,
    }
];

// Expanded menu items to cover multiple restaurants for "More from restaurant" logic
export const ALL_MENU_ITEMS: Record<string, MenuItem[]> = {
    '1': [ // Paradise Biryani
        {
            id: '101',
            name: 'Royal Chicken Biryani',
            description: 'Authentic Hyderabadi biryani with tender chicken pieces, saffron, and aromatic spices.',
            price: 299,
            image: require('../assets/images/cuisine/biryani.png'),
            isVeg: false,
            rating: 4.5,
            votes: 120,
            categoryId: 'recommended',
        },
        {
            id: '102',
            name: 'Paneer 65',
            description: 'Spicy and crispy fried cottage cheese cubes tossed in curry leaves and chilies.',
            price: 249,
            image: require('../assets/images/cuisine/biryani.png'),
            isVeg: true,
            rating: 4.2,
            votes: 85,
            isBestseller: true,
            categoryId: 'starters',
        },
        {
            id: '103',
            name: 'Mutton Biryani',
            description: 'Flavorful aromatic rice layered with succulent mutton pieces.',
            price: 399,
            image: require('../assets/images/cuisine/biryani.png'),
            isVeg: false,
            rating: 4.6,
            votes: 200,
            categoryId: 'recommended',
        },
        {
            id: '104',
            name: 'Butter Naan',
            description: 'Soft and fluffy leavened bread baked in a clay oven, topped with butter.',
            price: 45,
            image: require('../assets/images/cuisine/biryani.png'), // Placeholder
            isVeg: true,
            rating: 4.3,
            votes: 320,
            categoryId: 'breads',
        },
        {
            id: '105',
            name: 'Chicken Curry',
            description: 'Classic chicken curry cooked with indian spices and herbs.',
            price: 280,
            image: require('../assets/images/cuisine/biryani.png'), // Placeholder
            isVeg: false,
            rating: 4.1,
            votes: 150,
            categoryId: 'mains',
        },
        {
            id: '106',
            name: 'Gulab Jamun',
            description: 'Deep-fried milk solids soaked in sugar syrup. A classic Indian dessert.',
            price: 90,
            image: require('../assets/images/cuisine/biryani.png'), // Placeholder
            isVeg: true,
            rating: 4.8,
            votes: 500,
            categoryId: 'desserts',
            isBestseller: true,
        },
        {
            id: '107',
            name: 'Tandoori Roti',
            description: 'Whole wheat bread baked in a clay oven.',
            price: 30,
            image: require('../assets/images/cuisine/biryani.png'), // Placeholder
            isVeg: true,
            rating: 4.0,
            votes: 200,
            categoryId: 'breads',
        },
    ],
    '2': [ // Domino's
        {
            id: '201',
            name: 'Farmhouse Pizza',
            description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom.',
            price: 459,
            image: require('../assets/images/cuisine/pizza.png'),
            isVeg: true,
            rating: 4.4,
            votes: 300,
            isBestseller: true,
            categoryId: 'recommended',
        },
        {
            id: '202',
            name: 'Peppy Paneer',
            description: 'Chunky paneer with crisp capsicum and spicy red pepper.',
            price: 399,
            image: require('../assets/images/cuisine/pizza.png'),
            isVeg: true,
            rating: 4.3,
            votes: 150,
            categoryId: 'recommended',
        },
    ],
    '3': [ // Burger King
        {
            id: '301',
            name: 'Whopper',
            description: 'Signature flame-grilled beef patty topped with tomatoes, lettuce, mayo, ketchup, pickles, and onions.',
            price: 199,
            image: require('../assets/images/cuisine/burger.png'),
            isVeg: false,
            rating: 4.5,
            votes: 500,
            isBestseller: true,
            categoryId: 'recommended',
        },
    ]
};

// Default items if restaurant not found
export const MENU_ITEMS: MenuItem[] = ALL_MENU_ITEMS['1'];

// ============================================
// FAVORITE DISHES - For Favorites Screen
// ============================================
export interface FavoriteDish {
    id: string;
    name: string;
    restaurantId: string;
    restaurantName: string;
    price: number;
    image: any;
    isVeg: boolean;
    rating: number;
}

export const FAVORITE_DISHES: FavoriteDish[] = [
    {
        id: '101',
        name: 'Royal Chicken Biryani',
        restaurantId: '1',
        restaurantName: 'Paradise Biryani',
        price: 299,
        image: require('../assets/images/cuisine/biryani.png'),
        isVeg: false,
        rating: 4.5,
    },
    {
        id: '201',
        name: 'Farmhouse Pizza',
        restaurantId: '2',
        restaurantName: "Domino's Pizza",
        price: 459,
        image: require('../assets/images/cuisine/pizza.png'),
        isVeg: true,
        rating: 4.4,
    },
    {
        id: '301',
        name: 'Whopper',
        restaurantId: '3',
        restaurantName: 'Burger King',
        price: 199,
        image: require('../assets/images/cuisine/burger.png'),
        isVeg: false,
        rating: 4.5,
    },
];

// ============================================
// OFFERS - For Offers Screen and Favorites
// ============================================
export interface Offer {
    id: string;
    title: string;
    description: string;
    code: string;
    discount: string;
    minOrder: number;
    maxDiscount: number;
    validTill: string;
    restaurantIds?: string[]; // Empty means all restaurants
    backgroundColor: string;
    emoji: string;
}

export const OFFERS: Offer[] = [
    {
        id: 'offer1',
        title: 'First Order Special',
        description: 'Get 50% off on your first order',
        code: 'FIRST50',
        discount: '50%',
        minOrder: 199,
        maxDiscount: 100,
        validTill: '2026-02-28',
        backgroundColor: '#E67E22',
        emoji: '🎉',
    },
    {
        id: 'offer2',
        title: 'Weekend Feast',
        description: 'Flat ₹75 off on orders above ₹299',
        code: 'WEEKEND75',
        discount: '₹75',
        minOrder: 299,
        maxDiscount: 75,
        validTill: '2026-01-31',
        backgroundColor: '#9B59B6',
        emoji: '🍕',
    },
    {
        id: 'offer3',
        title: 'Tasty Savings',
        description: 'Get ₹100 off on orders above ₹399',
        code: 'TASTY100',
        discount: '₹100',
        minOrder: 399,
        maxDiscount: 100,
        validTill: '2026-03-15',
        backgroundColor: '#2ECC71',
        emoji: '😋',
    },
    {
        id: 'offer4',
        title: 'Free Delivery',
        description: 'Free delivery on all orders above ₹149',
        code: 'FREEDELIVERY',
        discount: 'Free Delivery',
        minOrder: 149,
        maxDiscount: 40,
        validTill: '2026-02-15',
        backgroundColor: '#3498DB',
        emoji: '🚀',
    },
];

// ============================================
// PAST ORDERS - For Reorder and Order History
// ============================================
export interface PastOrder {
    id: string;
    restaurantId: string;
    restaurantName: string;
    restaurantImage: any;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: 'delivered' | 'cancelled' | 'refunded';
    orderDate: string;
    deliveryAddress: string;
    paymentMethod: string;
    rating?: number;
}

export const PAST_ORDERS: PastOrder[] = [
    {
        id: 'ORD001',
        restaurantId: '1',
        restaurantName: 'Paradise Biryani',
        restaurantImage: require('../assets/images/restaurant/paradise_biryani.png'),
        items: [
            { name: 'Chicken Biryani', quantity: 2, price: 299 },
            { name: 'Raita', quantity: 1, price: 49 },
            { name: 'Mirchi Ka Salan', quantity: 1, price: 79 },
        ],
        totalAmount: 726,
        status: 'delivered',
        orderDate: '2026-01-14T18:30:00',
        deliveryAddress: '123 Main Street, Koramangala',
        paymentMethod: 'UPI',
        rating: 5,
    },
    {
        id: 'ORD002',
        restaurantId: '2',
        restaurantName: "Domino's Pizza",
        restaurantImage: require('../assets/images/restaurant/dominos.png'),
        items: [
            { name: 'Margherita Pizza', quantity: 1, price: 299 },
            { name: 'Garlic Breadsticks', quantity: 1, price: 149 },
        ],
        totalAmount: 448,
        status: 'delivered',
        orderDate: '2026-01-10T20:15:00',
        deliveryAddress: '123 Main Street, Koramangala',
        paymentMethod: 'Card',
        rating: 4,
    },
    {
        id: 'ORD003',
        restaurantId: '3',
        restaurantName: 'Burger King',
        restaurantImage: require('../assets/images/restaurant/burger_king.png'),
        items: [
            { name: 'Whopper Combo', quantity: 1, price: 249 },
            { name: 'Pepsi', quantity: 1, price: 49 },
        ],
        totalAmount: 298,
        status: 'delivered',
        orderDate: '2026-01-05T13:00:00',
        deliveryAddress: '456 Tech Park, Whitefield',
        paymentMethod: 'Cash',
    },
    {
        id: 'ORD004',
        restaurantId: '4',
        restaurantName: 'Saravana Bhavan',
        restaurantImage: require('../assets/images/restaurant/saravana_bhavan.png'),
        items: [
            { name: 'Masala Dosa', quantity: 2, price: 120 },
            { name: 'Filter Coffee', quantity: 2, price: 40 },
        ],
        totalAmount: 320,
        status: 'delivered',
        orderDate: '2025-12-28T09:00:00',
        deliveryAddress: '123 Main Street, Koramangala',
        paymentMethod: 'UPI',
        rating: 5,
    },
];

// ============================================
// CUISINES - For Home Screen Quick Actions
// ============================================
export interface Cuisine {
    id: string;
    name: string;
    image: any;
    color: string;
}

export const CUISINES: Cuisine[] = [
    { id: 'biryani', name: 'Biryani', image: require('../assets/images/cuisine/biryani.png'), color: '#F39C12' },
    { id: 'pizza', name: 'Pizza', image: require('../assets/images/cuisine/pizza.png'), color: '#E74C3C' },
    { id: 'burger', name: 'Burger', image: require('../assets/images/cuisine/burger.png'), color: '#9B59B6' },
    { id: 'chinese', name: 'Chinese', image: require('../assets/images/cuisine/noodles.png'), color: '#3498DB' },
    { id: 'southindian', name: 'South Indian', image: require('../assets/images/cuisine/thali.png'), color: '#27AE60' },
    { id: 'desserts', name: 'Desserts', image: require('../assets/images/cuisine/dessert.png'), color: '#E91E63' },
];

// ============================================
// NOTIFICATIONS - For Notifications Screen
// ============================================
export interface AppNotification {
    id: string;
    type: 'order' | 'offer' | 'general' | 'rating';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    image?: any;
}

export const NOTIFICATIONS: AppNotification[] = [
    {
        id: 'notif1',
        type: 'order',
        title: 'Order Delivered!',
        message: 'Your order from Paradise Biryani has been delivered. Enjoy your meal!',
        timestamp: '2026-01-14T19:00:00',
        isRead: false,
    },
    {
        id: 'notif2',
        type: 'offer',
        title: 'Weekend Special!',
        message: 'Get 50% OFF on all pizzas this weekend. Use code WEEKEND50',
        timestamp: '2026-01-13T10:00:00',
        isRead: true,
    },
    {
        id: 'notif3',
        type: 'rating',
        title: 'Rate your order',
        message: "How was your order from Domino's Pizza? Tap to rate.",
        timestamp: '2026-01-10T21:00:00',
        isRead: true,
    },
    {
        id: 'notif4',
        type: 'general',
        title: 'New restaurants near you',
        message: '5 new restaurants have joined GRIHGO in your area!',
        timestamp: '2026-01-08T15:30:00',
        isRead: true,
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get restaurant by ID
 */
export function getRestaurantById(id: string): Restaurant | undefined {
    return RESTAURANTS.find(r => r.id === id);
}

/**
 * Get menu items for a restaurant
 */
export function getMenuItemsForRestaurant(restaurantId: string): MenuItem[] {
    return ALL_MENU_ITEMS[restaurantId] || MENU_ITEMS;
}

/**
 * Get past orders (simulates API delay)
 */
export async function fetchPastOrders(): Promise<PastOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return PAST_ORDERS;
}

/**
 * Get active offers
 */
export function getActiveOffers(): Offer[] {
    const now = new Date();
    return OFFERS.filter(offer => new Date(offer.validTill) > now);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}
