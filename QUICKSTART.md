# RohanRice Marketplace - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Prerequisites
- Node.js 18.x or 20.x
- pnpm (recommended) or npm
- Git

### 2. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd rohanrice-marketplace

# Install dependencies
pnpm install
# or: npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add:
# - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
# - NEXT_PUBLIC_API_BASE_URL (your backend URL)
# - Other keys from .env.example (optional for local dev)
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000**

---

## 📖 Project Structure Quick Reference

```
src/pages/          → Routes (index.js = /, shop.js = /shop)
src/components/     → Reusable UI components (Layout, Footer, etc.)
src/services/       → API calls (api.js, auth.js)
src/context/        → React state (AuthContext)
src/styles/         → CSS (globals.css)
public/             → Static files
tailwind.config.js  → Tailwind CSS colors & components
next.config.js      → Next.js settings
```

---

## 🚀 Available Commands

```bash
pnpm dev        # 🚀 Start dev server (http://localhost:3000)
pnpm build      # 🏗️  Build for production
pnpm start      # ▶️  Run production build locally
pnpm lint       # ✅ Check code style
pnpm test       # 🧪 Run tests
```

---

## 🎨 Key Features to Explore

1. **Homepage** (`/`) - Hero section, certifications, rice varieties
2. **Shop** (`/shop`) - Browse 6 rice varieties, filters, bulk order modal
3. **Login** (`/login`) - 3 auth methods: Email, OTP, Google
4. **Admin Dashboard** (`/admin`) - 5 tabs: Overview, Orders, Stock, Ledger, Messages
5. **About** (`/about`) - Company mission, team, heritage
6. **Contact** (`/contact`) - Inquiry form with FAQ

---

## 🎨 Customization Guide

### Change Colors
Edit `tailwind.config.js` → scroll to `extend.colors` section

**Current Palette:**
- Primary: Rice Beige (#d4a76e)
- Secondary: Rice Green (#5a9c3d)
- Accent: Rice Gold (#ffb726)

### Change Company Name
Search & replace "RohanRice" in:
- `pages/index.js`
- `components/Layout.js`
- `components/Footer.js`
- `globals.css`
- Documentation files

### Change API Endpoint
Edit `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://your-backend-url
```

---

## 🧪 Testing Authentication

### Email/Password Login
- No backend needed (returns mock token)
- Email: `any@email.com`
- Password: `any-password`

### OTP Login
- Enter any email
- Check console for OTP (displayed in API response)
- Verify OTP code (6 digits)

### Google OAuth
- Need Google Client ID (from Google Cloud Console)
- Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

---

## 🐛 Troubleshooting

### "NEXTAUTH_SECRET not set"
```bash
# Generate random secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=<generated-value>
```

### Port 3000 already in use
```bash
pnpm dev -- -p 3001
```

### Tailwind styles not applying
```bash
# Clear Next.js cache and rebuild
rm -rf .next
pnpm build
pnpm dev
```

### Can't connect to backend
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure backend is running
- Check browser console for CORS errors

---

## 📱 Mobile Testing

### Chrome DevTools
1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Click device toggle (top-left)
4. Test on iPhone SE / Pixel 5 breakpoints

### Real Device
1. Find your computer's IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. Visit `http://<your-ip>:3000` on phone
3. Test on iOS Safari & Android Chrome

---

## 🚢 Deployment Preview

### Deploy to Vercel (Production)
```bash
# Push to GitHub
git push origin main

# Import in Vercel dashboard
# Add environment variables
# Deploy automatically on push
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📚 Learn More

- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **NextAuth.js**: https://next-auth.js.org/
- **React**: https://react.dev/

---

## 💡 Pro Tips

1. **Use VS Code Extensions**:
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - Code Spell Checker

2. **Debug React State**:
   - Install React DevTools browser extension
   - Inspect component props in browser

3. **Test Email Links**:
   - Use Mailtrap for mock SMTP
   - Add to `.env.local`: `SMTP_HOST=smtp.mailtrap.io`

4. **Performance Check**:
   - Run: `npm run build && npm run start`
   - Check terminal for build output size

---

## 🆘 Need Help?

1. Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for detailed docs
2. Review [README.md](./README.md) for full feature list
3. Check console/terminal for error messages
4. Read code comments (marked with `TODO:` for incomplete features)

---

**Last Updated**: January 2025
**Version**: 1.0.0
