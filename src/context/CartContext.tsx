/**
 * GRIHGO Customer App - Cart Context
 * Manages shopping cart state
 */

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
} from 'react';

import { CartItem, Restaurant } from '../types';
export { CartItem } from '../types';
import { formatCurrency } from '../utils';

export interface CartContextType {
    items: CartItem[];
    restaurant: Restaurant | null;
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    tip: number;
    discount: number;
    total: number;
    couponCode: string | null;
    addItem: (item: Omit<CartItem, 'id'>, restaurant: Restaurant) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    setTip: (amount: number) => void;
    applyCoupon: (code: string) => Promise<boolean>;
    removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

const DELIVERY_FEE = 30;
const TAX_RATE = 0.05; // 5% GST

export function CartProvider({ children }: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [tip, setTipAmount] = useState(0);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);

    // DEBUG: Log cart state changes
    console.log('[CartContext] Current state:', {
        itemsCount: items?.length ?? 'undefined',
        items: items,
        restaurant: restaurant?.name ?? 'null',
    });

    // Add item to cart
    const addItem = (item: Omit<CartItem, 'id'>, itemRestaurant: Restaurant) => {
        console.log('[CartContext] addItem called with:', {
            item: item,
            itemRestaurant: itemRestaurant?.name,
        });

        // Check if from different restaurant
        if (restaurant && restaurant.id !== itemRestaurant.id) {
            console.log('[CartContext] Different restaurant, clearing cart');
            // Clear cart if different restaurant
            setItems([]);
        }

        setRestaurant(itemRestaurant);

        setItems((prevItems) => {
            // Check if item already exists
            const existingIndex = prevItems.findIndex(
                (i) => i.menuItemId === item.menuItemId
            );

            if (existingIndex >= 0) {
                // Update quantity
                const newItems = [...prevItems];
                newItems[existingIndex].quantity += item.quantity;
                return newItems;
            }

            // Add new item
            return [...prevItems, { ...item, id: `cart_${Date.now()}` }];
        });
    };

    // Update item quantity
    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    // Remove item from cart
    const removeItem = (itemId: string) => {
        setItems((prevItems) => {
            const newItems = prevItems.filter((item) => item.id !== itemId);
            if (newItems.length === 0) {
                setRestaurant(null);
            }
            return newItems;
        });
    };

    // Clear entire cart
    const clearCart = () => {
        setItems([]);
        setRestaurant(null);
        setTipAmount(0);
        setCouponCode(null);
        setDiscount(0);
    };

    // Set tip amount
    const setTip = (amount: number) => {
        setTipAmount(amount);
    };

    // Apply coupon code
    const applyCoupon = async (code: string): Promise<boolean> => {
        // TODO: Validate with backend
        // Mock validation
        const validCoupons: Record<string, number> = {
            FIRST50: 50,
            TASTY50: 100,
            WEEKEND75: 75,
        };

        if (validCoupons[code.toUpperCase()]) {
            setCouponCode(code.toUpperCase());
            setDiscount(validCoupons[code.toUpperCase()]);
            return true;
        }

        return false;
    };

    // Remove coupon
    const removeCoupon = () => {
        setCouponCode(null);
        setDiscount(0);
    };

    // Calculate totals
    const calculations = useMemo(() => {
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
        const taxes = Math.round(subtotal * TAX_RATE);
        const total = Math.max(0, subtotal + deliveryFee + taxes + tip - discount);

        return { itemCount, subtotal, deliveryFee, taxes, total };
    }, [items, tip, discount]);

    const value = useMemo(
        () => ({
            items,
            restaurant,
            itemCount: calculations.itemCount,
            subtotal: calculations.subtotal,
            deliveryFee: calculations.deliveryFee,
            taxes: calculations.taxes,
            tip,
            discount,
            total: calculations.total,
            couponCode,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            setTip,
            applyCoupon,
            removeCoupon,
        }),
        [items, restaurant, calculations, tip, discount, couponCode]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
