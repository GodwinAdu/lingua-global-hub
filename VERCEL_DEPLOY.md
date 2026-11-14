# Vercel Deployment Guide

The site is a Next.js 16 (App Router) app. Vercel detects it automatically; no `vercel.json` is needed.

## Environment variables

Set these in Vercel > Project Settings > Environment Variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://firstgradelingua.com`. Used for canonical URLs, sitemap, Open Graph and share links. |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `EMAIL_TO` | SMTP settings for the contact form |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase project (dashboard/CMS) |
| `SUPABASE_SECRET_KEY` | Server-only Supabase key. Never prefix with `NEXT_PUBLIC_`. |
| `PAYSTACK_SECRET_KEY` | Server-only Paystack key for paid ebooks |

## Local development

```bash
cp .env.example .env.local   # fill in values
pnpm install
pnpm dev                     # http://localhost:3000
```

The contact form API (`src/app/api/contact/route.ts`) runs inside `next dev`; `vercel dev` is no longer needed.

## Deploy

Push the branch to GitHub and import it in Vercel, or run `vercel --prod`.
