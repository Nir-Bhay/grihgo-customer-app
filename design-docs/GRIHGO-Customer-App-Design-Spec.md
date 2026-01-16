# GRIHGO Customer App - Complete UI/UX Design Specification
## Premium Food Delivery Experience | Version 1.0 | 2025

---

## 📋 EXECUTIVE SUMMARY

This document provides **comprehensive UI/UX design specifications** for the GRIHGO Customer App - a next-generation food delivery platform designed for the Indian market (2025). The design synthesizes best practices from market leaders (Zomato, Swiggy, DoorDash, Uber Eats) while incorporating cutting-edge trends including AI-powered personalization, voice ordering, real-time tracking, and sustainability features.

### Design Philosophy
> **"Crave. Tap. Enjoy."** - Making food ordering feel effortless and delightful.

### Key Design Pillars

| Pillar | Description |
|--------|-------------|
| **Speed & Simplicity** | Reduce cognitive load, minimize taps to order (≤4 taps) |
| **AI Personalization** | Smart recommendations based on behavior, mood, time |
| **Visual Immersion** | Large, appetizing food imagery that drives cravings |
| **Trust & Transparency** | Real-time tracking, honest pricing, clear communication |
| **Delight & Engagement** | Micro-interactions, gamification, social features |
| **Accessibility** | WCAG 2.1 AA compliance, inclusive design for all users |

### Target Metrics

| Metric | Target | Success Criteria |
|--------|--------|------------------|
| App Load Time | <2 seconds | Core content visible immediately |
| Order Completion Rate | >75% | Reduced cart abandonment |
| Checkout Time | <60 seconds | 3-4 taps maximum |
| User Retention (Day 30) | >60% | High re-order rate |
| Accessibility Score | 95+ | WCAG AA standard |

---

## 🎨 SECTION 1: BRAND & VISUAL IDENTITY

### 1.1 Brand Foundation

**Brand Name:** GRIHGO
**Tagline:** "Fresh. Fast. For Everyone."
**Customer App Tagline:** "Crave. Tap. Enjoy."
**Core Values:** Trust, Quality, Speed, Sustainability, Community

### 1.2 Color System

#### Primary Colors (Light Mode)
```
PRIMARY GREEN:     #2ECC71  RGB(46, 204, 113)   
└─ Usage: CTAs, highlights, success states, brand accents
└─ Psychology: Fresh, growth, trust, healthy food

DARK GREEN:        #1E8449  RGB(30, 132, 73)
└─ Usage: Headers, active states, pressed buttons
└─ Accessibility: WCAG AAA with white text

BACKGROUND:        #F8F9FA  RGB(248, 249, 250)
└─ Usage: Page backgrounds, light mode default

SURFACE (Cards):   #FFFFFF  RGB(255, 255, 255)
└─ Usage: Cards, modals, elevated surfaces
```

#### Dark Mode Colors
```
DEEP BACKGROUND:   #0D2818  RGB(13, 40, 24)
└─ Deep green, premium feel

CARD SURFACE:      #1A4D3E  RGB(26, 77, 62)
└─ Elevated dark green cards

TEXT PRIMARY:      #ECFDF5  RGB(236, 253, 245)
└─ Light mint for readability

BORDERS:           #4A6B5D  RGB(74, 107, 93)
└─ Subtle sage green dividers
```

#### Status & Action Colors
```
SUCCESS:    #27AE60  (Order confirmed, verified restaurants)
WARNING:    #E67E22  (Pending, time alerts, offers ending)
ERROR:      #E74C3C  (Failed payment, out of stock)
INFO:       #3498DB  (Tracking, tips, information)
DISABLED:   #BDC3C7  (Inactive elements)

STATUS BACKGROUNDS (Light Mode):
Success BG: #E8F5E9  |  Warning BG: #FFF4E5
Error BG:   #FFEBEE  |  Info BG:    #E3F2FD
```

### 1.3 Typography System

**Font Family:** Inter (Google Fonts - Free, Modern, Highly Legible)

```
HIERARCHY:
├─ H1: 32px, Bold (700), Line-height 1.2
│  └─ Page titles: "Good morning, Rahul!"
├─ H2: 24px, Semibold (600), Line-height 1.3
│  └─ Section headers: "Popular Restaurants"
├─ H3: 20px, Semibold (600), Line-height 1.4
│  └─ Card titles: "Biryani House"
├─ H4: 18px, Semibold (600), Line-height 1.5
│  └─ Subsection: "Filter by Cuisine"
├─ Body: 16px, Regular (400), Line-height 1.5
│  └─ Main content, descriptions
├─ Body Small: 14px, Regular (400), Line-height 1.6
│  └─ Secondary text, reviews
├─ Caption: 12px, Medium (500), Line-height 1.5
│  └─ Labels, badges, timestamps
└─ Price: 18-24px, Bold (700), Monospace
   └─ ₹450, ₹1,299 (fixed-width numerals)
```

### 1.4 Spacing System (8px Grid)

```
SPACING SCALE:
├─ xs:   4px   (Micro, icon-to-text)
├─ sm:   8px   (Small gaps, list items)
├─ md:   12px  (Medium gaps, buttons padding)
├─ lg:   16px  (Standard padding, margins)
├─ xl:   20px  (Card padding)
├─ xxl:  24px  (Section spacing)
├─ xxxl: 32px  (Page margins, large gaps)
└─ huge: 40px  (Hero sections)
```

### 1.5 Border Radius

```
├─ xs:   4px   (Small badges, chips)
├─ sm:   6px   (Buttons, inputs)
├─ md:   8px   (Standard cards)
├─ lg:   12px  (Large cards, images)
├─ xl:   16px  (Modals, bottom sheets)
└─ full: 999px (Pills, avatars, circles)
```

### 1.6 Shadows

```
SHADOW-SM:  0 1px 2px rgba(0,0,0,0.05)   - Subtle elevation
SHADOW-MD:  0 2px 8px rgba(0,0,0,0.08)   - Cards, buttons
SHADOW-LG:  0 4px 16px rgba(0,0,0,0.12)  - Modals, popovers
SHADOW-XL:  0 8px 24px rgba(0,0,0,0.15)  - Hero cards, focus
```

---

## 📱 SECTION 2: INFORMATION ARCHITECTURE

### 2.1 Complete App Structure

```
GRIHGO CUSTOMER APP
│
├─ 🚀 ONBOARDING (First Launch Only)
│   ├─ Splash Screen (Animated logo)
│   ├─ Welcome Carousel (3 screens)
│   ├─ Location Permission
│   ├─ Login/Sign Up
│   │   ├─ Phone + OTP (Primary)
│   │   ├─ Google Sign In
│   │   └─ Apple Sign In
│   └─ Preference Setup (Skip available)
│       ├─ Favorite Cuisines
│       └─ Dietary Preferences
│
├─ 🏠 MAIN APP (Bottom Navigation - 5 Tabs)
│   │
│   ├─ 🏠 HOME (Tab 1)
│   │   ├─ Location Selector (Top)
│   │   ├─ Search Bar (Prominent)
│   │   ├─ Personalized Banners (AI-driven)
│   │   ├─ Quick Actions Row
│   │   │   ├─ Food
│   │   │   ├─ Grocery
│   │   │   ├─ Offers
│   │   │   └─ More
│   │   ├─ "Hungry? Reorder" (Past orders)
│   │   ├─ Featured Restaurants Carousel
│   │   ├─ Cuisines Horizontal Scroll
│   │   ├─ "For You" (AI Recommendations)
│   │   ├─ Popular Near You Grid
│   │   └─ Trending This Week
│   │
│   ├─ 🔍 SEARCH (Tab 2)
│   │   ├─ Search Input (Auto-focus)
│   │   ├─ Voice Search Button
│   │   ├─ Recent Searches
│   │   ├─ Trending Searches
│   │   ├─ Filters (Collapsible)
│   │   │   ├─ Cuisine Type
│   │   │   ├─ Rating (4★+, 3★+)
│   │   │   ├─ Delivery Time
│   │   │   ├─ Price Range
│   │   │   ├─ Offers & Discounts
│   │   │   ├─ Pure Veg Only
│   │   │   └─ Sort By
│   │   └─ Search Results Grid
│   │
│   ├─ ⏱️ REORDER (Tab 3)
│   │   ├─ Recent Orders (Last 30 days)
│   │   ├─ Favorite Restaurants
│   │   ├─ Favorite Dishes (Quick Add)
│   │   ├─ "Order Again" Cards
│   │   └─ Frequently Together
│   │
│   ├─ ❤️ FAVORITES (Tab 4)
│   │   ├─ Saved Restaurants
│   │   ├─ Saved Dishes
│   │   ├─ Saved Offers
│   │   └─ Collections (Custom lists)
│   │
│   └─ 👤 PROFILE (Tab 5)
│       ├─ User Info Card
│       ├─ My Addresses
│       ├─ Payment Methods
│       ├─ Order History
│       ├─ GRIHGO Wallet
│       ├─ Loyalty Points
│       ├─ Refer & Earn
│       ├─ Notifications
│       ├─ Settings
│       │   ├─ Dark Mode Toggle
│       │   ├─ Language
│       │   ├─ Dietary Defaults
│       │   └─ Notification Preferences
│       ├─ Help & Support
│       └─ Logout
│
├─ 🍽️ RESTAURANT DETAIL
│   ├─ Hero Image/Carousel
│   ├─ Restaurant Info
│   │   ├─ Name + Verified Badge
│   │   ├─ Rating + Reviews Count
│   │   ├─ Cuisines
│   │   ├─ Delivery Time & Fee
│   │   ├─ Distance
│   │   └─ Offers Available
│   ├─ Menu Navigation (Sticky)
│   │   ├─ Category Tabs (Horizontal)
│   │   ├─ Search in Menu
│   │   └─ Veg/Non-Veg Toggle
│   ├─ Menu Items List
│   │   ├─ Item Card
│   │   │   ├─ Image (Left/Right)
│   │   │   ├─ Name
│   │   │   ├─ Description
│   │   │   ├─ Price
│   │   │   ├─ Rating
│   │   │   ├─ Veg/Non-Veg Icon
│   │   │   ├─ Bestseller Badge
│   │   │   └─ Add Button (+/-)
│   │   └─ Customization Modal
│   ├─ Reviews Tab
│   └─ Info Tab
│
├─ 🛒 CART & CHECKOUT
│   ├─ Cart Screen
│   │   ├─ Restaurant Info
│   │   ├─ Items List (Editable)
│   │   ├─ Special Instructions
│   │   ├─ Bill Summary
│   │   └─ Proceed to Checkout
│   ├─ Checkout Screen
│   │   ├─ Delivery Address
│   │   ├─ Delivery Time Options
│   │   │   ├─ Standard
│   │   │   ├─ Express (₹20 extra)
│   │   │   └─ Schedule
│   │   ├─ Tip for Delivery Partner
│   │   ├─ Apply Coupon
│   │   ├─ Payment Method
│   │   └─ Bill Details (Itemized)
│   └─ Place Order Button
│
├─ 📦 ORDER TRACKING
│   ├─ Order Confirmation
│   ├─ Live Map View
│   │   ├─ Restaurant Location
│   │   ├─ Delivery Partner Location
│   │   ├─ Your Location
│   │   └─ Route Animation
│   ├─ Status Timeline
│   │   ├─ ✓ Order Placed
│   │   ├─ ✓ Restaurant Confirmed
│   │   ├─ ⏳ Preparing
│   │   ├─ ⏳ Out for Delivery
│   │   └─ ⏳ Delivered
│   ├─ ETA Countdown
│   ├─ Delivery Partner Card
│   │   ├─ Photo + Name
│   │   ├─ Rating
│   │   ├─ Call Button
│   │   └─ Chat Button
│   └─ Order Details (Collapsible)
│
└─ 📝 POST-ORDER
    ├─ Rate Your Experience
    │   ├─ Food Rating (1-5 stars)
    │   ├─ Delivery Rating
    │   ├─ Photo Upload
    │   └─ Written Review
    ├─ Help with Order
    └─ Reorder Button
```

---

## 🖼️ SECTION 3: SCREEN-BY-SCREEN DESIGN SPECIFICATIONS

### 3.1 SPLASH SCREEN

**Purpose:** Brand introduction, app initialization (2-3 seconds max)

#### Layout Specifications
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│           [GRIHGO LOGO]             │  120x120px, centered
│              🌱                     │  Animated entrance
│                                     │
│            GRIHGO                   │  32px, Bold, #2ECC71
│      Fresh. Fast. For Everyone.    │  14px, Regular, #5D6D7B
│                                     │
│                                     │
│                                     │
│         ● ○ ○ (Loading)             │  8px dots, subtle pulse
│                                     │
└─────────────────────────────────────┘
```

#### Animations
- Logo: Scale 0.8 → 1.0 with spring effect (800ms)
- Text: Fade in after logo (400ms delay)
- Loading dots: Pulse animation (continuous)

#### UI Prompt for Image Generation
```
Design a mobile splash screen for GRIHGO food delivery app.
- Clean white/light gray background (#F8F9FA)
- Centered GRIHGO logo with organic green leaves design
- Brand name "GRIHGO" in bold green text (#2ECC71) below logo
- Tagline "Fresh. Fast. For Everyone." in subtle gray
- Three animated loading dots at bottom (subtle pulse)
- Modern, minimal, premium feel
- No device frames, just the screen content
- Aspect ratio: 9:19.5 (iPhone 14 Pro)
```

---

### 3.2 ONBOARDING CAROUSEL (3 Screens)

**Purpose:** Introduce key value propositions to first-time users

#### Screen 1: "Discover Local Favorites"
```
┌─────────────────────────────────────┐
│                                     │
│     [Illustration: Person          │  280px height
│      browsing food on phone         │  Vibrant, friendly style
│      with floating food icons]      │
│                                     │
│                                     │
│    Discover Local Favorites         │  24px, Bold, #1A3A2D
│                                     │
│    Explore thousands of             │  16px, Regular, #5D6D7B
│    restaurants and cuisines         │  Centered, 2 lines max
│    near you.                        │
│                                     │
│         ● ○ ○                       │  Pagination dots
│                                     │
│    ┌─────────────────────────┐      │
│    │        Skip             │      │  Ghost button
│    └─────────────────────────┘      │
│    ┌─────────────────────────┐      │
│    │        Next →           │      │  Primary button
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 2: "Lightning Fast Delivery"
- Illustration: Delivery partner on scooter with speed lines
- Title: "Lightning Fast Delivery"
- Description: "Get your food delivered in minutes with real-time tracking."

#### Screen 3: "Save More, Eat More"
- Illustration: Person with coins, coupons, and food
- Title: "Save More, Eat More"
- Description: "Exclusive offers, loyalty rewards, and daily deals just for you."
- Button changes to: "Get Started" (Primary)

#### UI Prompt for Onboarding Screen 1
```
Design an onboarding illustration for a food delivery app.
Theme: "Discover Local Favorites"
- Show a happy young Indian person holding a smartphone
- Phone screen shows food app interface
- Floating around them: colorful food icons (biryani, pizza, burger, noodles)
- Background: Subtle gradient from white to light green (#F0FFF4)
- Illustration style: Modern, flat design with soft gradients
- Vibrant but not overwhelming colors
- Include subtle GRIHGO green (#2ECC71) accents
- Warm, inviting, and appetizing mood
- Size: 320x280px centered in viewport
```

---

### 3.3 LOGIN SCREEN

**Purpose:** Quick, frictionless authentication

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  ←                                  │  Back button (if from onboarding)
│                                     │
│         [GRIHGO LOGO]               │  80x80px, centered
│                                     │
│         Welcome to                  │  16px, Regular, #5D6D7B
│          GRIHGO                     │  28px, Bold, #1A3A2D
│                                     │
│    Order delicious food in          │  14px, Regular, #5D6D7B
│    just a few taps                  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ 🇮🇳 +91 │ Enter mobile number│  │  48px height, Combined input
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │      Continue with OTP      │  │  Primary button, full width
│    └─────────────────────────────┘  │
│                                     │
│    ─────────── or ───────────       │  Divider with text
│                                     │
│    ┌──────────┐  ┌──────────┐       │  Social login buttons
│    │  Google  │  │   Apple  │       │  48px height each
│    └──────────┘  └──────────┘       │
│                                     │
│                                     │
│    By continuing, you agree to      │  12px, #9CA3AF
│    our Terms & Privacy Policy       │  Links: #2ECC71
│                                     │
└─────────────────────────────────────┘
```

#### UI Prompt for Login Screen
```
Design a clean mobile login screen for GRIHGO food delivery app.
- Light background (#F8F9FA)
- GRIHGO logo (80x80px) at top center with green leaf design
- "Welcome to GRIHGO" heading in dark green text
- Subtitle: "Order delicious food in just a few taps"
- Phone number input field with Indian flag (+91) prefix
- Large green "Continue with OTP" button (#2ECC71)
- Divider with "or" text
- Google and Apple social login buttons (outline style)
- Footer: Terms and Privacy Policy links
- Clean, modern, premium design
- No device frames
```

---

### 3.4 OTP VERIFICATION SCREEN

**Purpose:** Secure verification with smooth UX

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  ←                                  │  Back button
│                                     │
│         Verify OTP                  │  24px, Bold, #1A3A2D
│                                     │
│    We've sent a 6-digit code to     │  14px, Regular, #5D6D7B
│    +91 98765 43210                  │  Phone number in bold
│                                     │
│    ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│    │  4 │ │  2 │ │  3 │ │  _ │ │  _ │ │  _ │  6 boxes, 48x56px
│    └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
│                                     │  Auto-focus, numeric keyboard
│                                     │
│    Resend OTP in 00:28              │  14px, #5D6D7B
│                                     │  Timer/Resend link
│                                     │
│    ┌─────────────────────────────┐  │
│    │      Verify & Continue      │  │  Primary button
│    └─────────────────────────────┘  │  Enabled when 6 digits entered
│                                     │
│                                     │
│    Didn't receive code?             │  After timer: "Resend OTP"
│    Call me instead                  │  Link: #2ECC71
│                                     │
└─────────────────────────────────────┘
```

---

### 3.5 HOME SCREEN

**Purpose:** Personalized discovery hub, quick access to food

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  📍 Home ▼                    🔔    │  Location + Notifications
│  123 Main Street, Koramangala       │  Address preview
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ 🔍 Search for restaurants...    ││  Search bar, 48px
│  └─────────────────────────────────┘│  Tap opens Search screen
│                                     │
│  ┌─────────────────────────────────┐│
│  │   50% OFF on your first order!  ││  Promotional banner
│  │   [Use code: FIRST50]     →     ││  Auto-carousel (3-5 banners)
│  └─────────────────────────────────┘│
│                                     │
│  🍕 Food  🛒 Grocery  🎁 Offers  •••│  Quick action chips
│                                     │
│  ── Hungry? Reorder ──              │  Section header
│  ┌─────────┐ ┌─────────┐            │
│  │ 🍛      │ │ 🍕      │            │  Past order cards
│  │ Biryani │ │ Pizza   │            │  Horizontal scroll
│  │ House   │ │ Hut     │            │
│  │ ₹450    │ │ ₹599    │            │
│  │[Reorder]│ │[Reorder]│            │
│  └─────────┘ └─────────┘            │
│                                     │
│  ── Popular Cuisines ──             │
│  (🍕)(🍜)(🍛)(🍔)(🍱)(🥗)(→)        │  Circular icons, scroll
│   Pizza Noodles Biryani ...         │
│                                     │
│  ── For You ★ AI Picks ──           │  Personalized section
│  ┌─────────────────────────────────┐│
│  │ [IMAGE]              4.2 ★      ││  Restaurant card
│  │ Paradise Biryani                ││  Full width
│  │ North Indian • 25 min • ₹200    ││
│  │ 50% OFF up to ₹100              ││  Offer badge
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [IMAGE] ...                     ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  🏠   🔍   ⏱️   ❤️   👤            │  Bottom navigation
│  Home Search Reorder Fav  Profile   │
└─────────────────────────────────────┘
```

#### UI Prompt for Home Screen
```
Design the home screen for GRIHGO food delivery app (Customer App).

Header:
- Location selector with down arrow at top left (📍 Home)
- Notification bell icon at top right
- Address preview below: "123 Main Street, Koramangala"

Search Bar:
- Prominent search input below header
- Placeholder: "Search for restaurants, dishes..."
- Search icon on left, microphone icon on right

Banner Carousel:
- Full-width promotional banner (180px height)
- "50% OFF on your first order!" with coupon code
- Green gradient background (#2ECC71 to #1E8449)
- Pagination dots below

Quick Actions:
- Horizontal row of circular icons: Food, Grocery, Offers, More
- Each with icon and label below

"Hungry? Reorder" Section:
- 2-3 past order cards (horizontal scroll)
- Each card shows: restaurant image, name, price, Reorder button

"Popular Cuisines" Section:
- Circular cuisine icons with labels
- Pizza, Noodles, Biryani, Burgers, Thali, Healthy
- Scrollable horizontally

"For You" Personalized Section:
- Full-width restaurant cards
- Large appetizing food image (200px height)
- Restaurant name, rating, cuisines, delivery time
- Offer badge overlay

Bottom Navigation:
- 5 tabs: Home (active), Search, Reorder, Favorites, Profile
- Active tab: green color (#2ECC71)
- Icons with labels

Style: Clean, modern, lots of white space, premium food photography
Background: #F8F9FA
Cards: White with subtle shadows
```

---

### 3.6 SEARCH SCREEN

**Purpose:** Fast, intelligent food and restaurant discovery

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  ← ┌───────────────────────────┐ 🎤 │  Auto-focused search
│    │ Search...                 │    │  Voice search button
│    └───────────────────────────┘    │
├─────────────────────────────────────┤
│                                     │
│  Recent Searches                    │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Biryani │ │ Pizza  │ │ Burger │   │  Chip tags
│  └────────┘ └────────┘ └────────┘   │
│                                     │
│  ── Trending Now 🔥 ──              │
│  1. Chicken Biryani                 │
│  2. Margherita Pizza                │
│  3. Butter Chicken                  │
│  4. Masala Dosa                     │
│  5. Pav Bhaji                       │
│                                     │
│  ── Popular Categories ──           │
│  ┌─────────┐ ┌─────────┐            │
│  │  🍕     │ │  🍔     │            │  Grid of categories
│  │  Pizza  │ │ Burgers │            │
│  └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐            │
│  │  🍛     │ │  🥗     │            │
│  │ Biryani │ │ Healthy │            │
│  └─────────┘ └─────────┘            │
│                                     │
└─────────────────────────────────────┘
```

#### Search Results State
```
┌─────────────────────────────────────┐
│  ← ┌───────────────────────────┐    │
│    │ Biryani                ✕  │    │  Active search
│    └───────────────────────────┘    │
├─────────────────────────────────────┤
│  Filters: Rating ▼  Time ▼  Veg ○   │  Filter chips
├─────────────────────────────────────┤
│  12 restaurants found               │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ [IMG] Paradise Biryani   4.3 ★  ││
│  │       Hyderabadi • 28 min       ││
│  │       ₹200 for two              ││
│  │       🏷️ 20% OFF                 ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [IMG] Meghana Foods      4.5 ★  ││
│  │       Andhra • 35 min           ││
│  │       ₹300 for two              ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

---

### 3.7 RESTAURANT DETAIL SCREEN

**Purpose:** Immersive menu browsing, easy ordering

#### Layout Specifications
```
┌─────────────────────────────────────┐
│                                     │
│  [HERO IMAGE - Full Width]          │  250px height
│  ← 🔍 ❤️ 📤                         │  Overlay buttons
│                                     │
├─────────────────────────────────────┤
│  Paradise Biryani            4.3 ★  │  Name + Rating
│  ✓ Verified                  (1.2K) │  Badge + Reviews count
│                                     │
│  Biryani, Hyderabadi, North Indian  │  Cuisines
│  📍 2.5 km  •  🕐 25-30 min         │  Distance + Time
│  💰 ₹200 for two                    │  Price range
│                                     │
│  ┌──────────────────────────────┐   │
│  │ 🎁 50% OFF up to ₹100       │   │  Offer banner
│  │   Use code: TASTY50          │   │
│  └──────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [Recommended] [Biryani] [Starters] │  Sticky category tabs
│  ┌─────────────────────────────────┐│  Horizontal scroll
│  │ 🔍 Search in menu          🥬 🍖││  Search + Veg toggle
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│                                     │
│  ── Bestsellers ★ ──                │
│  ┌─────────────────────────────────┐│
│  │ Chicken Biryani        [IMG]   ││  Menu item card
│  │ ★ Bestseller                    ││
│  │ Aromatic basmati rice...        ││
│  │ ₹280          ┌─────────┐       ││
│  │               │  ADD    │       ││
│  │               └─────────┘       ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Mutton Biryani         [IMG]   ││
│  │ Tender mutton pieces...         ││
│  │ ₹380          ┌─────────┐       ││
│  │               │  ADD    │       ││
│  │               └─────────┘       ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Starters ──                     │
│  ...                                │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ 1 item | ₹280    View Cart →   ││  Floating cart bar
│  └─────────────────────────────────┘│  Appears when items added
└─────────────────────────────────────┘
```

#### UI Prompt for Restaurant Detail Screen
```
Design the restaurant detail screen for GRIHGO food delivery app.

Hero Section:
- Full-width appetizing food image (250px height)
- Overlay: Back arrow, search icon, heart icon (favorite), share icon
- All icons in white with dark gradient overlay at top

Restaurant Info:
- Restaurant name: "Paradise Biryani" (24px, Bold)
- Green verified badge next to name
- Star rating with review count: "4.3 ★ (1.2K reviews)"
- Cuisines: "Biryani, Hyderabadi, North Indian"
- Delivery info: distance, time estimate, price for two
- Green offer banner: "50% OFF up to ₹100"

Menu Navigation (Sticky):
- Horizontal scrollable category tabs
- Categories: Recommended, Biryani, Starters, Breads, Beverages
- Active tab has green underline
- Search bar with Veg/Non-Veg toggle button

Menu Items:
- Each item: name, description (2 lines), price, image thumbnail
- "Bestseller" badge on popular items
- Green "ADD" button on right side
- Veg/Non-Veg indicator (green square / red triangle)

Floating Cart Bar:
- Fixed at bottom
- Shows item count, total amount
- "View Cart →" button in green

Style: Clean white background, large food images, easy to scan
```

---

### 3.8 CART SCREEN

**Purpose:** Order review and modification

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  ←  Your Cart                       │  Header
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ 🏪 Paradise Biryani      →      ││  Restaurant info
│  └─────────────────────────────────┘│  Tap to go back
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟢 Chicken Biryani              ││
│  │    Customize: Extra Raita       ││
│  │    ₹280          ┌─┬───┬─┐      ││
│  │                  │-│ 1 │+│      ││  Quantity controls
│  │                  └─┴───┴─┘      ││
│  ├─────────────────────────────────┤│
│  │ 🟢 Butter Naan                  ││
│  │    ₹45           ┌─┬───┬─┐      ││
│  │                  │-│ 2 │+│      ││
│  │                  └─┴───┴─┘      ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 📝 Add cooking instructions     ││  Optional field
│  │    "Less spicy please"          ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🎁 Apply Coupon           →     ││  Coupon input
│  │    TASTY50 applied! -₹100       ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Bill Details ──                 │
│  ┌─────────────────────────────────┐│
│  │ Item Total              ₹370    ││
│  │ Delivery Fee            ₹30     ││
│  │ Platform Fee            ₹5      ││
│  │ Discount (TASTY50)     -₹100    ││  Green text
│  ├─────────────────────────────────┤│
│  │ To Pay                  ₹305    ││  Bold, larger
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │  Proceed to Checkout   ₹305    ││  Primary button
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### 3.9 CHECKOUT SCREEN

**Purpose:** Final order confirmation with all details

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  ←  Checkout                        │  Header
├─────────────────────────────────────┤
│  ── Deliver To ──                   │
│  ┌─────────────────────────────────┐│
│  │ 🏠 Home                    Edit ││
│  │    123 Main Street,             ││
│  │    Koramangala, Bangalore       ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Delivery Type ──                │
│  ┌─────────┐ ┌─────────┐            │
│  │Standard │ │ Express │            │  Toggle selection
│  │ 25 min  │ │ 15 min  │            │
│  │   ₹30   │ │  +₹20   │            │
│  └─────────┘ └─────────┘            │
│                                     │
│  ── Tip Your Delivery Partner ──    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  │ ₹10│ │ ₹20│ │ ₹30│ │Other│       │  Tip chips
│  └────┘ └────┘ └────┘ └────┘        │
│  100% goes to your delivery partner │
│                                     │
│  ── Payment Method ──               │
│  ┌─────────────────────────────────┐│
│  │ 💳 Visa **** 4242        ✓     ││  Selected
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 📱 Google Pay                   ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 💵 Cash on Delivery             ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Bill Summary ──                 │
│  Item Total: ₹370                   │
│  Delivery: ₹30 | Discount: -₹100    │
│  Tip: ₹20 | Total: ₹325             │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │    Place Order   |   ₹325      ││  Swipe or tap
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### 3.10 ORDER TRACKING SCREEN

**Purpose:** Real-time order status with live map

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  ←  Track Order                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │     [LIVE MAP VIEW]             ││  60% of screen height
│  │                                 ││
│  │  🏪────────🛵────────📍         ││  Route visualization
│  │  Rest.    Driver    You         ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  Order #GRH-12345                   │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟢 Order Placed        12:30 PM ││  Completed
│  │ │                               ││
│  │ 🟢 Restaurant Confirmed 12:32   ││  Completed
│  │ │                               ││
│  │ ◉ Preparing Your Food   ~5 min ││  In Progress (pulse)
│  │ │                               ││
│  │ ○ Out for Delivery              ││  Pending
│  │ │                               ││
│  │ ○ Delivered                     ││  Pending
│  └─────────────────────────────────┘│
│                                     │
│  ── Arriving in 18 minutes ──       │  Large countdown
│                                     │
│  ┌─────────────────────────────────┐│
│  │ [Photo]  Raju M.        4.8 ★  ││  Driver card
│  │          Your Delivery Partner  ││
│  │  ┌────────┐  ┌────────┐         ││
│  │  │  Call  │  │  Chat  │         ││  Action buttons
│  │  └────────┘  └────────┘         ││
│  └─────────────────────────────────┘│
│                                     │
│  ▼ View Order Details               │  Collapsible
└─────────────────────────────────────┘
```

#### UI Prompt for Order Tracking Screen
```
Design the order tracking screen for GRIHGO food delivery app.

Map Section (Top 60%):
- Full-width map showing the route
- Three markers: Restaurant (store icon), Delivery Partner (scooter), Your Location (pin)
- Animated route line connecting all three
- Current location of delivery partner highlighted
- Clean, simple map style (like Google Maps)

Status Timeline:
- Vertical progress indicator
- Steps: Order Placed, Restaurant Confirmed, Preparing, Out for Delivery, Delivered
- Completed steps in green with checkmark
- Current step pulsing with animation
- Pending steps in gray

ETA Display:
- Large, prominent: "Arriving in 18 minutes"
- Countdown style

Delivery Partner Card:
- Partner photo (circular, 48px)
- Name and rating
- "Your Delivery Partner" label
- Call and Chat buttons (green outline)

Collapsible Order Details:
- Tap to expand
- Shows items ordered, bill summary

Style: Clean, informative, calming (reduce customer anxiety)
Green accents (#2ECC71) for completed/active states
```

---

### 3.11 PROFILE SCREEN

**Purpose:** Account management and settings hub

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  Profile                            │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ [Avatar]  Rahul Sharma         ││  User info card
│  │           +91 98765 43210       ││
│  │           View Activity →       ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🎁 You have 250 points!        ││  Rewards card
│  │    Redeem for ₹25 off    →     ││  Tappable
│  └─────────────────────────────────┘│
│                                     │
│  ── My Account ──                   │
│  ┌─────────────────────────────────┐│
│  │ 📍 My Addresses            →   ││
│  │ 💳 Payment Methods         →   ││
│  │ 📦 Order History           →   ││
│  │ 💰 GRIHGO Wallet           →   ││
│  │ 🎁 Refer & Earn            →   ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Settings ──                     │
│  ┌─────────────────────────────────┐│
│  │ 🌙 Dark Mode              [○]  ││  Toggle
│  │ 🔔 Notifications           →   ││
│  │ 🌐 Language               →   ││
│  │ 🥗 Dietary Preferences     →   ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Support ──                      │
│  ┌─────────────────────────────────┐│
│  │ ❓ Help Center             →   ││
│  │ 📞 Contact Us              →   ││
│  │ ⭐ Rate the App            →   ││
│  │ 📄 Terms & Privacy         →   ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Log Out                 ││  Red text
│  └─────────────────────────────────┘│
│                                     │
│  App Version 1.0.0                  │  Footer
└─────────────────────────────────────┘
```

---

### 3.12 FAVORITES SCREEN

**Purpose:** Quick access to saved restaurants and dishes

#### Layout Specifications
```
┌─────────────────────────────────────┐
│  Favorites                          │
├─────────────────────────────────────┤
│  [Restaurants] [Dishes] [Offers]    │  Tab bar
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ [IMG] Paradise Biryani   4.3 ★ ││
│  │       Biryani • 25 min          ││
│  │       ❤️ Saved                   ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [IMG] Domino's Pizza     4.1 ★ ││
│  │       Pizza • 30 min             ││
│  │       ❤️ Saved                   ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [IMG] Meghana Foods      4.5 ★ ││
│  │       Andhra • 35 min            ││
│  │       ❤️ Saved                   ││
│  └─────────────────────────────────┘│
│                                     │
│  ── Empty State (if no favorites)── │
│  │       ❤️                        ││
│  │  No favorites yet               ││
│  │  Save restaurants you love      ││
│  │  ┌───────────────────┐          ││
│  │  │ Explore Restaurants│          ││
│  │  └───────────────────┘          ││
│                                     │
└─────────────────────────────────────┘
```

---

## 🎬 SECTION 4: ANIMATIONS & MICRO-INTERACTIONS

### 4.1 Animation Principles

```
DURATION:
├─ Quick feedback: 150ms (button press, toggle)
├─ Smooth transition: 250ms (screen navigation)
├─ Playful animation: 400ms (decorative)
├─ Loading state: Continuous (skeleton shimmer)
└─ Maximum: 500ms (nothing longer)

EASING:
├─ Standard: cubic-bezier(0.16, 1, 0.3, 1) - Natural, bouncy
├─ Ease-out: cubic-bezier(0, 0, 0.2, 1) - UI default
├─ Spring: tension 50, friction 7 - For scale animations
└─ Never linear: Feels mechanical
```

### 4.2 Key Micro-Interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Button Press | onPress | Scale 0.98x, 150ms, haptic light |
| Add to Cart | Tap ADD | Button scales, cart icon bounces (+1 badge) |
| Heart/Favorite | Tap | Heart fills with scale pop (1.2x then 1x) |
| Pull to Refresh | Drag down | Spinner rotation, content slides down |
| Swipe to Delete | Swipe left | Red background reveals, item slides off |
| Tab Switch | Tap | Smooth crossfade, icon color change |
| Card Hover/Press | Press | Slight lift (translateY -4px), shadow increase |
| Loading Skeleton | Automatic | Shimmer gradient left-to-right, 1.5s loop |

### 4.3 Loading States

**Skeleton Screens (Preferred over spinners):**
- Show page structure immediately
- Gray placeholder blocks with shimmer animation
- Reduces perceived wait time by 50%
- Used for: Home, Restaurant, Cart screens

---

## 📐 SECTION 5: COMPONENT LIBRARY

### 5.1 Buttons

| Variant | Height | Background | Text | Border |
|---------|--------|------------|------|--------|
| Primary | 48px | #2ECC71 | #FFFFFF | none |
| Secondary | 48px | #FFFFFF | #2ECC71 | 1px #E0E0E0 |
| Outline | 48px | transparent | #2ECC71 | 2px #2ECC71 |
| Text | auto | transparent | #2ECC71 | none |
| Danger | 48px | #E74C3C | #FFFFFF | none |

**States:**
- Default: 100% opacity
- Pressed: 90% opacity, scale 0.98x
- Disabled: 50% opacity
- Loading: Spinner replaces text

### 5.2 Input Fields

| Property | Value |
|----------|-------|
| Height | 48px |
| Background | #F8F9FA (idle), #FFFFFF (focused) |
| Border | 1px #E0E0E0 (idle), 2px #2ECC71 (focused), 2px #E74C3C (error) |
| Border Radius | 8px |
| Padding | 0 16px |
| Font Size | 16px |
| Placeholder Color | #9CA3AF |

### 5.3 Cards

| Property | Value |
|----------|-------|
| Background | #FFFFFF (light), #1A4D3E (dark) |
| Border | 1px #E0E0E0 |
| Border Radius | 12px |
| Padding | 16px |
| Shadow | 0 2px 8px rgba(0,0,0,0.08) |
| Pressed State | Shadow increase, slight scale |

### 5.4 Restaurant Card

```
┌─────────────────────────────────────┐
│ [IMAGE: 160px height]               │
│ ❤️ (top-right overlay)              │
│ 🏷️ 20% OFF (if offer, bottom-left) │
├─────────────────────────────────────┤
│ Paradise Biryani              4.3 ★ │
│ Biryani, Hyderabadi                 │
│ 📍 2.5 km  •  🕐 25 min  •  ₹200   │
└─────────────────────────────────────┘
```

### 5.5 Menu Item Card

```
┌─────────────────────────────────────┐
│ 🟢 Chicken Biryani          [IMG]  │
│ ★ Bestseller                        │
│ Aromatic rice with tender...        │
│ ₹280              ┌─────────┐       │
│                   │   ADD   │       │
│                   └─────────┘       │
└─────────────────────────────────────┘
```

### 5.6 Status Badges

| Status | Background | Text Color |
|--------|------------|------------|
| New/Offer | #E67E22 | #FFFFFF |
| Bestseller | #FFD700 | #1A3A2D |
| Veg | #E8F5E9 | #27AE60 |
| Non-Veg | #FFEBEE | #E74C3C |
| Verified | #2ECC71 | #FFFFFF |
| Closed | #BDC3C7 | #5D6D7B |

---

## 📱 SECTION 6: RESPONSIVE CONSIDERATIONS

### 6.1 Safe Areas
- Status bar: 44px (iOS), dynamic (Android)
- Bottom safe: 34px (iOS home indicator)
- Tab bar height: 60px + bottom safe area

### 6.2 Touch Targets
- Minimum touch target: 44x44px
- Buttons: 48px height minimum
- Icons in navigation: 24px with 12px padding

### 6.3 Text Scaling
- Support iOS/Android dynamic type
- Minimum body text: 14px
- Test at 1.5x scale

---

## 🌓 SECTION 7: DARK MODE SPECIFICATIONS

### 7.1 Color Mapping

| Light Mode | Dark Mode |
|------------|-----------|
| Background #F8F9FA | Deep Green #0D2818 |
| Surface #FFFFFF | Dark Green #1A4D3E |
| Text Primary #1A3A2D | Light Mint #ECFDF5 |
| Text Secondary #5D6D7B | Sage #A5B8AB |
| Border #E0E0E0 | Dark Sage #4A6B5D |
| Primary #2ECC71 | Same #2ECC71 |

### 7.2 Images in Dark Mode
- Food images: No filter (keep appetizing)
- Illustrations: Adjust colors for dark backgrounds
- Icons: Invert or use light variants

---

## ✅ SECTION 8: ACCESSIBILITY CHECKLIST

- [ ] Color contrast ratio ≥ 4.5:1 for all text
- [ ] Touch targets ≥ 44x44px
- [ ] Focus indicators visible (2px ring)
- [ ] Labels for all form inputs
- [ ] Alt text for all images
- [ ] Screen reader compatible navigation
- [ ] Support for reduced motion preference
- [ ] Error messages are descriptive
- [ ] Voice search available
- [ ] Dark mode support

---

## 🚀 NEXT STEPS

1. **Review this document** - Ensure all screens and flows are covered
2. **Generate UI Mockups** - Create visual designs for each screen
3. **Create Prototype** - Interactive flows in Figma
4. **Development** - Implement using Expo React Native
5. **User Testing** - Validate with real users

---

**Document Version:** 1.0
**Last Updated:** January 9, 2026
**Author:** GRIHGO Design Team
