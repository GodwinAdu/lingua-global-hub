# Vercel Deployment Guide

## Setup

1. Install Vercel CLI (optional for local testing):
```bash
npm i -g vercel
```

2. Configure environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add these variables:
     - `EMAIL_HOST` = smtp.gmail.com
     - `EMAIL_PORT` = 587
     - `EMAIL_USER` = your-email@gmail.com
     - `EMAIL_PASS` = your-app-password
     - `EMAIL_FROM` = your-email@gmail.com
     - `EMAIL_TO` = info@firstgradelingua.com

## Deploy

### Option 1: Deploy via Vercel Dashboard
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Option 2: Deploy via CLI
```bash
vercel --prod
```

## Local Development

The contact form will work with Vercel's dev server:
```bash
vercel dev
```

Or use the regular dev server (API won't work locally without vercel dev):
```bash
npm run dev
```

## How it works

- `/api/contact.js` is a serverless function
- Automatically deployed to `/api/contact` endpoint
- Works on both Vercel and local with `vercel dev`
- No separate server needed!
