# 03 - BACKEND API REPORT
## GRIHGO Customer App - API Requirements & Integration Plan

**Report Date:** January 14, 2026
**Analyzed By:** Backend Integration Specialist
**Language:** Technical English + Hindi Mix
**API Version:** v1 (Planned)

---

## 📋 Executive Summary

Ye report GRIHGO Customer App ke liye **complete backend API requirements** define karta hai. Currently **frontend 100% mock data par chal raha hai**, aur **koi bhi backend integration nahi hai**. Is report mein humne **50+ API endpoints** identify kiye hain jo app ko functional banane ke liye zaroori hain.

### API Integration Status

```
🔴 CURRENT STATE: 0% Backend Integration

Mock Data Locations:
├─ src/data/mockData.ts          (Restaurants, Menu Items)
├─ CartContext.tsx                (Coupon validation)
├─ checkout.tsx                   (Addresses, Payment Methods)
└─ All screens                    (Hardcoded user data)

Required: Complete REST API + WebSocket/SSE for real-time features
```

### Critical API Categories

| Category | Endpoints | Priority | Status |
|----------|-----------|----------|--------|
| **Authentication** | 6 | P0 (Critical) | ❌ Not Started |
| **User Management** | 8 | P0 | ❌ Not Started |
| **Restaurant & Menu** | 12 | P0 | ❌ Not Started |
| **Cart & Orders** | 10 | P0 | ❌ Not Started |
| **Payment** | 6 | P0 | ❌ Not Started |
| **Real-time Tracking** | 4 | P0 | ❌ Not Started |
| **Search & Filters** | 5 | P1 | ❌ Not Started |
| **Offers & Coupons** | 4 | P1 | ❌ Not Started |
| **Ratings & Reviews** | 6 | P1 | ❌ Not Started |
| **Notifications** | 3 | P1 | ❌ Not Started |
| **Analytics** | 4 | P2 | ❌ Not Started |
| **TOTAL** | **68 Endpoints** | - | **0% Done** |

---

## 🔐 1. AUTHENTICATION APIs (Priority: P0)

### 1.1 Phone Number Login & OTP

#### POST `/api/v1/auth/send-otp`
**Purpose:** Send OTP to user's phone number

**Request:**
```json
{
  "phoneNumber": "+919876543210",
  "countryCode": "+91"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "otp_abc123",
  "expiresIn": 300,
  "resendAfter": 60
}
```

**Error Responses:**
- 400: Invalid phone number
- 429: Too many requests (rate limiting)
- 500: Failed to send SMS

**Frontend Integration:**
- File: `src/app/(auth)/login.tsx`
- Line: 45-60 (handleContinue function)
- Current: Mock delay, always succeeds
- Required: Call this API, handle errors

---

#### POST `/api/v1/auth/verify-otp`
**Purpose:** Verify OTP and return auth token

**Request:**
```json
{
  "otpId": "otp_abc123",
  "otp": "123456",
  "phoneNumber": "+919876543210"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_xyz789",
  "user": {
    "id": "user_123",
    "phoneNumber": "+919876543210",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "isNewUser": false
  }
}
```

**Response (New User):**
```json
{
  "success": true,
  "token": "...",
  "user": {
    "id": "user_123",
    "phoneNumber": "+919876543210",
    "isNewUser": true
  },
  "nextStep": "COMPLETE_PROFILE"
}
```

**Error Responses:**
- 400: Invalid OTP
- 401: OTP expired
- 404: OTP ID not found

**Frontend Integration:**
- File: `src/app/(auth)/otp.tsx`
- Line: 55-65 (handleVerify function)
- Current: Mock login from AuthContext
- Required: Call API, store token, handle new user flow

---

#### POST `/api/v1/auth/resend-otp`
**Request:**
```json
{
  "otpId": "otp_abc123",
  "phoneNumber": "+919876543210"
}
```

**Frontend Integration:**
- File: `src/app/(auth)/otp.tsx`
- Line: Timer logic for resend button

---

### 1.2 Social Login

#### POST `/api/v1/auth/google`
**Purpose:** Authenticate with Google

**Request:**
```json
{
  "idToken": "google_id_token_here",
  "provider": "google"
}
```

**Response:** Same as verify-otp (returns token + user)

**Frontend Integration:**
- File: `src/app/(auth)/login.tsx`
- Google Sign-In button (currently placeholder)

---

#### POST `/api/v1/auth/apple`
**Purpose:** Authenticate with Apple

**Request:**
```json
{
  "identityToken": "apple_identity_token",
  "authorizationCode": "apple_auth_code",
  "user": {
    "name": "John Doe",
    "email": "john@privaterelay.appleid.com"
  }
}
```

---

### 1.3 Token Management

#### POST `/api/v1/auth/refresh`
**Purpose:** Refresh expired access token

**Request:**
```json
{
  "refreshToken": "refresh_xyz789"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

**Implementation:** Automatic token refresh in axios interceptor

---

#### POST `/api/v1/auth/logout`
**Purpose:** Invalidate tokens

**Request:** (Auth header with token)

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend Integration:**
- File: `src/app/(tabs)/profile.tsx`
- Logout button in profile screen

---

## 👤 2. USER MANAGEMENT APIs (Priority: P0)

### 2.1 User Profile

#### GET `/api/v1/user/profile`
**Purpose:** Get user profile data

**Response:**
```json
{
  "id": "user_123",
  "phoneNumber": "+919876543210",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "profileImage": "https://cdn.grihgo.com/users/123.jpg",
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "createdAt": "2025-01-01T00:00:00Z",
  "stats": {
    "totalOrders": 45,
    "totalSpent": 15600,
    "loyaltyPoints": 560
  }
}
```

**Frontend Integration:**
- File: `src/app/(tabs)/profile.tsx`
- Currently shows hardcoded "Rahul"
- Required: Fetch real user data

---

#### PUT `/api/v1/user/profile`
**Purpose:** Update user profile

**Request:**
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "dateOfBirth": "1995-05-15",
  "gender": "male"
}
```

**Frontend Integration:**
- New screen needed: Edit Profile

---

#### POST `/api/v1/user/profile/image`
**Purpose:** Upload profile picture

**Request:** Multipart form-data with image file

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://cdn.grihgo.com/users/123.jpg"
}
```

---

### 2.2 Address Management

#### GET `/api/v1/user/addresses`
**Purpose:** Get all saved addresses

**Response:**
```json
{
  "addresses": [
    {
      "id": "addr_1",
      "type": "HOME",
      "label": "Home",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "landmark": "Near Cafe Coffee Day",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560034",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "isDefault": true
    },
    {
      "id": "addr_2",
      "type": "WORK",
      "label": "Work",
      "addressLine1": "456 Tech Park",
      "addressLine2": "Building 5, Floor 3",
      "city": "Bangalore",
      "pincode": "560066",
      "latitude": 12.9698,
      "longitude": 77.7500,
      "isDefault": false
    }
  ]
}
```

**Frontend Integration:**
- File: `src/app/cart/checkout.tsx`
- Line: 22-37 (Currently hardcoded ADDRESSES array)
- Required: Fetch from API, show in checkout

---

#### POST `/api/v1/user/addresses`
**Purpose:** Add new address

**Request:**
```json
{
  "type": "HOME",
  "label": "Home",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "landmark": "Near Cafe Coffee Day",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560034",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "address": { /* full address object */ }
}
```

**Frontend Integration:**
- New screen needed: Add/Edit Address form with map

---

#### PUT `/api/v1/user/addresses/:id`
**Purpose:** Update existing address

---

#### DELETE `/api/v1/user/addresses/:id`
**Purpose:** Delete address

---

#### PUT `/api/v1/user/addresses/:id/default`
**Purpose:** Set address as default

**Request:** Empty body

**Response:**
```json
{
  "success": true,
  "message": "Default address updated"
}
```

---

### 2.3 Payment Methods

#### GET `/api/v1/user/payment-methods`
**Purpose:** Get saved payment methods

**Response:**
```json
{
  "methods": [
    {
      "id": "pm_1",
      "type": "CARD",
      "cardLast4": "4242",
      "cardBrand": "visa",
      "cardExpiry": "12/26",
      "isDefault": true
    },
    {
      "id": "pm_2",
      "type": "UPI",
      "upiId": "rahul@paytm",
      "isDefault": false
    }
  ],
  "wallet": {
    "balance": 150.00,
    "currency": "INR"
  }
}
```

**Frontend Integration:**
- File: `src/app/cart/checkout.tsx`
- Line: 39-44 (Currently hardcoded PAYMENT_METHODS)
- Wallet screen (missing)

---

#### POST `/api/v1/user/payment-methods`
**Purpose:** Add new payment method

---

#### DELETE `/api/v1/user/payment-methods/:id`
**Purpose:** Remove payment method

---

## 🍽️ 3. RESTAURANT & MENU APIs (Priority: P0)

### 3.1 Restaurant Discovery

#### GET `/api/v1/restaurants`
**Purpose:** Get list of restaurants (with filters, pagination)

**Query Parameters:**
- `latitude` (required): 12.9716
- `longitude` (required): 77.5946
- `cuisine`: "Italian,Chinese" (comma-separated)
- `priceRange`: "1,2,3,4" (1=Budget, 4=Premium)
- `rating`: 4.0 (minimum rating)
- `deliveryTime`: 30 (max delivery time in minutes)
- `sort`: "rating" | "deliveryTime" | "costForTwo" | "popularity"
- `page`: 1
- `limit`: 20
- `search`: "Pizza"

**Response:**
```json
{
  "restaurants": [
    {
      "id": "rest_123",
      "name": "Domino's Pizza",
      "cuisines": ["Pizza", "Italian", "Fast Food"],
      "rating": 4.3,
      "reviewCount": 2500,
      "deliveryTime": "25-30 mins",
      "costForTwo": 400,
      "image": "https://cdn.grihgo.com/restaurants/123.jpg",
      "isOpen": true,
      "distance": 2.5,
      "offer": {
        "text": "50% OFF up to ₹100",
        "code": "FIRST50"
      },
      "badges": ["Fast Delivery", "Bestseller"],
      "isPureVeg": false,
      "location": {
        "area": "Koramangala",
        "city": "Bangalore"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  },
  "filters": {
    "availableCuisines": ["Italian", "Chinese", "Indian", ...],
    "priceRanges": [1, 2, 3, 4],
    "maxDeliveryTime": 60
  }
}
```

**Frontend Integration:**
- File: `src/data/mockData.ts` (Currently RESTAURANTS array)
- Used in: Home screen, Search screen
- Required: Replace mock data with API calls

---

#### GET `/api/v1/restaurants/popular`
**Purpose:** Get popular/trending restaurants

**Query Parameters:**
- `latitude`, `longitude` (required)
- `limit`: 10

**Frontend Integration:**
- File: `src/components/sections/RestaurantList.tsx`
- "For You ⭐" section on home screen

---

#### GET `/api/v1/restaurants/:id`
**Purpose:** Get restaurant details

**Response:**
```json
{
  "id": "rest_123",
  "name": "Domino's Pizza",
  "cuisines": ["Pizza", "Italian", "Fast Food"],
  "rating": 4.3,
  "reviewCount": 2500,
  "deliveryTime": "25-30 mins",
  "costForTwo": 400,
  "images": [
    "https://cdn.grihgo.com/restaurants/123_1.jpg",
    "https://cdn.grihgo.com/restaurants/123_2.jpg"
  ],
  "isOpen": true,
  "openingHours": {
    "monday": "10:00 AM - 11:00 PM",
    "tuesday": "10:00 AM - 11:00 PM",
    ...
  },
  "address": {
    "full": "123 Pizza Street, Koramangala, Bangalore",
    "latitude": 12.9352,
    "longitude": 77.6245
  },
  "offer": {
    "text": "50% OFF up to ₹100",
    "code": "FIRST50",
    "minOrder": 199
  },
  "licenses": {
    "fssai": "1234567890"
  },
  "isPureVeg": false,
  "packagingCharges": 20
}
```

**Frontend Integration:**
- File: `src/app/restaurant/[id].tsx`
- Line: 48 (Currently finds from mock RESTAURANTS array)
- Required: Fetch from API based on route param

---

### 3.2 Menu APIs

#### GET `/api/v1/restaurants/:id/menu`
**Purpose:** Get restaurant menu with categories

**Response:**
```json
{
  "restaurantId": "rest_123",
  "categories": [
    {
      "id": "cat_1",
      "name": "Recommended",
      "items": [
        {
          "id": "item_abc",
          "name": "Margherita Pizza",
          "description": "Classic pizza with fresh mozzarella and basil",
          "price": 249,
          "originalPrice": 349,
          "discount": 29,
          "image": "https://cdn.grihgo.com/items/abc.jpg",
          "isVeg": true,
          "isBestseller": true,
          "rating": 4.5,
          "ratingCount": 1234,
          "servesCount": 2,
          "customizable": true,
          "customizations": [
            {
              "id": "cust_1",
              "name": "Choose Size",
              "required": true,
              "options": [
                { "id": "opt_1", "name": "Regular", "price": 0 },
                { "id": "opt_2", "name": "Medium", "price": 100 },
                { "id": "opt_3", "name": "Large", "price": 200 }
              ]
            },
            {
              "id": "cust_2",
              "name": "Add Toppings",
              "required": false,
              "multiSelect": true,
              "options": [
                { "id": "opt_4", "name": "Extra Cheese", "price": 50 },
                { "id": "opt_5", "name": "Olives", "price": 30 }
              ]
            }
          ],
          "nutritionInfo": {
            "calories": 850,
            "protein": "35g",
            "carbs": "95g",
            "fat": "35g"
          },
          "allergens": ["Gluten", "Dairy"],
          "isAvailable": true
        }
      ]
    },
    {
      "id": "cat_2",
      "name": "Starters",
      "items": [ /* ... */ ]
    }
  ]
}
```

**Frontend Integration:**
- File: `src/app/restaurant/[id].tsx`
- Line: 52 (Currently uses DEFAULT_MENU from mockData)
- Line: 32-38 (MENU_CATEGORIES not functional)
- Required: Fetch menu from API, implement category filtering

---

#### GET `/api/v1/items/:id`
**Purpose:** Get food item details

**Response:** Single item object with full details

**Frontend Integration:**
- File: `src/app/food/[id].tsx` (needs implementation)
- Food detail screen (currently incomplete)

---

### 3.3 Search

#### GET `/api/v1/search`
**Purpose:** Search restaurants and dishes

**Query Parameters:**
- `q`: "pizza" (search query)
- `type`: "all" | "restaurants" | "dishes"
- `latitude`, `longitude`
- `limit`: 20

**Response:**
```json
{
  "query": "pizza",
  "results": {
    "restaurants": [
      {
        "id": "rest_123",
        "name": "Domino's Pizza",
        "matchType": "name",
        ...
      }
    ],
    "dishes": [
      {
        "id": "item_abc",
        "name": "Margherita Pizza",
        "restaurantId": "rest_123",
        "restaurantName": "Domino's Pizza",
        "matchType": "name",
        ...
      }
    ]
  },
  "suggestions": ["Pizza Hut", "Pizza Corner", "Margherita"]
}
```

**Frontend Integration:**
- File: `src/app/(tabs)/search.tsx` (needs implementation)
- Search screen currently incomplete

---

#### GET `/api/v1/search/suggestions`
**Purpose:** Get search suggestions/autocomplete

**Query Parameters:**
- `q`: "piz" (partial query)
- `limit`: 10

**Response:**
```json
{
  "suggestions": [
    "Pizza",
    "Pizza Hut",
    "Margherita Pizza",
    "Pepperoni Pizza"
  ]
}
```

**Frontend Integration:**
- Search bar autocomplete dropdown

---

## 🛒 4. CART & ORDER APIs (Priority: P0)

### 4.1 Cart Management

**Note:** Cart can be managed client-side (Context API) or server-side. Recommendation: **Client-side for performance**, sync with backend only at checkout.

#### POST `/api/v1/cart/sync`
**Purpose:** Sync client cart with server (optional)

**Request:**
```json
{
  "items": [
    {
      "itemId": "item_abc",
      "quantity": 2,
      "customizations": [
        { "customizationId": "cust_1", "optionId": "opt_2" }
      ]
    }
  ],
  "restaurantId": "rest_123"
}
```

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [ /* items with current prices */ ],
    "subtotal": 500,
    "itemsUnavailable": [] // If any items became unavailable
  }
}
```

---

### 4.2 Order Placement

#### POST `/api/v1/orders`
**Purpose:** Create new order

**Request:**
```json
{
  "restaurantId": "rest_123",
  "items": [
    {
      "itemId": "item_abc",
      "name": "Margherita Pizza",
      "quantity": 2,
      "price": 249,
      "customizations": [
        {
          "customizationId": "cust_1",
          "name": "Choose Size",
          "optionId": "opt_2",
          "optionName": "Medium",
          "price": 100
        }
      ],
      "itemTotal": 698
    }
  ],
  "addressId": "addr_1",
  "deliveryAddress": {
    "addressLine1": "123 Main Street",
    "city": "Bangalore",
    "pincode": "560034",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "paymentMethod": "UPI",
  "paymentMethodId": "pm_2",
  "pricing": {
    "subtotal": 698,
    "deliveryFee": 30,
    "taxes": 35,
    "platformFee": 5,
    "packagingCharges": 20,
    "tip": 30,
    "discount": 100,
    "total": 718
  },
  "couponCode": "FIRST50",
  "specialInstructions": "Extra napkins please",
  "scheduledFor": null // For scheduled delivery
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xyz789",
    "orderNumber": "GH12345678",
    "status": "PLACED",
    "restaurantId": "rest_123",
    "restaurantName": "Domino's Pizza",
    "items": [ /* ... */ ],
    "pricing": { /* ... */ },
    "deliveryAddress": { /* ... */ },
    "estimatedDeliveryTime": "2026-01-14T14:30:00Z",
    "placedAt": "2026-01-14T13:45:00Z"
  },
  "payment": {
    "status": "PENDING",
    "paymentId": "pay_abc123",
    "paymentUrl": "https://razorpay.com/checkout/..." // If online payment
  }
}
```

**Frontend Integration:**
- File: `src/app/cart/checkout.tsx`
- Line: 53-65 (handlePlaceOrder function)
- Current: Mock delay, clears cart, navigates to order tracking
- Required: Call API, handle payment flow, navigate on success

---

#### GET `/api/v1/orders/:id`
**Purpose:** Get order details

**Response:**
```json
{
  "id": "order_xyz789",
  "orderNumber": "GH12345678",
  "status": "OUT_FOR_DELIVERY",
  "statusHistory": [
    { "status": "PLACED", "timestamp": "2026-01-14T13:45:00Z" },
    { "status": "CONFIRMED", "timestamp": "2026-01-14T13:47:00Z" },
    { "status": "PREPARING", "timestamp": "2026-01-14T13:50:00Z" },
    { "status": "READY", "timestamp": "2026-01-14T14:10:00Z" },
    { "status": "OUT_FOR_DELIVERY", "timestamp": "2026-01-14T14:15:00Z" }
  ],
  "restaurant": {
    "id": "rest_123",
    "name": "Domino's Pizza",
    "phone": "+919876543210",
    "address": "123 Pizza Street"
  },
  "items": [ /* ... */ ],
  "pricing": { /* ... */ },
  "deliveryAddress": { /* ... */ },
  "deliveryPartner": {
    "id": "driver_456",
    "name": "Amit Sharma",
    "phone": "+919876543211",
    "rating": 4.8,
    "vehicleNumber": "KA01AB1234",
    "photo": "https://cdn.grihgo.com/drivers/456.jpg",
    "currentLocation": {
      "latitude": 12.9350,
      "longitude": 77.6250
    }
  },
  "estimatedDeliveryTime": "2026-01-14T14:30:00Z",
  "actualDeliveryTime": null,
  "placedAt": "2026-01-14T13:45:00Z",
  "canCancel": false,
  "cancellationReason": null
}
```

**Frontend Integration:**
- File: `src/app/order/[id].tsx` (needs implementation)
- Order tracking screen - CRITICAL MISSING FEATURE

---

#### GET `/api/v1/orders`
**Purpose:** Get order history

**Query Parameters:**
- `status`: "DELIVERED" | "CANCELLED" | "ONGOING"
- `page`: 1
- `limit`: 20

**Response:**
```json
{
  "orders": [
    {
      "id": "order_xyz789",
      "orderNumber": "GH12345678",
      "status": "DELIVERED",
      "restaurantName": "Domino's Pizza",
      "restaurantImage": "...",
      "itemCount": 3,
      "total": 718,
      "placedAt": "2026-01-14T13:45:00Z",
      "deliveredAt": "2026-01-14T14:28:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

**Frontend Integration:**
- File: `src/app/(tabs)/reorder.tsx` (needs implementation)
- Order history screen

---

#### PUT `/api/v1/orders/:id/cancel`
**Purpose:** Cancel order

**Request:**
```json
{
  "reason": "Order placed by mistake"
}
```

**Response:**
```json
{
  "success": true,
  "refund": {
    "amount": 718,
    "method": "ORIGINAL",
    "estimatedTime": "3-5 business days"
  }
}
```

---

#### POST `/api/v1/orders/:id/repeat`
**Purpose:** Reorder previous order

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [ /* items added to cart */ ],
    "unavailableItems": [ /* items no longer available */ ]
  }
}
```

**Frontend Integration:**
- Reorder button in order history

---

### 4.3 Real-time Order Tracking

#### WebSocket: `wss://api.grihgo.com/v1/orders/:id/track`
**Purpose:** Real-time order status updates

**Connection:**
```javascript
const ws = new WebSocket('wss://api.grihgo.com/v1/orders/order_xyz/track');
ws.send(JSON.stringify({ token: 'auth_token' }));
```

**Message Types:**

**1. Status Update:**
```json
{
  "type": "STATUS_UPDATE",
  "orderId": "order_xyz789",
  "status": "PREPARING",
  "timestamp": "2026-01-14T13:50:00Z",
  "message": "Your order is being prepared"
}
```

**2. Driver Location Update:**
```json
{
  "type": "LOCATION_UPDATE",
  "orderId": "order_xyz789",
  "driverLocation": {
    "latitude": 12.9350,
    "longitude": 77.6250
  },
  "eta": 8,
  "distance": 1.2
}
```

**3. ETA Update:**
```json
{
  "type": "ETA_UPDATE",
  "orderId": "order_xyz789",
  "newEta": "2026-01-14T14:35:00Z",
  "reason": "Traffic delay"
}
```

**Frontend Integration:**
- File: `src/app/order/[id].tsx` (CRITICAL - needs implementation)
- Real-time map with driver location
- Live status updates
- ETA countdown

**Alternative to WebSocket:** Server-Sent Events (SSE) - simpler, one-way communication

---

## 💳 5. PAYMENT APIs (Priority: P0)

### 5.1 Payment Gateway Integration

**Recommended:** Razorpay (popular in India)

#### POST `/api/v1/payments/create`
**Purpose:** Create payment order (before checkout)

**Request:**
```json
{
  "amount": 718,
  "currency": "INR",
  "orderId": "order_xyz789"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "pay_abc123",
  "razorpayOrderId": "order_razorpay_123",
  "amount": 718,
  "currency": "INR",
  "key": "rzp_live_xxxxx" // Razorpay key for frontend
}
```

**Frontend Integration:**
- Open Razorpay checkout modal
- User completes payment
- Get payment signature and verify

---

#### POST `/api/v1/payments/verify`
**Purpose:** Verify payment signature (server-side)

**Request:**
```json
{
  "razorpayOrderId": "order_razorpay_123",
  "razorpayPaymentId": "pay_razorpay_456",
  "razorpaySignature": "signature_hash",
  "orderId": "order_xyz789"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "order": {
    "id": "order_xyz789",
    "status": "CONFIRMED",
    "paymentStatus": "PAID"
  }
}
```

---

#### POST `/api/v1/payments/refund`
**Purpose:** Initiate refund (for cancelled orders)

**Request:**
```json
{
  "orderId": "order_xyz789",
  "amount": 718,
  "reason": "Order cancelled by customer"
}
```

---

### 5.2 Wallet

#### GET `/api/v1/wallet/balance`
**Purpose:** Get wallet balance

**Response:**
```json
{
  "balance": 150.00,
  "currency": "INR"
}
```

---

#### POST `/api/v1/wallet/add-money`
**Purpose:** Add money to wallet

**Request:**
```json
{
  "amount": 500
}
```

**Response:** Razorpay payment order (same as payments/create)

---

#### GET `/api/v1/wallet/transactions`
**Purpose:** Wallet transaction history

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn_1",
      "type": "CREDIT",
      "amount": 500,
      "description": "Money added to wallet",
      "timestamp": "2026-01-14T10:00:00Z",
      "balance": 650
    },
    {
      "id": "txn_2",
      "type": "DEBIT",
      "amount": 718,
      "description": "Order #GH12345678",
      "orderId": "order_xyz789",
      "timestamp": "2026-01-14T13:45:00Z",
      "balance": 150
    }
  ]
}
```

---

## 🎁 6. OFFERS & COUPONS APIs (Priority: P1)

#### GET `/api/v1/offers`
**Purpose:** Get available offers/coupons

**Query Parameters:**
- `restaurantId`: "rest_123" (restaurant-specific offers)
- `cartValue`: 500 (to filter applicable offers)

**Response:**
```json
{
  "offers": [
    {
      "id": "offer_1",
      "code": "FIRST50",
      "title": "50% OFF on first order",
      "description": "Get 50% discount up to ₹100 on your first order",
      "discountType": "PERCENTAGE",
      "discountValue": 50,
      "maxDiscount": 100,
      "minOrderValue": 199,
      "applicableOn": "ALL",
      "validFrom": "2026-01-01T00:00:00Z",
      "validTill": "2026-12-31T23:59:59Z",
      "usageLimit": 1,
      "usedCount": 0,
      "isApplicable": true,
      "termsAndConditions": ["Valid only on first order", "Cannot be combined with other offers"]
    },
    {
      "id": "offer_2",
      "code": "TASTY50",
      "title": "Flat ₹50 OFF",
      "discountType": "FLAT",
      "discountValue": 50,
      "minOrderValue": 300,
      "isApplicable": true
    }
  ]
}
```

**Frontend Integration:**
- Offers screen (missing)
- Cart coupon section

---

#### POST `/api/v1/offers/apply`
**Purpose:** Validate and apply coupon

**Request:**
```json
{
  "code": "FIRST50",
  "restaurantId": "rest_123",
  "cartValue": 500,
  "items": [ /* cart items */ ]
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "discount": 100,
  "finalAmount": 400,
  "message": "Coupon applied successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "valid": false,
  "reason": "MINIMUM_ORDER_NOT_MET",
  "message": "Minimum order value should be ₹199"
}
```

**Frontend Integration:**
- File: `src/context/CartContext.tsx`
- Line: 122-138 (applyCoupon function)
- Current: Mock validation with hardcoded coupons
- Required: Call API for real validation

---

## ⭐ 7. RATINGS & REVIEWS APIs (Priority: P1)

#### POST `/api/v1/orders/:id/rate`
**Purpose:** Rate order (food + delivery)

**Request:**
```json
{
  "foodRating": 5,
  "deliveryRating": 4,
  "review": "Great pizza, fresh and hot!",
  "photos": [
    "https://cdn.grihgo.com/reviews/photo1.jpg"
  ],
  "tags": ["Delicious", "Fresh", "Hot"]
}
```

**Frontend Integration:**
- File: `src/app/order/rate.tsx` (needs implementation)
- Rate order screen

---

#### GET `/api/v1/restaurants/:id/reviews`
**Purpose:** Get restaurant reviews

**Query Parameters:**
- `sort`: "recent" | "rating" | "helpful"
- `page`: 1
- `limit`: 20

**Response:**
```json
{
  "reviews": [
    {
      "id": "review_1",
      "userId": "user_123",
      "userName": "Rahul K.",
      "userPhoto": "...",
      "rating": 5,
      "review": "Great pizza!",
      "photos": ["..."],
      "createdAt": "2026-01-14T15:00:00Z",
      "helpfulCount": 15,
      "orderedItems": ["Margherita Pizza"]
    }
  ],
  "pagination": { /* ... */ },
  "summary": {
    "averageRating": 4.3,
    "totalReviews": 2500,
    "ratingDistribution": {
      "5": 1500,
      "4": 700,
      "3": 200,
      "2": 50,
      "1": 50
    }
  }
}
```

---

## 🔔 8. NOTIFICATIONS APIs (Priority: P1)

#### GET `/api/v1/notifications`
**Purpose:** Get user notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif_1",
      "type": "ORDER_STATUS",
      "title": "Order Delivered",
      "message": "Your order #GH12345678 has been delivered",
      "data": {
        "orderId": "order_xyz789"
      },
      "read": false,
      "createdAt": "2026-01-14T14:30:00Z"
    },
    {
      "id": "notif_2",
      "type": "OFFER",
      "title": "Special Offer",
      "message": "Get 50% OFF on your next order",
      "data": {
        "offerCode": "FIRST50"
      },
      "read": true,
      "createdAt": "2026-01-13T10:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

**Frontend Integration:**
- File: `src/app/notifications.tsx` (needs implementation)
- Notification bell badge count

---

#### PUT `/api/v1/notifications/:id/read`
**Purpose:** Mark notification as read

---

#### PUT `/api/v1/notifications/read-all`
**Purpose:** Mark all as read

---

### Push Notifications

**Setup Required:**
- Firebase Cloud Messaging (FCM) for push notifications
- Device token registration
- Server-side notification sending

#### POST `/api/v1/devices/register`
**Purpose:** Register device for push notifications

**Request:**
```json
{
  "deviceToken": "fcm_token_here",
  "platform": "android",
  "appVersion": "1.0.0"
}
```

---

## 📊 9. ANALYTICS & MISC APIs (Priority: P2)

#### POST `/api/v1/analytics/event`
**Purpose:** Track user events

**Request:**
```json
{
  "event": "RESTAURANT_VIEWED",
  "properties": {
    "restaurantId": "rest_123",
    "source": "home_screen"
  }
}
```

---

#### GET `/api/v1/cuisines`
**Purpose:** Get list of available cuisines

**Response:**
```json
{
  "cuisines": [
    {
      "id": "cuisine_1",
      "name": "Italian",
      "icon": "https://cdn.grihgo.com/cuisines/italian.png",
      "restaurantCount": 45
    }
  ]
}
```

**Frontend Integration:**
- File: `src/components/sections/CuisinesScroll.tsx`
- Cuisines horizontal scroll on home

---

## 🛠️ API Service Layer Implementation

### Recommended Folder Structure

```
src/services/
├── api.ts                    # Axios instance with interceptors
├── auth.service.ts           # Authentication APIs
├── user.service.ts           # User profile, addresses, payment methods
├── restaurant.service.ts     # Restaurant & menu APIs
├── order.service.ts          # Orders, tracking
├── payment.service.ts        # Payment integration
├── offer.service.ts          # Offers & coupons
├── review.service.ts         # Ratings & reviews
├── notification.service.ts   # Notifications
└── websocket.service.ts      # WebSocket connection for tracking
```

---

### Example: api.ts (Axios Setup)

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE_URL = 'https://api.grihgo.com/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      await AsyncStorage.removeItem('authToken');
      router.replace('/(auth)/login');
    }

    // Format error message
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

### Example: auth.service.ts

```typescript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async sendOTP(phoneNumber: string) {
    const response = await api.post('/auth/send-otp', {
      phoneNumber,
      countryCode: '+91',
    });
    return response;
  },

  async verifyOTP(otpId: string, otp: string, phoneNumber: string) {
    const response = await api.post('/auth/verify-otp', {
      otpId,
      otp,
      phoneNumber,
    });

    // Store token
    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  },

  async logout() {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
  },

  async refreshToken() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });

    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  },
};
```

---

### Example: order.service.ts

```typescript
import api from './api';

export const orderService = {
  async createOrder(orderData: CreateOrderRequest) {
    const response = await api.post('/orders', orderData);
    return response;
  },

  async getOrder(orderId: string) {
    const response = await api.get(`/orders/${orderId}`);
    return response;
  },

  async getOrderHistory(page = 1, limit = 20) {
    const response = await api.get('/orders', {
      params: { page, limit },
    });
    return response;
  },

  async cancelOrder(orderId: string, reason: string) {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response;
  },

  async repeatOrder(orderId: string) {
    const response = await api.post(`/orders/${orderId}/repeat`);
    return response;
  },
};
```

---

### Example: WebSocket for Real-time Tracking

```typescript
// src/services/websocket.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class OrderTrackingWebSocket {
  private ws: WebSocket | null = null;
  private orderId: string;
  private listeners: Map<string, Function[]> = new Map();

  constructor(orderId: string) {
    this.orderId = orderId;
  }

  async connect() {
    const token = await AsyncStorage.getItem('authToken');
    const wsUrl = `wss://api.grihgo.com/v1/orders/${this.orderId}/track`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      // Authenticate
      this.ws?.send(JSON.stringify({ token }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    callbacks?.forEach((callback) => callback(data));
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

// Usage in component:
// const ws = new OrderTrackingWebSocket('order_xyz789');
// await ws.connect();
// ws.on('STATUS_UPDATE', (data) => setOrderStatus(data.status));
// ws.on('LOCATION_UPDATE', (data) => setDriverLocation(data.driverLocation));
```

---

## 🔒 Security Considerations

### 1. Authentication
- ✅ JWT tokens with expiry
- ✅ Refresh token rotation
- ✅ Secure token storage (AsyncStorage with encryption)
- ⚠️ Add biometric authentication for sensitive operations

### 2. API Security
- ✅ HTTPS only
- ✅ Rate limiting (prevent abuse)
- ✅ Input validation on backend
- ✅ SQL injection prevention (parameterized queries)
- ⚠️ Add request signing for critical operations

### 3. Data Privacy
- ✅ PII encryption in transit and at rest
- ✅ GDPR compliance (if serving EU)
- ✅ User data deletion option
- ⚠️ Add data anonymization for analytics

### 4. Payment Security
- ✅ PCI DSS compliance (via Razorpay)
- ✅ Never store card details (tokenization)
- ✅ 3D Secure authentication
- ⚠️ Add fraud detection

---

## 📊 Backend Development Estimate

### API Development Timeline

| Category | Endpoints | Dev Time | Priority |
|----------|-----------|----------|----------|
| Auth APIs | 6 | 1 week | P0 |
| User Management | 8 | 1.5 weeks | P0 |
| Restaurant & Menu | 12 | 2 weeks | P0 |
| Cart & Orders | 10 | 2 weeks | P0 |
| Payment Integration | 6 | 1.5 weeks | P0 |
| Real-time Tracking | 4 (+ WebSocket) | 2 weeks | P0 |
| Search | 5 | 1 week | P1 |
| Offers & Coupons | 4 | 1 week | P1 |
| Ratings & Reviews | 6 | 1 week | P1 |
| Notifications | 3 + Push | 1 week | P1 |
| Analytics | 4 | 0.5 weeks | P2 |
| **TOTAL** | **68 APIs** | **14 weeks** | - |

**With 2 backend developers:** ~7-8 weeks
**With 3 backend developers:** ~5-6 weeks

---

## ✅ Integration Checklist

### Phase 1: Authentication (Week 1)
- [ ] Create auth.service.ts
- [ ] Integrate send-otp API in login screen
- [ ] Integrate verify-otp API in OTP screen
- [ ] Implement token storage
- [ ] Add auto-refresh token logic
- [ ] Test social login (Google, Apple)

### Phase 2: User Profile & Addresses (Week 2)
- [ ] Create user.service.ts
- [ ] Fetch user profile data
- [ ] Replace hardcoded addresses with API
- [ ] Implement address CRUD operations
- [ ] Build add/edit address screen with map

### Phase 3: Restaurants & Menu (Week 3)
- [ ] Create restaurant.service.ts
- [ ] Replace mock RESTAURANTS data
- [ ] Replace mock MENU_ITEMS data
- [ ] Implement search API
- [ ] Add filters and sorting

### Phase 4: Orders & Payment (Week 4-5)
- [ ] Create order.service.ts
- [ ] Create payment.service.ts
- [ ] Integrate create order API
- [ ] Integrate Razorpay
- [ ] Test payment flow end-to-end
- [ ] Handle payment success/failure

### Phase 5: Real-time Tracking (Week 6)
- [ ] Create websocket.service.ts
- [ ] Build order tracking screen
- [ ] Integrate map for driver location
- [ ] Show real-time status updates
- [ ] Add ETA countdown

### Phase 6: Remaining Features (Week 7-8)
- [ ] Offers & coupons integration
- [ ] Ratings & reviews
- [ ] Notifications
- [ ] Order history
- [ ] Favorites

---

## 📌 Conclusion

**API Requirements Summary:**
- **68 API endpoints** identified
- **WebSocket/SSE** for real-time tracking
- **Payment gateway** integration critical
- **14 weeks** backend development estimate

**Current Blocker:**
Frontend **100% dependent on mock data**. Backend integration is **CRITICAL PATH** for MVP launch.

**Recommendation:**
1. **Prioritize P0 APIs** (Auth, Restaurants, Orders, Payment)
2. **Start backend development immediately**
3. **Parallel frontend-backend development** with agreed API contracts
4. **Use API mocks/stubs** for frontend testing while backend is built
5. **WebSocket for tracking** is non-negotiable for food delivery

**Timeline:** With focused effort, backend + frontend integration can be completed in **8-10 weeks**.

---

**Report End**
*For implementation examples, refer to code snippets above.*
