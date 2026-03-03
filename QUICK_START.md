# RohanRice Marketplace - Quick Start Guide

## Local Development Setup (5 minutes)

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Free tier](https://www.mongodb.com/cloud/atlas))
- npm or pnpm installed

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/rohanrice-marketplace.git
cd rohanrice-marketplace
```

### Step 2: Setup Backend

```bash
# Enter server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your local settings
# Minimum required for local dev:
# NODE_ENV=development
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/rohanrice
# JWT_SECRET=your-local-secret-key
```

### Step 3: Setup Database

**Option A: MongoDB Local (Easiest)**

```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod

# Seed initial data
cd server
npm run seed
```

**Option B: MongoDB Atlas (Cloud)**

```bash
# 1. Create account: https://www.mongodb.com/cloud/atlas
# 2. Create cluster (free tier)
# 3. Get connection string
# 4. Add to .env:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rohanrice
```

### Step 4: Start Backend Server

```bash
cd server
npm run dev

# Output:
# ✓ Server running on http://localhost:5000
# ✓ Socket.io listening on http://localhost:5000/socket.io
# ✓ Database connected
```

### Step 5: Setup Frontend

In a **new terminal**:

```bash
# Back to project root
cd ..

# Install dependencies
npm install
# or
pnpm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF

# Start frontend development server
npm run dev

# Output:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
```

### Step 6: Open in Browser

1. **Frontend**: http://localhost:3000
2. **API**: http://localhost:5000/api/health
3. **Health Check**: Should see:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "uptime": 123
   }
   ```

---

## Testing Endpoints (Postman)

### 1. Import Collection

1. Open [Postman](https://www.postman.com/downloads/)
2. Click **Import**
3. Select `POSTMAN_COLLECTION.json` from project root
4. All 38 endpoints are pre-configured

### 2. Test Sign Up

```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+14155552677",
  "country": "United States"
}
```

**Response (201)**:
```json
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 3. Test Products

```
GET http://localhost:5000/api/products
```

**Expected**: 6 seeded rice varieties returned

### 4. Test Search (Algolia)

```
GET http://localhost:5000/api/products/search/ai?q=basmati
```

**Note**: Requires `ALGOLIA_*` credentials set in .env

---

## Common Development Commands

```bash
# Backend
cd server
npm run dev          # Start with auto-reload
npm run seed         # Seed database with 6 products
npm test             # Run tests (coming soon)

# Frontend
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run ESLint
```

---

## Debugging

### Backend Logs

```bash
# View real-time logs
pm2 logs rohanrice-api

# View error log
tail -f /log/rohanrice-api.err.log
```

### Database

```bash
# MongoDB Shell
mongosh

# List databases
show dbs

# Switch to rohanrice database
use rohanrice

# View collections
show collections

# Query products
db.products.find().pretty()

# Check user count
db.users.countDocuments()
```

### Socket.io Debug

```javascript
// Add to frontend (in browser console)
localStorage.debug = 'socket.io*';
location.reload();

// Now Socket.io events will be logged
```

---

## Environment Variables Checklist

### Minimal Setup (Development)

- [x] `NODE_ENV=development`
- [x] `PORT=5000`
- [x] `MONGODB_URI=mongodb://localhost:27017/rohanrice` (or Atlas)
- [x] `JWT_SECRET=development-secret-key`

### Full Setup (Before Deployment)

```
[ ] NODE_ENV=production
[ ] PORT=5000
[ ] MONGODB_URI=mongodb+srv://...
[ ] JWT_SECRET=(openssl rand -base64 32)
[ ] REFRESH_TOKEN_SECRET=(openssl rand -base64 32)

[ ] ALGOLIA_APP_ID=...
[ ] ALGOLIA_API_KEY=...
[ ] ALGOLIA_SEARCH_API_KEY=...
[ ] ALGOLIA_INDEX_NAME=rohanrice_products
[ ] ALGOLIA_ASSISTANT_ID=...

[ ] SMTP_HOST=smtp.gmail.com
[ ] SMTP_USER=your-email@gmail.com
[ ] SMTP_PASS=(app-specific-password)
[ ] SMTP_FROM=noreply@rohanrice.com

[ ] TWILIO_ACCOUNT_SID=...
[ ] TWILIO_AUTH_TOKEN=...
[ ] TWILIO_PHONE_NUMBER=...

[ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
[ ] GOOGLE_CLIENT_SECRET=...
```

---

## Project Structure

```
rohanrice-marketplace/
├── server/                      # Node.js/Express backend
│   ├── models/                  # Database schemas (6 models)
│   ├── routes/                  # API endpoints (7 files, 38 endpoints)
│   ├── middleware/              # Auth, error handling, logging
│   ├── services/                # Email, SMS, external APIs
│   ├── config/                  # Database, Algolia setup
│   ├── utils/                   # Token generation, helpers
│   ├── scripts/                 # Database seeding
│   ├── server.js                # Main server file
│   ├── .env.example             # Environment template
│   └── package.json             # Dependencies
│
├── src/                         # Next.js frontend
│   ├── pages/                   # Routes (7 pages)
│   ├── components/              # Reusable components
│   ├── context/                 # State management (Auth, Cart)
│   └── styles/                  # CSS & Tailwind
│
├── public/                      # Static assets
├── API_DOCUMENTATION.md         # Complete API reference
├── HOSTINGER_DEPLOYMENT.md      # Production deployment guide
├── POSTMAN_COLLECTION.json      # Import into Postman
├── ecosystem.config.js          # PM2 configuration
└── README.md                    # Project overview
```

---

## Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill process if needed
kill -9 <PID>

# Check MongoDB connection
mongosh "$MONGODB_URI"

# Check Node version
node --version  # Should be 18+
```

### Frontend won't start

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Check port 3000
lsof -i :3000
```

### Cannot connect to API from frontend

```bash
# 1. Check CORS settings in server/server.js
# 2. Verify NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
# 3. Check if backend is running: curl http://localhost:5000/api/health
```

### Database seeding fails

```bash
# Check MongoDB is running
ps aux | grep mongod

# Check connection
mongosh

# Re-run seed
cd server
npm run seed

# View errors
npm run seed 2>&1 | head -50
```

### Algolia search not working

```bash
# Check credentials in .env
echo $ALGOLIA_APP_ID
echo $ALGOLIA_API_KEY

# Test endpoint
curl "http://localhost:5000/api/products/search/ai?q=basmati"

# Should see products returned (no AI response until live keys added)
```

---

## Next Steps

1. **[x]** Local development setup complete
2. **[ ]** Configure Algolia account → [Azure AI Search Setup](./ALGOLIA_SETUP.md)
3. **[ ]** Setup email/SMS → [Email & SMS Configuration](./EMAIL_SMS_SETUP.md)
4. **[ ]** Deploy to Hostinger → [Hostinger Deployment Guide](./HOSTINGER_DEPLOYMENT.md)
5. **[ ]** Setup monitoring → [Monitoring & Analytics](./MONITORING_SETUP.md)

---

## Support

- **Backend Issues**: Check [server logs](./server)
- **Frontend Issues**: Check [browser console](http://localhost:3000)
- **API Reference**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Deployment Help**: See [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)

---

**Total Setup Time**: ~5 minutes for local development
**Time to First API Call**: ~2 minutes

