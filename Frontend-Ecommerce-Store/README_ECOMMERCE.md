# Full-Stack eCommerce Store

A full-featured production-ready eCommerce application built with Next.js, React, TypeScript, and Tailwind CSS on the frontend, and Node.js/Express with MongoDB on the backend.

## 🎯 Features Implemented

### 1. **Foundation & Providers**
- ✅ Theme system with light/dark mode support (using OKLCH colors)
- ✅ Cart context with useReducer for state management, synced to Redis for logged-in users
- ✅ Authentication context backed by real JWT auth (custom backend) + NextAuth Google OAuth
- ✅ Global Navbar and Footer components
- ✅ Professional color scheme (navy primary, cream backgrounds, orange accents)

### 2. **Product Listing & Filters**
- ✅ Products page with advanced filtering (category, price range)
- ✅ Sorting options (price, rating, newest)
- ✅ Responsive product grid (1, 2, 3 columns)
- ✅ Product cards with ratings, favorites, quick add-to-cart
- ✅ Product detail pages with images, descriptions, and related products

### 3. **Shopping Cart**
- ✅ Dynamic cart with add/remove/update quantity
- ✅ Order summary with subtotal, shipping, tax
- ✅ Persistent cart state across navigation
- ✅ Cart synced to Redis (Upstash) for logged-in users — survives refresh and device switch, with localStorage fallback for guests
- ✅ Empty cart state with CTA to continue shopping
- ✅ Free shipping over $50 promotion

### 4. **Authentication**
- ✅ Login and signup with real email/password auth (bcrypt + JWT)
- ✅ Google OAuth login via NextAuth
- ✅ User profile display in navbar
- ✅ Logout functionality
- ✅ Auth-protected checkout flow
- ✅ Profile management — update name, change password
- ✅ Saved addresses — add, edit, delete, set default, used to autofill checkout

### 5. **Stripe Checkout**
- ✅ Checkout page with shipping form (autofills from saved addresses)
- ✅ Shipping method selection (Standard, Express, Overnight)
- ✅ Real Stripe payment integration (CardElement + PaymentIntent)
- ✅ Server-side price validation — totals recalculated from the database, not trusted from the client
- ✅ Stripe webhook (`payment_intent.succeeded`) confirms and fulfills orders independent of the client completing the flow
- ✅ Order summary with real-time calculations

### 6. **Order Management**
- ✅ Order confirmation page with success message
- ✅ Order tracking with status updates
- ✅ Orders history page for users
- ✅ Order detail pages with shipping info

### 7. **Admin Dashboard**
- ✅ Admin-only access control
- ✅ Key metrics dashboard (revenue, orders, customers, growth)
- ✅ Recent orders table with status
- ✅ Seller application approval workflow
- ✅ Product approval workflow
- ✅ Customer insights with satisfaction metrics

### 8. **Infrastructure & DevOps**
- ✅ MongoDB Atlas as primary database, with indexes on key lookup fields
- ✅ Redis (Upstash) for cart persistence and rate limiting
- ✅ Structured logging via Pino (JSON in production, pretty-printed locally)
- ✅ `/health` endpoint for uptime checks
- ✅ Dockerized frontend and backend, with `docker-compose.yml` to run the full stack (backend + frontend + MongoDB) locally in one command
- ✅ GitHub Actions CI — runs tests and build checks on every push/PR
- ✅ Jest test suites for backend (Supertest, route-level) and frontend (cart logic)

## 📁 Project Structure

/app
/admin # Admin dashboard (protected)
/auth
/login # Login page
/signup # Signup page
/cart # Shopping cart page
/checkout # Checkout page
/orders
/[id] # Order detail page
/order-confirmation
/[id] # Order confirmation page
/products
/[id] # Product detail page
/profile # Profile, addresses, seller application
page.tsx # Home page with hero and featured products
layout.tsx # Root layout with providers

/components
navbar.tsx # Main navigation with cart icon
footer.tsx # Footer with newsletter signup
product-card.tsx # Reusable product card component
ui/* # shadcn/ui components

/context
cart-context.tsx # Cart state management (Redis + localStorage sync)
auth-context.tsx # Authentication state management

/lib
api.ts # Backend API client functions
cart-utils.ts # Cart calculation logic (unit tested)

/public

Images and assets

Backend Ecommerce Store/
app.js # Express app
server.js # Entry point
/config # logger, redis
/controllers
/models
/routes
/middleware
/tests # Jest + Supertest
Dockerfile

docker-compose.yml
.github/workflows/ci.yml


## 🎨 Design System

**Color Palette:**
- Primary: Navy blue (OKLCH: 0.18, 0.02, 258)
- Accent: Warm orange (OKLCH: 0.65, 0.18, 25)
- Background: Cream (OKLCH: 0.98, 0.01, 65)
- Neutrals: Grays and whites
- Dark mode: Inverted navy backgrounds

**Typography:**
- Sans-serif: Geist (body and headings)
- Monospace: Geist Mono (code)

**Layout:**
- Mobile-first responsive design
- Flexbox for layouts
- Grid for product displays
- Max-width container: 7xl (80rem)

## 🔧 Tech Stack

- **Frontend Framework:** Next.js with App Router
- **UI Library:** shadcn/ui with Tailwind CSS
- **State Management:** React Context + useReducer
- **Icons:** Lucide React
- **Authentication:** JWT (custom backend) + NextAuth (Google OAuth)
- **Styling:** Tailwind CSS with OKLCH colors
- **Type Safety:** TypeScript
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Cache/Session Store:** Redis (Upstash)
- **Payments:** Stripe
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Testing:** Jest, Supertest, React Testing Library

## 🚀 Getting Started

### Option A — Docker (recommended)
```bash
docker compose up --build
```
This starts backend (`:5000`), frontend (`:3000`), and MongoDB (`:27017`) together. Redis stays on managed Upstash — set `REDIS_URL` in your backend `.env`.

### Option B — Manual

1. **Backend:**
```bash
   cd "Backend Ecommerce Store"
   npm install
   npm run dev
```

2. **Frontend:**
```bash
   cd Frontend-Ecommerce-Store
   npm install
   npm run dev
```

3. **Open browser:**
   - Visit `http://localhost:3000`
   - Navigate to `/products` to browse items
   - Add items to cart
   - Register or log in via `/auth/login`
   - Proceed to `/checkout` — test card: `4242 4242 4242 4242`

4. **Access admin dashboard:**
   - Requires `isAdmin: true` on your user document in MongoDB
   - Navigate to `/admin`

## 🧪 Running Tests

```bash
# Backend
cd "Backend Ecommerce Store"
npm test

# Frontend
cd Frontend-Ecommerce-Store
npm test
```

CI runs both automatically on every push/PR via GitHub Actions.

## 📝 Environment Variables

**Backend `.env`:** `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

**Frontend `.env.local`:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXTAUTH_SECRET`, Google OAuth credentials

## 🎯 Next Steps

1. **Broader test coverage** — checkout flow, auth middleware, cart sync
2. **E2E tests** with Playwright
3. **CI auto-deploy** to Render/Vercel on merge to `main`
4. **Error tracking** with Sentry

## 📄 Deployment

Currently deployed — backend on **Render**, frontend on **Vercel**, database on **MongoDB Atlas**, cache on **Upstash Redis**.

## 📄 License

This project is ready for use in commercial applications.