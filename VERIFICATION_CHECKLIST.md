# RohanRice Marketplace - Deployment Verification Checklist

Use this checklist to verify your deployment is complete and working.

---

## ✅ Local Development Verification

- [ ] Node.js 18+ installed
  ```bash
  node --version  # Should be v18.0.0 or higher
  ```

- [ ] MongoDB running locally (or Atlas account created)
  ```bash
  mongosh
  ```

- [ ] Backend dependencies installed
  ```bash
  cd server && npm install
  ```

- [ ] `.env` file created with required variables
  ```bash
  ls server/.env  # Should exist
  ```

- [ ] Backend starts successfully
  ```bash
  cd server && npm run dev
  # Should see: ✓ Server running on http://localhost:5000
  ```

- [ ] Frontend starts successfully
  ```bash
  npm run dev
  # Should see: ✓ Local: http://localhost:3000
  ```

- [ ] Health check works
  ```bash
  curl http://localhost:5000/api/health
  # Should return { status: "ok", ... }
  ```

- [ ] Products endpoint works
  ```bash
  curl http://localhost:5000/api/products
  # Should return array of products (or empty if seed not run)
  ```

- [ ] Database seeding works
  ```bash
  cd server && npm run seed
  # Should show: ✓ 6 products inserted
  ```

- [ ] Frontend loads in browser
  ```
  Open http://localhost:3000
  Should see: RohanRice homepage with navigation
  ```

---

## ✅ Services Configuration Verification

- [ ] MongoDB Atlas account created
  - [ ] Cluster initialized
  - [ ] Connection string copied
  - [ ] Network access configured (IP whitelist)

- [ ] Algolia account created
  - [ ] Application created
  - [ ] Index created: `rohanrice_products`
  - [ ] API keys copied (App ID, API Key, Search Key)
  - [ ] Products indexed (verify in dashboard)

- [ ] Email service configured
  - [ ] Gmail account created (or SendGrid/Mailgun)
  - [ ] App password generated (or SendGrid key)
  - [ ] SMTP credentials in `.env`
  - [ ] Test email sent successfully

- [ ] SMS service configured (optional but recommended)
  - [ ] Twilio account created
  - [ ] Account SID & Auth Token copied
  - [ ] Phone number verified
  - [ ] Test SMS sent successfully

- [ ] reCAPTCHA configured (optional)
  - [ ] Google reCAPTCHA domain registered
  - [ ] Site key & secret keys copied
  - [ ] Keys added to `.env`

- [ ] Google OAuth configured (optional)
  - [ ] Google Cloud project created
  - [ ] OAuth credentials generated
  - [ ] Redirect URIs added
  - [ ] Client ID & secret copied

---

## ✅ Backend API Testing (38 Endpoints)

### Authentication (7 endpoints)
- [ ] `POST /api/auth/signup` - User registration works
  ```bash
  curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"SecurePass123!","firstName":"John","lastName":"Doe"}'
  ```
  Expected: 201 with user data and JWT token

- [ ] `POST /api/auth/login` - User login works
  Expected: 200 with JWT token

- [ ] `POST /api/auth/request-otp` - OTP sent successfully
  Expected: 200 with OTP (visible in dev mode)

- [ ] `POST /api/auth/verify-otp` - OTP verification works
  Expected: 200 with JWT token

- [ ] `GET /api/auth/me` - User profile retrieval works
  Expected: 200 with current user data (requires token)

- [ ] `PUT /api/auth/profile` - Profile update works
  Expected: 200 with updated user data (requires token)

- [ ] `POST /api/auth/logout` - Logout works
  Expected: 200 success message

### Products (4 endpoints)
- [ ] `GET /api/products` - Products list loads
  Expected: 200 with products array

- [ ] `GET /api/products/:id` - Single product loads
  Expected: 200 with product details

- [ ] `GET /api/products/search/ai?q=basmati` - Search works
  Expected: 200 with search results (if Algolia configured)

- [ ] `GET /api/products/featured` - Featured products load
  Expected: 200 with top 6 products

### Shopping Cart (5 endpoints)
- [ ] `GET /api/cart` - Cart retrieval works (requires token)
  Expected: 200 with cart data

- [ ] `POST /api/cart/add` - Add to cart works
  Expected: 201 with updated cart

- [ ] `PUT /api/cart/update/:productId` - Update quantity works
  Expected: 200 with updated cart

- [ ] `DELETE /api/cart/remove/:productId` - Remove item works
  Expected: 200 with updated cart

- [ ] `DELETE /api/cart/clear` - Clear cart works
  Expected: 200 with empty cart

### Orders (4 endpoints)
- [ ] `POST /api/orders/create` - Order creation works
  Expected: 201 with order details and order number

- [ ] `GET /api/orders` - List user orders works (requires token)
  Expected: 200 with orders array

- [ ] `GET /api/orders/:id` - Get order details works
  Expected: 200 with full order information

- [ ] `PUT /api/orders/:id/cancel` - Cancel order works
  Expected: 200 with cancelled status

### Admin (7 endpoints)
- [ ] `GET /api/admin/stats` - Dashboard stats load (admin only)
  Expected: 200 with metrics

- [ ] `POST /api/admin/products` - Create product works
  Expected: 201 with new product

- [ ] `PUT /api/admin/products/:id` - Update product works
  Expected: 200 with updated product

- [ ] `DELETE /api/admin/products/:id` - Delete product works
  Expected: 200 with success message

- [ ] `PATCH /api/admin/products/:id/stock` - Update stock works
  Expected: 200 with new stock (triggers real-time broadcast)

- [ ] `GET /api/admin/orders` - List all orders works
  Expected: 200 with all orders

- [ ] `PATCH /api/admin/orders/:id/status` - Update order status works
  Expected: 200 with updated status

### Messages (6 endpoints)
- [ ] `POST /api/messages/submit` - Submit inquiry works
  Expected: 201 with message ID

- [ ] `GET /api/messages` - Get messages works (admin only)
  Expected: 200 with messages

- [ ] `GET /api/messages/stats/overview` - Message stats work
  Expected: 200 with statistics

- [ ] `PUT /api/messages/:id/respond` - Respond to message works
  Expected: 200 with response

- [ ] `PUT /api/messages/:id/close` - Close message works
  Expected: 200 with closed status

- [ ] `PUT /api/messages/:id/read` - Mark as read works
  Expected: 200 with read status

### Health (1 endpoint)
- [ ] `GET /api/health` - Server health check works
  Expected: 200 with status, uptime, timestamp

---

## ✅ Real-time Features (Socket.io)

- [ ] Socket.io connection establishes
  ```javascript
  const socket = io('http://localhost:3000');
  ```

- [ ] Stock subscription works
  ```javascript
  socket.emit('subscribe-stock', { productId: 'prod_001' });
  socket.on('stock-updated', (data) => console.log(data));
  ```

- [ ] Admin stock update broadcasts to all clients
  - [ ] Admin updates stock via PATCH /api/admin/products/:id/stock
  - [ ] All connected clients receive `stock-updated` event
  - [ ] Stock value matches in real-time

- [ ] Order notifications broadcast to user
  - [ ] Admin updates order status
  - [ ] User receives `order-updated` event
  - [ ] Status matches new value

- [ ] Admin receives message notifications
  - [ ] Customer submits inquiry
  - [ ] Admin dashboard receives `new-message` event

---

## ✅ Frontend Integration

- [ ] Frontend loads at http://localhost:3000
  Expected: Homepage visible, navigation working

- [ ] Sign up page works
  - [ ] Form accepts input
  - [ ] Submits to `/api/auth/signup`
  - [ ] Shows success message or error

- [ ] Login page works
  - [ ] Form accepts email/password
  - [ ] Submits to `/api/auth/login`
  - [ ] Returns and stores JWT token

- [ ] Product listing works
  - [ ] Products display from `/api/products`
  - [ ] Pagination works
  - [ ] Filters work (variety, sort)

- [ ] Product details work
  - [ ] Single product fetches from `/api/products/:id`
  - [ ] Specifications display
  - [ ] Images show

- [ ] Shopping cart works
  - [ ] Add to cart → updates `/api/cart`
  - [ ] Cart persists (30-day TTL)
  - [ ] Remove/update items work
  - [ ] Totals calculate correctly

- [ ] Checkout works
  - [ ] Order form appears
  - [ ] Order submits to POST `/api/orders/create`
  - [ ] Confirmation email sends
  - [ ] Order appears in user history

- [ ] Admin dashboard works
  - [ ] Stats load from `/api/admin/stats`
  - [ ] Product CRUD operations work
  - [ ] Stock updates broadcast in real-time
  - [ ] Orders display and can be updated

- [ ] Search works
  - [ ] Algolia search endpoint returns results
  - [ ] AI answer appears (if configured)

---

## ✅ Email & SMS Verification

- [ ] OTP email sent and received
  - [ ] Request OTP via `POST /api/auth/request-otp`
  - [ ] Check inbox for email
  - [ ] Email contains 6-digit OTP
  - [ ] OTP is valid for 10 minutes

- [ ] Order confirmation email sent
  - [ ] Create order via `POST /api/orders/create`
  - [ ] Check inbox for confirmation
  - [ ] Email contains items, total, order number

- [ ] Admin contact form email sent
  - [ ] Submit inquiry via `POST /api/messages/submit`
  - [ ] Admin receives email notification
  - [ ] Customer receives confirmation email

- [ ] SMS OTP sent (if Twilio configured)
  - [ ] Request SMS OTP
  - [ ] Check text for 6-digit code
  - [ ] Code works to verify

- [ ] Order SMS notification sent (if Twilio configured)
  - [ ] Create order
  - [ ] User receives SMS with order number

---

## ✅ Security Verification

- [ ] CORS headers present
  ```bash
  curl -i http://localhost:5000/api/products | grep "Access-Control"
  ```

- [ ] Rate limiting works
  - [ ] Normal endpoints: ~100 requests per 15 minutes
  - [ ] Auth endpoints: ~5 requests per 15 minutes
  - [ ] 429 status when exceeded

- [ ] JWT authentication required
  - [ ] Accessing protected endpoint without token → 401
  - [ ] Invalid token → 401
  - [ ] Valid token → 200

- [ ] Admin authorization works
  - [ ] Non-admin accessing admin endpoint → 403
  - [ ] Admin accessing admin endpoint → 200

- [ ] Password hashing works
  - [ ] User created
  - [ ] Password not returned in API response
  - [ ] Login with wrong password fails

- [ ] OTP security works
  - [ ] Max 5 attempts enforced
  - [ ] OTP expires after 10 minutes
  - [ ] False OTP rejected

- [ ] Helmet security headers present
  ```bash
  curl -i http://localhost:5000/api/products | grep -i "X-"
  ```

---

## ✅ Production Deployment (Hostinger)

### Pre-deployment
- [ ] All 38 endpoints tested locally
- [ ] Environment variables documented
- [ ] `.env` file created (never commit this)
- [ ] `.gitignore` configured
- [ ] Code pushed to GitHub

### Infrastructure
- [ ] Hostinger Managed Node.js account created
- [ ] Domain name configured (rohanrice.com)
- [ ] Nameservers updated

### Environment Setup
- [ ] All variables added in Hostinger hPanel:
  - [ ] NODE_ENV=production
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] ALGOLIA_* keys
  - [ ] SMTP_* credentials
  - [ ] TWILIO_* credentials

### Deployment
- [ ] Code deployed (GitHub auto-deploy configured)
- [ ] PM2 ecosystem.config.js in place
- [ ] PM2 processes started: rohanrice-api, rohanrice-web
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate installed (Let's Encrypt)

### Post-deployment Testing
- [ ] Frontend loads: https://rohanrice.com
  Expected: 200, page visible

- [ ] API responds: https://api.rohanrice.com/api/health
  Expected: 200 with status

- [ ] Products fetch: https://api.rohanrice.com/api/products
  Expected: 200 with products

- [ ] Auth works: Sign up → Login → OTP
  Expected: JWT tokens returned

- [ ] Cart works end-to-end
  Expected: Can add, update, remove items

- [ ] Orders work end-to-end
  Expected: Can create, track, cancel orders

- [ ] Admin dashboard works
  Expected: Stats load, product CRUD works, stock updates broadcast

- [ ] Email notifications work
  Expected: OTP + order confirmation emails sent

- [ ] Real-time updates work
  Expected: Stock updates broadcast via Socket.io

- [ ] Algolia search works
  Expected: Query returns rice product results

---

## ✅ Performance & Monitoring

- [ ] Lighthouse score: 80+
  ```bash
  Open https://rohanrice.com in Chrome
  Run Lighthouse audit
  ```

- [ ] API response time: < 500ms
  ```bash
  curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/products
  ```

- [ ] Database response time: < 200ms
  Check MongoDB Atlas performance metrics

- [ ] Real-time latency: < 1s
  Test stock update broadcast

- [ ] Uptime: Monitor via PM2
  ```bash
  pm2 status
  pm2 monit
  ```

- [ ] Error logs: Check PM2 logs
  ```bash
  pm2 logs rohanrice-api
  ```

- [ ] Disk space: Sufficient for logs
  ```bash
  df -h
  ```

---

## ✅ Final Verification Checklist

**Before marking as complete:**

- [ ] All 38 endpoints tested and working
- [ ] All 6 database models in use
- [ ] All 3 authentication methods implemented
- [ ] Real-time Socket.io events working
- [ ] Email service sending (OTP, orders, contact)
- [ ] SMS service sending (OTP, optional)
- [ ] Algolia search returning results
- [ ] Admin dashboard fully functional
- [ ] Security headers present
- [ ] Rate limiting enforced
- [ ] JWT authentication required where needed
- [ ] Admin authorization working
- [ ] Frontend integrated with backend
- [ ] Production environment variables configured
- [ ] Hostinger deployment complete
- [ ] SSL certificates installed
- [ ] PM2 processes running
- [ ] Nginx reverse proxy working
- [ ] GitHub auto-deployment configured
- [ ] Database backups configured
- [ ] Monitoring in place
- [ ] Error handling working
- [ ] Logging functional

---

## Sign-Off

**Demo Completed**: ___________________  
**Tested By**: ___________________  
**Date**: ___________________  

**Notes/Issues**:
```
_________________________________________________________
_________________________________________________________
_________________________________________________________
```

---

**Status: Ready for Production** ✅

Once all items above are checked, your RohanRice Marketplace is:
- ✅ Fully functional
- ✅ Tested end-to-end
- ✅ Deployed to production
- ✅ Ready for customers

**Next Steps**:
1. Monitor logs for first week
2. Address any user feedback
3. Set up analytics
4. Plan feature additions

---

