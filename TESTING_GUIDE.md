# RohanRice Marketplace - Testing & Validation Guide

## 🧪 Comprehensive Testing Checklist

### Before Launching to Production

---

## 1️⃣ Unit Tests

### Pages
- [ ] **Home Page** (`/`)
  - [ ] Hero section renders
  - [ ] Stats display correctly
  - [ ] Featured varieties grid shows 3 items
  - [ ] CTA buttons are clickable
  - [ ] Links navigate correctly

- [ ] **Shop Page** (`/shop`)
  - [ ] All 6 rice varieties load
  - [ ] Filter/sort bar works
  - [ ] Modal opens on product click
  - [ ] Bulk order inquiry form submits
  - [ ] Stock indicators display

- [ ] **Login Page** (`/login`)
  - [ ] Email tab shows email input
  - [ ] OTP tab shows email + modal
  - [ ] Google button renders
  - [ ] Error messages display
  - [ ] Form validation works (email format)

- [ ] **About Page** (`/about`)
  - [ ] Mission/Vision cards display
  - [ ] Timeline shows 5 milestones
  - [ ] Team members visible
  - [ ] Compliance section loads

- [ ] **Goals Page** (`/goals`)
  - [ ] 2026 targets display with progress bars
  - [ ] 2030 vision goals listed
  - [ ] Impact metrics show
  - [ ] Investment section visible

- [ ] **Contact Page** (`/contact`)
  - [ ] Contact form fields present
  - [ ] Form submission succeeds
  - [ ] Success message appears
  - [ ] FAQ questions display
  - [ ] Countries grid loads

- [ ] **Admin Dashboard** (`/admin`)
  - [ ] 4 metric cards visible
  - [ ] All 5 tabs clickable (Overview, Orders, Stock, Ledger, Messages)
  - [ ] Tables display mock data
  - [ ] Status badges render correctly
  - [ ] (Protected: redirects to login if not authenticated)

### Components
- [ ] **Layout Component**
  - [ ] Header/nav renders
  - [ ] Logo clickable (home)
  - [ ] Mobile hamburger menu works
  - [ ] AI Help widget visible
  - [ ] Footer renders

- [ ] **AIHelpWidget Component**
  - [ ] Floating button visible (bottom-right)
  - [ ] Modal opens on click
  - [ ] Modal closes on X button
  - [ ] Popular questions clickable
  - [ ] Input form submits
  - [ ] Response displays

- [ ] **Footer Component**
  - [ ] All 4 columns visible
  - [ ] Social links present
  - [ ] Copyright text shows
  - [ ] Trust badges display

### Services & Utils
- [ ] **API Service** (`api.js`)
  - [ ] Axios instance created with baseURL
  - [ ] Request interceptor adds Authorization header
  - [ ] Response interceptor handles 401
  - [ ] All service wrappers exported

- [ ] **Auth Service** (`auth.js`)
  - [ ] NextAuth providers configured
  - [ ] JWT strategy set
  - [ ] Credentials provider works
  - [ ] Google provider configured (with Client ID)

- [ ] **SEO Service** (`seo.js`)
  - [ ] Meta tags generated
  - [ ] Structured data created
  - [ ] Open Graph tags work

---

## 2️⃣ Integration Tests

### Authentication Flow
- [ ] **Email/Password Login**
  - [ ] User enters email
  - [ ] User enters password
  - [ ] Form submits to `/api/auth/login`
  - [ ] Token returned and stored
  - [ ] User redirected to home
  - [ ] Logout removes token

- [ ] **OTP Login**
  - [ ] User enters email
  - [ ] Form submits to `/api/auth/request-otp`
  - [ ] OTP modal appears
  - [ ] User enters 6-digit code
  - [ ] Form submits to `/api/auth/verify-otp`
  - [ ] Token returned and stored
  - [ ] User redirected home

- [ ] **Google OAuth**
  - [ ] Google button visible
  - [ ] Click triggers OAuth flow
  - [ ] Redirects to Google login (if not logged in)
  - [ ] Allows account selection
  - [ ] Returns to `/` after login
  - [ ] User info stored in session

### Form Submissions
- [ ] **Contact Form**
  - [ ] All fields required
  - [ ] Email format validated
  - [ ] Form submits to `/api/contact`
  - [ ] Success message appears
  - [ ] Message clears after 5 seconds
  - [ ] Form resets

- [ ] **Bulk Order Inquiry**
  - [ ] Accessible from shop modal
  - [ ] Rice variety auto-selected
  - [ ] Quantity field accepts numbers
  - [ ] Company name field works
  - [ ] Form submits to backend
  - [ ] Success notification

### Navigation
- [ ] **Header Navigation**
  - [ ] All nav links work
  - [ ] Active page highlighted
  - [ ] Mobile menu toggles on small screens
  - [ ] Links close menu on click

- [ ] **Internal Links**
  - [ ] "Browse Marketplace" → `/shop`
  - [ ] "Request Quote" → `/contact`
  - [ ] "Contact Sales" → `/contact`
  - [ ] Logo → `/`

---

## 3️⃣ End-to-End (E2E) Tests

### User Journeys
- [ ] **New Visitor Journey**
  1. Land on `/`
  2. Read hero section
  3. Browse featured varieties
  4. Click "Browse Marketplace"
  5. View all rice varieties on `/shop`
  6. Click on product → view modal
  7. Close modal
  8. Navigate to `/about`
  9. Read about company
  10. Navigate to `/contact`
  11. Fill and submit contact form
  12. See success message

- [ ] **Buyer Journey**
  1. Visit `/shop`
  2. Filter/sort rice varieties
  3. Click product → view details
  4. Click "Request Bulk Order"
  5. Fill bulk inquiry form
  6. Submit
  7. Get confirmation

- [ ] **Authentication Journey**
  1. Click "Login" in header
  2. Try Email/Password → login
  3. See dashboard
  4. Click Logout
  5. Try OTP → request OTP
  6. Enter OTP code
  7. Get logged in
  8. Verify user info displays

- [ ] **Admin Dashboard Journey**
  1. Login as admin
  2. Navigate to `/admin`
  3. See 4 metric cards
  4. Click "Orders" tab → see orders table
  5. Click "Stock" tab → see inventory
  6. Click "Ledger" tab → see transactions
  7. Click "Messages" tab → see inquiries
  8. Click "Overview" tab → return to overview

---

## 4️⃣ Mobile & Responsiveness Tests

### Breakpoints
- [ ] **Mobile (320px - 480px)**
  - [ ] All text readable without zoom
  - [ ] Buttons easily tappable (48px minimum)
  - [ ] Images scale properly
  - [ ] Navigation menu collapses
  - [ ] Modal fits screen
  - [ ] Forms one-column layout

- [ ] **Tablet (481px - 768px)**
  - [ ] Layout optimized for tablet
  - [ ] Navigation visible (or expandable menu)
  - [ ] Cards properly spaced
  - [ ] Images not stretched

- [ ] **Desktop (769px+)**
  - [ ] Full layout visible
  - [ ] Multi-column layouts work
  - [ ] Hover states visible (buttons, links)
  - [ ] Modals centered

### Devices
- [ ] **iPhone SE** (375px)
  - [ ] All content visible
  - [ ] Touch targets appropriately spaced
  - [ ] No horizontal scroll

- [ ] **iPhone 12 Pro** (390px)
  - [ ] Renders correctly
  - [ ] Safe area respected

- [ ] **iPhone 14 Pro Max** (430px)
  - [ ] Layout not broken
  - [ ] Text not too large

- [ ] **Android (Pixel 5)** (393px)
  - [ ] Chrome renders correctly
  - [ ] Touch targets work
  - [ ] Performance acceptable

- [ ] **iPad** (768px+)
  - [ ] Tablet layout works
  - [ ] Landscape orientation
  - [ ] Portrait orientation

### Orientation
- [ ] **Portrait Mode**
  - [ ] All pages display correctly
  - [ ] No content cutoff
  - [ ] Readable without zoom

- [ ] **Landscape Mode**
  - [ ] Layout adjusts
  - [ ] Navigation accessible
  - [ ] Forms single-column

---

## 5️⃣ Performance Tests

### Lighthouse Audit
```bash
# Generate Lighthouse report (production build)
pnpm build && pnpm start
# Then: DevTools → Lighthouse → Analyze Page Load
```

**Target Scores**:
- [ ] **Performance**: 90+
- [ ] **Accessibility**: 90+
- [ ] **Best Practices**: 90+
- [ ] **SEO**: 95+

### Specific Metrics
- [ ] **Largest Contentful Paint (LCP)**: < 2.5s
- [ ] **First Input Delay (FID)**: < 100ms
- [ ] **Cumulative Layout Shift (CLS)**: < 0.1
- [ ] **First Contentful Paint (FCP)**: < 1.8s

### Bundle Size
- [ ] Page bundle < 200KB (gzipped)
- [ ] Images optimized (WebP/AVIF)
- [ ] Unused CSS removed
- [ ] Code splitting working

---

## 6️⃣ Accessibility Tests

### WCAG 2.1 Compliance (Level AA)

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Can submit forms with keyboard
- [ ] Modal closes with Escape key
- [ ] No keyboard traps

### Screen Readers
- [ ] Page title announced
- [ ] Navigation landmarks identified
- [ ] Form labels associated with inputs
- [ ] Buttons have accessible names
- [ ] Images have alt text

### Color Contrast
- [ ] Text contrast ≥ 4.5:1 (normal text)
- [ ] Text contrast ≥ 3:1 (large text)
- [ ] Use online tool: https://webaim.org/resources/contrastchecker/

### ARIA Labels
- [ ] Buttons have descriptive labels
- [ ] Images have alt text
- [ ] Form fields labeled
- [ ] Modal marked with role="dialog"
- [ ] Modals are focusable

---

## 7️⃣ Browser Compatibility

### Desktop Browsers
- [ ] **Chrome** (latest)
  - [ ] All features work
  - [ ] Performance good
  - [ ] No console errors

- [ ] **Firefox** (latest)
  - [ ] All features work
  - [ ] Styles render correctly
  - [ ] Forms work

- [ ] **Safari** (latest)
  - [ ] All features work
  - [ ] Smooth scrolling works
  - [ ] CSS grid works

- [ ] **Edge** (latest)
  - [ ] All features work
  - [ ] No compatibility issues

### Mobile Browsers
- [ ] **Chrome Mobile** (Android)
  - [ ] Responsive layout
  - [ ] Touch interactions work
  - [ ] Fast performance

- [ ] **Safari Mobile** (iOS)
  - [ ] Responsive layout
  - [ ] Safe area respected
  - [ ] Input focus works

---

## 8️⃣ Security Tests

### HTTPS & Headers
- [ ] All pages serve over HTTPS
- [ ] Security headers present in `vercel.json`:
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] X-XSS-Protection: 1; mode=block

### Authentication
- [ ] Tokens stored securely (httpOnly cookies preferred)
- [ ] NEXTAUTH_SECRET configured
- [ ] Password field masked
- [ ] No sensitive data in localStorage
- [ ] Logout clears session

### CORS
- [ ] API requests use correct origin
- [ ] No CORS errors in console
- [ ] Backend CORS configured

### Input Validation
- [ ] Email format validated
- [ ] OTP length checked (6 digits)
- [ ] Form fields sanitized
- [ ] No XSS vulnerabilities

---

## 9️⃣ SEO Tests

### Meta Tags
```html
<!-- Check page source (Ctrl+U) for: -->
<title>Page Title</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

- [ ] All pages have unique titles
- [ ] All pages have descriptions
- [ ] OG tags present (social sharing)
- [ ] Twitter Card tags present

### Structured Data
- [ ] Open Graph tags validated: https://ogp.me/
- [ ] Schema.org data present
- [ ] JSON-LD structured data valid

### Sitemap & robots.txt
- [ ] `/sitemap.xml` accessible and valid
- [ ] `/robots.txt` accessible
- [ ] Crawlers can index pages
- [ ] Admin routes blocked

### Search Console
- [ ] Submit sitemap to Google Search Console
- [ ] Check for indexing errors
- [ ] Mobile usability: "Passed"
- [ ] No coverage issues

---

## 🔟 API Tests

### Test with Postman or Curl

### Authentication Endpoints
```bash
# POST /api/auth/login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Expected: { token: "...", user: { email, name, isAdmin } }
```

- [ ] Returns token on success
- [ ] Returns error on invalid credentials
- [ ] Token can be used in Authorization header

```bash
# POST /api/auth/request-otp
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected: { success: true, message: "OTP sent" }
```

- [ ] Returns success message
- [ ] OTP would be sent to email (in production)

```bash
# POST /api/auth/verify-otp
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Expected: { token: "...", user: { ... } } or error
```

- [ ] Accepts 6-digit OTP
- [ ] Returns error for invalid OTP
- [ ] Returns token on success

### Contact Endpoint
```bash
# POST /api/contact
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "company": "Acme Corp",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "bulk-order",
    "message": "I want to order..."
  }'

# Expected: { success: true, message: "We'll respond within 24 hours" }
```

- [ ] Accepts form data
- [ ] Returns success message
- [ ] Would send email in production

### AI Help Endpoint
```bash
# POST /api/ai-help
curl -X POST http://localhost:3000/api/ai-help \
  -H "Content-Type: application/json" \
  -d '{"query":"What varieties do you offer?"}'

# Expected: { answer: "We offer..." }
```

- [ ] Returns relevant answer
- [ ] Handles multiple question types

---

## 1️⃣1️⃣ Error Handling

### Test Error Scenarios
- [ ] Invalid email format → error message
- [ ] Missing required fields → validation error
- [ ] Network failure → error toast (if implemented)
- [ ] 404 page → renders custom 404
- [ ] 500 page → renders error message

### Error Messages
- [ ] Clear and user-friendly
- [ ] Help users fix the issue
- [ ] Not too technical
- [ ] Dismissible

---

## 1️⃣2️⃣ Cross-Browser Testing Checklist

### Final Sign-Off
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Edge (Desktop)

### Issues Found & Fixed
| Issue | Browser | Fixed | Notes |
|-------|---------|-------|-------|
| ... | ... | ✅/❌ | ... |

---

## ✅ Launch Readiness Checklist

Before deploying to production:

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Lighthouse score ≥ 90 (all metrics)
- [ ] No console errors
- [ ] No console warnings (except known)
- [ ] Accessibility audit passed
- [ ] SEO audit passed
- [ ] Security audit passed
- [ ] Browser compatibility verified
- [ ] Mobile responsiveness verified
- [ ] Performance benchmarks met
- [ ] Environment variables configured
- [ ] Backend API connected
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] Error logging configured
- [ ] Analytics configured
- [ ] Documentation updated

---

## 📊 Test Results Summary

**Date**: _____________
**Tester**: _____________
**Build Version**: _____________

| Test Category | Status | Notes |
|---------------|--------|-------|
| Unit Tests | ✅/⚠️/❌ | ... |
| Integration Tests | ✅/⚠️/❌ | ... |
| E2E Tests | ✅/⚠️/❌ | ... |
| Mobile/Responsive | ✅/⚠️/❌ | ... |
| Performance | ✅/⚠️/❌ | ... |
| Accessibility | ✅/⚠️/❌ | ... |
| Browser Compat. | ✅/⚠️/❌ | ... |
| Security | ✅/⚠️/❌ | ... |
| SEO | ✅/⚠️/❌ | ... |
| API Tests | ✅/⚠️/❌ | ... |

**Overall Status**: ✅ READY / ⚠️ READY WITH NOTES / ❌ NOT READY

**Known Issues**:
1. ...
2. ...
3. ...

**Sign-Off**:
- QA Lead: _________________ Date: _______
- DevOps: _________________ Date: _______

---

**Last Updated**: January 2025
