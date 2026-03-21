# SafeAtHome Guide

A consumer-facing directory and buyer's guide for aging-in-place home safety — covering products (stairlifts, walk-in tubs, grab bars), local certified contractors (CAPS-credentialed), cost guides, and comparison content.

Monetizes via affiliate commissions, lead sales, and contractor subscription listings.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Database:** Supabase (Postgres)
- **Email:** Resend
- **Payments:** Stripe
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/products` | Product directory (filterable) |
| `/products/[category]/[slug]` | Individual product review |
| `/contractors` | Contractor search |
| `/contractors/[state]/[city]` | City contractor page (programmatic SEO) |
| `/guides/[slug]` | Cost guides + educational content |
| `/compare/[slug]` | Comparison pages |
| `/assess` | Home assessment interactive tool |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
AMAZON_TRACKING_ID=
```
