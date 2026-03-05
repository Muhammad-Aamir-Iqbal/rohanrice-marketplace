# Rohan Rice Marketplace

Professional rice-selling e-commerce platform for Narowal, Punjab, Pakistan.

## Live Access Paths

- Website (customer + backend APIs on same domain): `https://<your-domain>`
- Admin signup: `https://<your-domain>/admin/signup`
- Admin login: `https://<your-domain>/admin/login`

This project uses a **single URL architecture**:

- Frontend pages are served by Next.js.
- Backend APIs are served under `https://<your-domain>/api/backend/...`.

No separate frontend and backend domains are required.

## Implemented Scope

- Customer pages: Home, Shop, Product Detail, Blog, About, Contact, Cart, Checkout, Orders, Profile
- Admin panel pages: Dashboard, Products, Categories, Orders, Customers, Reviews, Blog Manager, Visitor Analytics, Contact Messages, Settings
- Separate customer/admin signup and login
- Email OTP + phone OTP verification flow on signup
- Cart, checkout, order management, sales metrics
- Review moderation (approve/delete)
- Blog management from admin
- Contact form storage in admin messages
- Visitor analytics and navigation history tracking
- Image upload support for product/admin/customer/blog forms
- Password hashing, route protection, and session handling
- No AI chatbot and no reCAPTCHA

## Local Development

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `copy .env.example .env.local` (Windows PowerShell)
3. Run app:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Deployment

- Push to GitHub.
- Deploy to Vercel.
- Keep `NEXT_PUBLIC_API_BASE_URL=/api/backend` so frontend + backend stay on one domain.

## Founder and Technical Rights

Platform founder/build ownership and technical rights statement is included in the About and Footer sections and can be updated from Admin Settings.
