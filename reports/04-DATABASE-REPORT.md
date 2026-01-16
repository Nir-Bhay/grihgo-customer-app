# 04 - DATABASE REPORT
## GRIHGO Customer App - Data Models & Schema Design

**Report Date:** January 14, 2026
**Analyzed By:** Database Architect
**Language:** Technical English + Hindi Mix
**Database Version:** PostgreSQL 15+ (Recommended)

---

## 📋 Executive Summary

Ye report GRIHGO Customer App ke liye **complete database schema** define karta hai. Frontend code analysis se humne **TypeScript interfaces** identify kiye hain jo current data models ko represent karte hain. Is report mein **14 main tables** aur **relationships** ka detailed schema design hai.

### Database Requirements Overview

```
📊 DATA MODELS IDENTIFIED FROM CODE

Primary Entities:
├─ Users (Customers)
├─ Restaurants
├─ MenuItems
├─ Categories
├─ Orders
├─ OrderItems
├─ Addresses
├─ PaymentMethods
├─ Transactions
├─ Reviews
├─ Offers/Coupons
├─ Notifications
├─ DeliveryPartners
└─ Favorites

Total Tables: 14+ (with junction tables)
Estimated Rows (1 year): 1M+ orders, 10K+ restaurants
```

### Technology Recommendations

| Component | Technology | Reason |
|-----------|------------|--------|
| **Primary Database** | PostgreSQL 15+ | ACID, JSON support, performance |
| **Cache Layer** | Redis | Session management, real-time data |
| **Search Engine** | Elasticsearch | Fast restaurant/menu search |
| **File Storage** | AWS S3 / Cloudinary | Images, documents |
| **Real-time** | WebSocket + Redis Pub/Sub | Order tracking |

---

## 📐 Data Models from Frontend Code

### From TypeScript Interfaces

**File:** `src/types/index.ts`

Based on frontend usage, these are the data structures:

```typescript
// User/Customer
interface User {
  id: string;
  phoneNumber: string;
  name: string;
  email?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
}

// Restaurant
interface Restaurant {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  costForTwo: number;
  image: string;
  isOpen: boolean;
  offer?: {
    text: string;
    code: string;
  };
  isPureVeg: boolean;
  location: {
    area: string;
    city: string;
  };
}

// MenuItem
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestseller: boolean;
  rating?: number;
  ratingCount?: number;
}

// CartItem (from CartContext.tsx)
interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isVeg?: boolean;
}

// Order (inferred from checkout flow)
interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  status: OrderStatus;
  pricing: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    tip: number;
    discount: number;
    total: number;
  };
  deliveryAddress: Address;
  placedAt: string;
}
```

---

## 🗃️ COMPLETE DATABASE SCHEMA

### 1. USERS Table

**Purpose:** Store customer information

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    country_code VARCHAR(5) DEFAULT '+91',
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    profile_image_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),

    -- Wallet
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,

    -- Auth
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,

    -- Indexes
    CONSTRAINT check_wallet_positive CHECK (wallet_balance >= 0)
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

**Frontend Integration:**
- `src/app/(tabs)/profile.tsx` - Display user profile
- `src/context/AuthContext.tsx` - User authentication state

---

### 2. RESTAURANTS Table

**Purpose:** Store restaurant/vendor information

```sql
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    name VARCHAR(200) NOT NULL,
    description TEXT,
    phone_number VARCHAR(15),
    email VARCHAR(255),

    -- Location
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,

    -- Media
    cover_image_url TEXT,
    logo_url TEXT,

    -- Ratings & Reviews
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,

    -- Delivery Info
    delivery_time_min INT, -- in minutes
    delivery_time_max INT,
    delivery_radius DECIMAL(5, 2), -- in km
    cost_for_two DECIMAL(10, 2),

    -- Status
    is_open BOOLEAN DEFAULT TRUE,
    is_accepting_orders BOOLEAN DEFAULT TRUE,
    is_pure_veg BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Operational Hours (JSON)
    opening_hours JSONB,

    -- Compliance
    fssai_license VARCHAR(50),
    gst_number VARCHAR(20),

    -- Pricing
    packaging_charges DECIMAL(10, 2) DEFAULT 0.00,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,

    -- Constraints
    CONSTRAINT check_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Indexes
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(
    ll_to_earth(latitude, longitude)
); -- For geo-spatial queries
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_is_open ON restaurants(is_open, is_accepting_orders);
```

**Frontend Integration:**
- `src/data/mockData.ts` - RESTAURANTS array (to be replaced)
- `src/app/restaurant/[id].tsx` - Restaurant detail screen

---

### 3. CUISINES Table

**Purpose:** Cuisine types for restaurants

```sql
CREATE TABLE cuisines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Junction table for restaurant cuisines
CREATE TABLE restaurant_cuisines (
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    cuisine_id UUID REFERENCES cuisines(id) ON DELETE CASCADE,
    PRIMARY KEY (restaurant_id, cuisine_id)
);

CREATE INDEX idx_restaurant_cuisines_restaurant ON restaurant_cuisines(restaurant_id);
```

**Frontend Integration:**
- `src/components/sections/CuisinesScroll.tsx` - Cuisines carousel
- Restaurant filters

---

### 4. MENU_CATEGORIES Table

**Purpose:** Menu categories (Starters, Mains, Desserts, etc.)

```sql
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id, display_order);
```

---

### 5. MENU_ITEMS Table

**Purpose:** Food items/dishes

```sql
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,

    -- Basic Info
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,

    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount_percentage INT,

    -- Properties
    is_veg BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    serves_count INT DEFAULT 1,

    -- Ratings
    rating DECIMAL(3, 2),
    rating_count INT DEFAULT 0,

    -- Customization
    is_customizable BOOLEAN DEFAULT FALSE,
    customization_data JSONB, -- Store customization options

    -- Nutrition (optional)
    nutrition_info JSONB,

    -- Allergens
    allergens TEXT[],

    -- Availability
    is_available BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,

    -- Constraints
    CONSTRAINT check_price_positive CHECK (price > 0)
);

-- Indexes
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_is_veg ON menu_items(is_veg);
CREATE INDEX idx_menu_items_bestseller ON menu_items(is_bestseller);
```

**Frontend Integration:**
- `src/data/mockData.ts` - MENU_ITEMS array (to be replaced)
- `src/app/restaurant/[id].tsx` - Menu display
- `src/app/food/[id].tsx` - Food item detail

---

### 6. ADDRESSES Table

**Purpose:** User delivery addresses

```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Address Type
    type VARCHAR(20) CHECK (type IN ('HOME', 'WORK', 'OTHER')),
    label VARCHAR(50), -- Custom label like "Mom's House"

    -- Address Details
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,

    -- Geolocation
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,

    -- Default Address
    is_default BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default);

-- Ensure only one default address per user
CREATE UNIQUE INDEX idx_addresses_one_default
    ON addresses(user_id)
    WHERE is_default = TRUE AND deleted_at IS NULL;
```

**Frontend Integration:**
- `src/app/cart/checkout.tsx` - Line 22-37 (hardcoded addresses)
- Address management screen (missing)

---

### 7. ORDERS Table

**Purpose:** Customer orders

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- GH12345678

    -- Relations
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
    delivery_partner_id UUID REFERENCES delivery_partners(id) ON DELETE SET NULL,
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,

    -- Delivery Address Snapshot (in case address is deleted)
    delivery_address JSONB NOT NULL,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    -- PLACED -> CONFIRMED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED / CANCELLED

    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    taxes DECIMAL(10, 2) DEFAULT 0.00,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    packaging_charges DECIMAL(10, 2) DEFAULT 0.00,
    tip DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,

    -- Payment
    payment_method VARCHAR(20), -- UPI, CARD, WALLET, COD
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, FAILED, REFUNDED

    -- Coupon
    coupon_code VARCHAR(50),

    -- Special Instructions
    special_instructions TEXT,

    -- Timestamps
    placed_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    preparing_at TIMESTAMP,
    ready_at TIMESTAMP,
    out_for_delivery_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,

    -- Estimated Delivery
    estimated_delivery_time TIMESTAMP,

    -- Cancellation
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20), -- USER, RESTAURANT, DELIVERY_PARTNER, SYSTEM

    -- Rating
    is_rated BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_total_positive CHECK (total >= 0)
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id, placed_at DESC);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id, placed_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);
```

**Frontend Integration:**
- `src/app/cart/checkout.tsx` - Order creation
- `src/app/order/[id].tsx` - Order tracking (needs implementation)
- `src/app/(tabs)/reorder.tsx` - Order history

---

### 8. ORDER_ITEMS Table

**Purpose:** Items in each order

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,

    -- Item Snapshot (in case menu item is deleted/changed)
    item_name VARCHAR(200) NOT NULL,
    item_description TEXT,
    item_image_url TEXT,

    -- Pricing
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    -- Customizations
    customizations JSONB, -- Store selected customizations

    -- Total
    item_total DECIMAL(10, 2) NOT NULL,

    -- Metadata
    is_veg BOOLEAN,

    created_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

**Frontend Integration:**
- `src/context/CartContext.tsx` - Cart items
- Order detail screens

---

### 9. PAYMENT_METHODS Table

**Purpose:** Saved payment methods

```sql
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Type
    type VARCHAR(20) NOT NULL, -- CARD, UPI, WALLET

    -- Card Details (tokenized)
    card_token VARCHAR(255), -- From payment gateway
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20), -- VISA, MASTERCARD, RUPAY
    card_expiry VARCHAR(7), -- MM/YYYY

    -- UPI
    upi_id VARCHAR(100),

    -- Default
    is_default BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE UNIQUE INDEX idx_payment_methods_one_default
    ON payment_methods(user_id)
    WHERE is_default = TRUE AND deleted_at IS NULL;
```

**Frontend Integration:**
- `src/app/cart/checkout.tsx` - Line 39-44 (hardcoded payment methods)
- Payment methods management screen (missing)

---

### 10. TRANSACTIONS Table

**Purpose:** Payment & wallet transactions

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

    -- Transaction Type
    type VARCHAR(20) NOT NULL, -- ORDER_PAYMENT, REFUND, WALLET_RECHARGE, TIP

    -- Amount
    amount DECIMAL(10, 2) NOT NULL,

    -- Payment Gateway
    payment_gateway VARCHAR(50), -- RAZORPAY, PAYTM, etc.
    gateway_transaction_id VARCHAR(255),
    gateway_order_id VARCHAR(255),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING, SUCCESS, FAILED, REFUNDED

    -- Method
    payment_method VARCHAR(20), -- UPI, CARD, WALLET, COD

    -- Wallet Balance (after transaction)
    wallet_balance_after DECIMAL(10, 2),

    -- Metadata
    metadata JSONB, -- Store additional gateway response

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

**Frontend Integration:**
- Wallet transactions screen (missing)
- Payment flow

---

### 11. REVIEWS Table

**Purpose:** Restaurant & food ratings

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Ratings (1-5)
    food_rating INT CHECK (food_rating >= 1 AND food_rating <= 5),
    delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),

    -- Review Text
    review_text TEXT,

    -- Photos
    photo_urls TEXT[],

    -- Tags
    tags TEXT[],

    -- Helpful Count
    helpful_count INT DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT TRUE,

    -- Response from restaurant
    restaurant_response TEXT,
    restaurant_response_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
```

**Frontend Integration:**
- `src/app/order/rate.tsx` - Rate order screen (needs implementation)
- Restaurant reviews page (missing)

---

### 12. OFFERS Table

**Purpose:** Coupons & promotional offers

```sql
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Code
    code VARCHAR(50) UNIQUE NOT NULL,

    -- Title & Description
    title VARCHAR(200) NOT NULL,
    description TEXT,

    -- Discount
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FLAT, FREEBIE
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount DECIMAL(10, 2),

    -- Conditions
    min_order_value DECIMAL(10, 2),
    applicable_on VARCHAR(20) DEFAULT 'ALL', -- ALL, RESTAURANT_SPECIFIC, CATEGORY_SPECIFIC

    -- Restaurant-specific
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Usage Limits
    usage_limit_per_user INT DEFAULT 1,
    total_usage_limit INT,
    current_usage_count INT DEFAULT 0,

    -- Validity
    valid_from TIMESTAMP NOT NULL,
    valid_till TIMESTAMP NOT NULL,

    -- Terms
    terms_and_conditions TEXT,

    -- Visibility
    is_active BOOLEAN DEFAULT TRUE,
    is_visible BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction table for user offer usage
CREATE TABLE user_offer_usage (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    used_count INT DEFAULT 0,
    last_used_at TIMESTAMP,
    PRIMARY KEY (user_id, offer_id)
);

CREATE INDEX idx_offers_code ON offers(code);
CREATE INDEX idx_offers_validity ON offers(valid_from, valid_till);
```

**Frontend Integration:**
- `src/context/CartContext.tsx` - Line 122-138 (mock coupon validation)
- Offers screen (missing)

---

### 13. NOTIFICATIONS Table

**Purpose:** User notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Type
    type VARCHAR(30) NOT NULL, -- ORDER_STATUS, OFFER, REMINDER, etc.

    -- Content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    -- Data (for deep linking)
    data JSONB,

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Push Notification
    is_pushed BOOLEAN DEFAULT FALSE,
    pushed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
```

**Frontend Integration:**
- `src/app/notifications.tsx` - Notifications list (needs implementation)
- Notification bell badge count

---

### 14. DELIVERY_PARTNERS Table

**Purpose:** Delivery drivers/partners

```sql
CREATE TABLE delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Personal Info
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    photo_url TEXT,

    -- Vehicle
    vehicle_type VARCHAR(20), -- BIKE, SCOOTER, BICYCLE
    vehicle_number VARCHAR(20),

    -- Rating
    rating DECIMAL(3, 2) DEFAULT 0.00,
    delivery_count INT DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    current_location POINT, -- For real-time tracking

    -- Compliance
    license_number VARCHAR(50),
    aadhar_number VARCHAR(12),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_delivery_partners_available ON delivery_partners(is_available);
```

---

### 15. FAVORITES Table

**Purpose:** User's favorite restaurants/dishes

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Can favorite either restaurant or menu item
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT NOW(),

    -- Ensure only one favorite type per entry
    CONSTRAINT check_favorite_type CHECK (
        (restaurant_id IS NOT NULL AND menu_item_id IS NULL) OR
        (restaurant_id IS NULL AND menu_item_id IS NOT NULL)
    )
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE UNIQUE INDEX idx_favorites_unique_restaurant
    ON favorites(user_id, restaurant_id)
    WHERE restaurant_id IS NOT NULL;
CREATE UNIQUE INDEX idx_favorites_unique_item
    ON favorites(user_id, menu_item_id)
    WHERE menu_item_id IS NOT NULL;
```

**Frontend Integration:**
- `src/app/(tabs)/favorites.tsx` - Favorites screen (needs implementation)

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   USERS     │────1:N──│  ADDRESSES   │         │ RESTAURANTS  │
│             │         │              │         │              │
│ - id        │         │ - user_id    │         │ - id         │
│ - phone     │         │ - type       │         │ - name       │
│ - name      │         │ - location   │         │ - rating     │
│ - wallet    │         └──────────────┘         │ - cuisines   │
└──────┬──────┘                                  └──────┬───────┘
       │                                                 │
       │1                                               1│
       │                                                 │
       │N        ┌──────────────┐          N            │
       └─────────│   ORDERS     │────────────────────── ┘
                 │              │
                 │ - id         │
                 │ - status     │
                 │ - total      │
                 └──────┬───────┘
                        │
                        │1
                        │
                        │N
                 ┌──────────────┐         ┌──────────────┐
                 │ ORDER_ITEMS  │────N:1──│  MENU_ITEMS  │
                 │              │         │              │
                 │ - order_id   │         │ - id         │
                 │ - item_id    │         │ - name       │
                 │ - quantity   │         │ - price      │
                 └──────────────┘         │ - is_veg     │
                                          └──────────────┘
```

---

## 🔍 Data Access Patterns & Queries

### Common Query Patterns

#### 1. Get Nearby Restaurants

```sql
-- Using PostGIS extension for geospatial queries
SELECT
    r.*,
    earth_distance(
        ll_to_earth(r.latitude, r.longitude),
        ll_to_earth(12.9716, 77.5946) -- user location
    ) / 1000 AS distance_km
FROM restaurants r
WHERE
    r.is_open = TRUE
    AND r.is_accepting_orders = TRUE
    AND earth_box(ll_to_earth(12.9716, 77.5946), r.delivery_radius * 1000) @> ll_to_earth(r.latitude, r.longitude)
ORDER BY distance_km ASC
LIMIT 20;
```

#### 2. Get Restaurant Menu with Categories

```sql
SELECT
    c.id AS category_id,
    c.name AS category_name,
    json_agg(
        json_build_object(
            'id', m.id,
            'name', m.name,
            'price', m.price,
            'is_veg', m.is_veg,
            'is_bestseller', m.is_bestseller,
            'rating', m.rating
        ) ORDER BY m.display_order
    ) AS items
FROM menu_categories c
LEFT JOIN menu_items m ON m.category_id = c.id AND m.is_available = TRUE
WHERE c.restaurant_id = 'rest_123' AND c.is_active = TRUE
GROUP BY c.id, c.name
ORDER BY c.display_order;
```

#### 3. Get User Order History

```sql
SELECT
    o.id,
    o.order_number,
    o.status,
    o.total,
    o.placed_at,
    r.name AS restaurant_name,
    r.logo_url AS restaurant_image,
    COUNT(oi.id) AS item_count
FROM orders o
JOIN restaurants r ON r.id = o.restaurant_id
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = 'user_123'
GROUP BY o.id, r.name, r.logo_url
ORDER BY o.placed_at DESC
LIMIT 20;
```

#### 4. Apply Coupon Validation

```sql
SELECT
    o.*,
    COALESCE(uou.used_count, 0) AS user_usage_count
FROM offers o
LEFT JOIN user_offer_usage uou ON uou.offer_id = o.id AND uou.user_id = 'user_123'
WHERE
    o.code = 'FIRST50'
    AND o.is_active = TRUE
    AND NOW() BETWEEN o.valid_from AND o.valid_till
    AND o.current_usage_count < o.total_usage_limit
    AND COALESCE(uou.used_count, 0) < o.usage_limit_per_user;
```

---

## ⚡ Performance Optimization

### Indexes Strategy

**Already Created:**
- Primary keys (automatic B-tree indexes)
- Foreign keys (for join performance)
- Geospatial index for restaurant location
- Composite indexes for common filters

**Additional Recommended Indexes:**

```sql
-- For search
CREATE INDEX idx_restaurants_name_trgm ON restaurants USING gin(name gin_trgm_ops);
CREATE INDEX idx_menu_items_name_trgm ON menu_items USING gin(name gin_trgm_ops);

-- For analytics
CREATE INDEX idx_orders_created_at_brin ON orders USING brin(created_at);

-- Partial indexes for active records
CREATE INDEX idx_restaurants_active ON restaurants(rating DESC)
    WHERE is_open = TRUE AND is_accepting_orders = TRUE;
```

### Partitioning Strategy

**For Large Tables:**

```sql
-- Partition orders table by month
CREATE TABLE orders (
    -- columns
) PARTITION BY RANGE (placed_at);

CREATE TABLE orders_2026_01 PARTITION OF orders
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE orders_2026_02 PARTITION OF orders
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### Caching Strategy

**Redis Cache:**
- Restaurant list (by location) - TTL: 5 minutes
- Menu items (by restaurant) - TTL: 10 minutes
- User profile - TTL: 30 minutes
- Active offers - TTL: 1 hour

---

## 🔒 Data Security

### Sensitive Data Encryption

```sql
-- Use pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive fields
CREATE TABLE users (
    -- ...
    aadhar_number_encrypted BYTEA, -- Encrypted with pgp_sym_encrypt
    -- ...
);

-- Encrypt on insert
INSERT INTO users (aadhar_number_encrypted)
VALUES (pgp_sym_encrypt('123456789012', 'encryption_key'));

-- Decrypt on select
SELECT pgp_sym_decrypt(aadhar_number_encrypted, 'encryption_key') FROM users;
```

### Row-Level Security (RLS)

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY user_isolation_policy ON users
    FOR ALL
    USING (id = current_setting('app.current_user_id')::uuid);
```

---

## 📦 Database Migration Plan

### Initial Schema Setup

```
migrations/
├── 001_create_users_table.sql
├── 002_create_restaurants_table.sql
├── 003_create_cuisines_table.sql
├── 004_create_menu_tables.sql
├── 005_create_addresses_table.sql
├── 006_create_orders_table.sql
├── 007_create_payment_tables.sql
├── 008_create_reviews_table.sql
├── 009_create_offers_table.sql
├── 010_create_notifications_table.sql
├── 011_create_delivery_partners_table.sql
├── 012_create_favorites_table.sql
└── 013_create_indexes.sql
```

### Migration Tools

**Recommended:**
- **TypeORM** (if using Node.js backend)
- **Prisma** (modern ORM with great migrations)
- **Flyway** (Java-based migration tool)
- **Alembic** (Python-based)

---

## 📊 Storage Estimates

### Data Size Projections (1 Year)

| Table | Rows | Avg Row Size | Total Size |
|-------|------|--------------|------------|
| users | 100,000 | 1 KB | 100 MB |
| restaurants | 10,000 | 2 KB | 20 MB |
| menu_items | 200,000 | 1.5 KB | 300 MB |
| orders | 1,000,000 | 2 KB | 2 GB |
| order_items | 3,000,000 | 0.5 KB | 1.5 GB |
| reviews | 500,000 | 1 KB | 500 MB |
| transactions | 1,200,000 | 1 KB | 1.2 GB |
| notifications | 5,000,000 | 0.5 KB | 2.5 GB |
| **TOTAL** | - | - | **~8 GB** |

**With Indexes:** ~12-15 GB
**Recommendation:** 50 GB database server (with 3x growth buffer)

---

## 📌 Conclusion

**Database Schema Summary:**
- **14 main tables** defined
- **PostgreSQL 15+** recommended
- **Geospatial support** for location-based queries
- **JSONB** for flexible data (customizations, metadata)
- **Proper indexing** for performance
- **Partitioning** strategy for large tables

**Implementation Priority:**
1. Core tables (Users, Restaurants, Menu, Orders) - Week 1
2. Payment & Transactions - Week 2
3. Reviews, Offers, Notifications - Week 3
4. Optimization & Caching - Week 4

**Timeline:** 4 weeks for complete database setup with seed data

---

**Report End**
*For SQL scripts, see migration files (to be created).*
