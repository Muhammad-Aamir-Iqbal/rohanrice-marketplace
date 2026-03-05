# Deployment Guide (Single URL)

## Goal

Deploy frontend and backend under one domain:

- Frontend pages: `https://your-domain/...`
- Backend APIs: `https://your-domain/api/backend/...`

## Environment Variables

Set these in your deployment platform (for example, Vercel):

- `NODE_ENV=production`
- `NEXTAUTH_URL=https://your-domain`
- `NEXTAUTH_SECRET=<secure-random-value>`
- `NEXT_PUBLIC_API_BASE_URL=/api/backend`
- `MONGODB_URI=<your-mongodb-connection-string>`
- `JWT_SECRET=<secure-random-value>`
- `JWT_EXPIRE=7d`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (optional)
- `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_KEY`, `ALGOLIA_INDEX_NAME` (optional)

## Deploy Steps

1. Push code to GitHub:
   - `git push origin main`
2. Deploy to Vercel:
   - `vercel --prod`
3. Verify routes:
   - Website: `https://your-domain`
   - Admin signup: `https://your-domain/admin/signup`
   - Admin login: `https://your-domain/admin/login`
   - Backend health: `https://your-domain/api/backend/health`

## Post-Deploy Checks

- Customer can browse products without login.
- Customer cannot checkout or review before login.
- Cart icon opens cart/login flow.
- Admin can login and manage products/categories/orders/reviews/blog/messages/settings.
- Analytics and sales cards show in admin dashboard.
- No AI chatbot UI and no reCAPTCHA in auth flow.
