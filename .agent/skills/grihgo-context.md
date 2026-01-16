---
name: GRIHGO Project Context
description: Master skill providing complete project context, architecture overview, and development guidelines for the GRIHGO Customer App
---

# GRIHGO Project Context Skill

> **Purpose:** Reference this skill to understand the overall project context, ecosystem, architecture, and development standards for the GRIHGO Customer App.

---

## 🎯 Project Overview

### Quick Reference

| Field | Value |
|-------|-------|
| **App Name** | GRIHGO Customer App |
| **Type** | Food Delivery Mobile App (Customer-facing) |
| **Platform** | iOS + Android (React Native) |
| **Framework** | Expo SDK 54 + TypeScript |
| **Status** | 42% Complete (MVP Stage) |
| **Part of** | GRIHGO Ecosystem (3-app platform) |

### What This App Does

1. **Browse** - Customers browse restaurants and food items
2. **Order** - Add items to cart and place orders
3. **Track** - Track orders in real-time
4. **Pay** - Multiple payment methods (UPI, Card, Wallet, COD)
5. **Rate** - Rate and review completed orders

---

## 🏢 GRIHGO Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                      GRIHGO PLATFORM                         │
├──────────────────┬──────────────────┬──────────────────────┤
│  CUSTOMER APP    │   PARTNER APP    │    DELIVERY APP      │
│  (This App)      │   (Restaurants)  │    (Drivers)         │
│                  │                  │                      │
│  Status: 42%     │   Status: 35%    │    Status: 0%        │
│  27 screens      │   20 screens     │    Not started       │
└──────────────────┴──────────────────┴──────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   SHARED BACKEND  │
                    │  (PostgreSQL+Redis)│
                    │   Status: 0%      │
                    └───────────────────┘
```

### Data Flow

```
1. Customer places order (Customer App)
   ↓ REST API
2. Order created in database
   ↓ WebSocket notification
3. Partner receives order (Partner App)
   ↓ Partner accepts
4. Delivery assigned (Delivery App)
   ↓ GPS tracking WebSocket
5. Customer sees real-time location
```

### Related Folders

```
food delivery partner app/
├── grihgo-customer-app/       ← This app (42% complete)
├── grihgo-partner-app/        ← Restaurant app (35% complete)
├── grihgo-delivery-app/       ← Delivery app (0% - empty)
├── ecosystem-reports/         ← Multi-app reports
└── shared-resources/          ← Brand guidelines
```

---

## 🛠️ Tech Stack

### Frontend

```
React Native       : 0.81.5
Expo SDK           : 54
TypeScript         : 5.9
Expo Router        : 6.x (file-based routing)
Reanimated         : 3.x (animations)
```

### State Management

```
React Context API:
├── AuthContext     → User authentication state
├── CartContext     → Shopping cart logic
└── ThemeContext    → Dark/Light mode
```

### UI

```
Icons              : Lucide React Native + MaterialCommunityIcons
Font               : Inter (Google Fonts)
Primary Color      : #2ECC71 (GRIHGO Green)
```

### Backend (To Be Implemented)

```
API                : REST + WebSocket
Database           : PostgreSQL 15+
Cache              : Redis
Payment            : Razorpay
Push Notifications : Firebase FCM
```

---

## 📁 Project Structure

```
grihgo-customer-app/
├── src/
│   ├── app/                        # Expo Router Screens (27 files)
│   │   ├── (auth)/                 # Auth Flow
│   │   │   ├── onboarding.tsx
│   │   │   ├── login.tsx
│   │   │   └── otp.tsx
│   │   ├── (tabs)/                 # Main Tab Navigation
│   │   │   ├── index.tsx           # Home
│   │   │   ├── search.tsx
│   │   │   ├── reorder.tsx
│   │   │   ├── favorites.tsx
│   │   │   └── profile.tsx
│   │   ├── cart/
│   │   │   ├── index.tsx
│   │   │   └── checkout.tsx
│   │   ├── restaurant/
│   │   │   └── [id].tsx
│   │   ├── food/
│   │   │   └── [id].tsx
│   │   └── _layout.tsx
│   ├── components/
│   │   ├── ui/                     # Reusable UI Components
│   │   ├── sections/               # Home Screen Sections
│   │   └── cards/
│   ├── context/                    # State Management
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── constants/                  # Design tokens
│   ├── data/                       # Mock data
│   ├── types/                      # TypeScript interfaces
│   └── utils/                      # Utility functions
├── reports/                        # 8 Comprehensive Reports
├── design-docs/                    # Design Specifications
└── .agent/skills/                  # AI Skills (this folder)
```

---

## 📊 Development Status

### ✅ Complete (Production Ready)

| Feature | File | Notes |
|---------|------|-------|
| Splash Screen | `app/index.tsx` | Auto-routes based on auth |
| Onboarding | `app/(auth)/onboarding.tsx` | 3-slide carousel |
| Phone Login | `app/(auth)/login.tsx` | Validation, social buttons |
| OTP Verification | `app/(auth)/otp.tsx` | 6-digit, auto-focus |
| Home Screen | `app/(tabs)/index.tsx` | Full sections |
| Restaurant Detail | `app/restaurant/[id].tsx` | Parallax header |
| Cart Screen | `app/cart/index.tsx` | Full cart management |
| Checkout | `app/cart/checkout.tsx` | Address, payment |
| Design System | `constants/index.ts` | Complete tokens |
| Dark Mode | `context/ThemeContext.tsx` | 100% coverage |

### ⚠️ Partial (Needs Completion)

| Feature | File | Issue |
|---------|------|-------|
| Search | `app/(tabs)/search.tsx` | Needs review |
| Reorder | `app/(tabs)/reorder.tsx` | Needs review |
| Favorites | `app/(tabs)/favorites.tsx` | No persistence |
| Order Tracking | `app/order/[id].tsx` | Needs real-time |
| Settings | `app/settings/*` | All need review |

### ❌ Missing (Not Started)

| Feature | Priority |
|---------|----------|
| Backend Integration | P0 |
| Payment Gateway | P0 |
| Real-time Tracking | P0 |
| Testing | P0 |
| Address Management | P1 |
| Order History | P1 |
| GRIHGO Wallet | P2 |
| Loyalty/Rewards | P2 |

---

## 📚 Available Reports

| # | Report | Use For |
|---|--------|---------|
| 00 | MASTER-SUMMARY.md | Big picture overview |
| 01 | FRONTEND-DEVELOPER-REPORT.md | Before coding any screen |
| 02 | UI-UX-DESIGNER-REPORT.md | UI/styling work |
| 03 | BACKEND-API-REPORT.md | API integration |
| 04 | DATABASE-REPORT.md | Data layer work |
| 05 | RESEARCH-TRENDS-REPORT.md | Feature planning |
| 06 | QA-TESTING-REPORT.md | Testing |
| 07 | IMPROVEMENTS-ROADMAP.md | Prioritization |

**Location:** `grihgo-customer-app/reports/`

---

## 🔑 Key Files Reference

### Contexts

```typescript
// AuthContext - User state
const { isAuthenticated, user, login, logout } = useAuth();

// CartContext - Cart state
const { items, total, addItem, removeItem, clearCart } = useCart();

// ThemeContext - Theme state
const { colors, theme, isDark, toggleTheme } = useTheme();
```

### Constants

```typescript
import { 
  COLORS,        // All color values
  LIGHT_THEME,   // Light mode colors
  DARK_THEME,    // Dark mode colors
  TYPOGRAPHY,    // Text styles
  SPACING,       // Spacing values
  RADIUS,        // Border radius
  SHADOWS,       // Shadow definitions
} from '@/constants';
```

### Mock Data

```typescript
import { 
  RESTAURANTS,   // Restaurant list
  MENU_ITEMS,    // Food items
  CUISINES,      // Cuisine categories
  BANNERS,       // Promotional banners
} from '@/data/mockData';
```

---

## 📝 Development Guidelines

### DO's ✅

- Read relevant report before coding
- Follow existing code patterns
- Use TypeScript strictly (no `any`)
- Use design tokens from constants
- Test both light and dark modes
- Handle loading, error, empty states
- Use React Context for global state
- Add accessibility labels

### DON'Ts ❌

- Hardcode colors (use `colors.primary`)
- Skip error handling
- Ignore TypeScript errors
- Create new patterns (follow existing)
- Skip dark mode support
- Leave console.log in production

---

## 🚀 Quick Commands

```bash
# Navigate to project
cd "grihgo-customer-app"

# Install dependencies
npm install

# Start development
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Clear cache
npx expo start -c

# Type check
npx tsc --noEmit

# Build (Android)
eas build --platform android
```

---

## 🎯 Priority Tasks

1. **Complete Order Tracking Screen** (Critical)
   - File: `app/order/[id].tsx`
   - Need: Real-time status, delivery partner, map

2. **Create API Service Layer**
   - Pattern in: `api-integration.md` skill
   - Replace mock data with services

3. **Add Data Persistence**
   - Cart should persist (AsyncStorage)
   - Favorites should persist

4. **Implement Testing**
   - Pattern in: `testing-qa.md` skill
   - Target: 70% coverage

5. **Complete Missing Screens**
   - Address Management
   - Payment Methods
   - Order History

---

## 📎 Related Skills

| Skill | When to Use |
|-------|-------------|
| `react-native-component.md` | Creating components |
| `screen-development.md` | Creating screens |
| `code-review-debugging.md` | Reviewing/debugging |
| `accessibility.md` | Accessibility work |
| `performance-optimization.md` | Performance issues |
| `api-integration.md` | Backend integration |
| `testing-qa.md` | Writing tests |
| `design-system.md` | Styling/theming |

---

*This skill provides the foundational context for all GRIHGO Customer App development.*
