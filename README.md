# Vistora

Vistora is an online store app made with **Next.js 14**, **TypeScript**,
**PostgreSQL** and **Prisma**.

---

## Features

- User authentication (NextAuth)
- Admin dashboard with analytics
- Stripe & PayPal integration
- Product, user, and order management
- Image upload (UploadThing)
- Ratings and reviews
- Search, filter, sort, and pagination
- Dark/light mode toggle
- Responsive design

---

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** PostgreSQL, Prisma, NextAuth
- **Payments:** Stripe & PayPal
- **Uploads:** UploadThing
- **Emails:** Resend

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

If you get peer dependency errors:

```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env` file in the root of the project and add the following
environment variables based on your own setup:

```env
NEXT_PUBLIC_APP_NAME="Vistora"
NEXT_PUBLIC_APP_DESCRIPTION="Ecommerce store built with Next.js"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

DATABASE_URL="your_postgres_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"

PAYMENT_METHODS="Paypal, Stripe, CashOnDelivery"
DEFAULT_PAYMENT_METHOD="Paypal"

PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_APP_SECRET="your_paypal_app_secret"

UPLOADTHING_TOKEN="your_uploadthing_token"
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APPID="your_uploadthing_app_id"
```

### 3. Run the App

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:3000
```

### 4. Seed the Database

```bash
npx tsx ./db/seed
```

---
