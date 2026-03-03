# 🚀 RohanRice Backend - Command Reference

Quick reference for common development tasks.

---

## Backend Server Commands

```bash
# Start development server (with auto-reload)
cd server
npm run dev

# Start production server
npm run start

# Seed database with 6 rice products
npm run seed

# Run tests (when added)
npm run test
```

---

## Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production build
npm run start

# Run linter
npm run lint
```

---

## Database Commands

```bash
# Connect to MongoDB locally
mongosh

# Connect to MongoDB Atlas
mongosh "$MONGODB_URI"

# Switch to rohanrice database
use rohanrice

# View all collections
show collections

# Query products
db.products.find().pretty()

# Query users
db.users.find().pretty()

# Count records
db.products.countDocuments()
db.users.countDocuments()
db.orders.countDocuments()

# Clear collection (WARNING: deletes all data)
db.products.deleteMany({})
db.users.deleteMany({})
```

---

## Useful cURL Commands

### Authentication

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Request OTP
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otpType": "email",
    "purpose": "signup"
  }'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "purpose": "signup",
    "userData": {
      "firstName": "John",
      "lastName": "Doe",
      "password": "SecurePass123!"
    }
  }'

# Get user profile (requires token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Products

```bash
# List all products
curl http://localhost:5000/api/products

# List with pagination
curl "http://localhost:5000/api/products?page=1&limit=10"

# Filter by variety
curl "http://localhost:5000/api/products?variety=Basmati"

# Sort by price
curl "http://localhost:5000/api/products?sort=price&order=asc"

# Get single product
curl http://localhost:5000/api/products/prod_001

# Search with Algolia
curl "http://localhost:5000/api/products/search/ai?q=basmati"

# Get featured products
curl http://localhost:5000/api/products/featured

# Get variety statistics
curl http://localhost:5000/api/products/varieties/list
```

### Shopping Cart (requires token)

```bash
# Get cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "quantity": 5
  }'

# Update quantity
curl -X PUT http://localhost:5000/api/cart/update/prod_001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}'

# Remove item
curl -X DELETE http://localhost:5000/api/cart/remove/prod_001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Clear cart
curl -X DELETE http://localhost:5000/api/cart/clear \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Orders (requires token)

```bash
# Create order
curl -X POST http://localhost:5000/api/orders/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94105",
      "country": "United States"
    },
    "billingAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94105",
      "country": "United States"
    },
    "paymentMethod": "credit_card"
  }'

# List user orders
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get order details
curl -X GET http://localhost:5000/api/orders/order_999 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Cancel order
curl -X PUT http://localhost:5000/api/orders/order_999/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin (requires admin token)

```bash
# Get dashboard stats
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Create product
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Basmati Rice",
    "variety": "Basmati",
    "price": 1.20,
    "stock": 500,
    "description": "High-quality basmati rice..."
  }'

# Update stock (triggers real-time broadcast)
curl -X PATCH http://localhost:5000/api/admin/products/prod_001/stock \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stock": 250}'

# List all orders
curl -X GET http://localhost:5000/api/admin/orders \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Update order status
curl -X PATCH http://localhost:5000/api/admin/orders/order_999/status \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderStatus": "shipped",
    "trackingNumber": "TRACK123456789"
  }'
```

### Messages

```bash
# Submit inquiry
curl -X POST http://localhost:5000/api/messages/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+14155552677",
    "type": "inquiry",
    "subject": "Bulk order question",
    "message": "I need 100 tons of basmati rice..."
  }'

# Get messages (admin only)
curl -X GET http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Respond to message (admin only)
curl -X PUT http://localhost:5000/api/messages/msg_001/respond \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "response": "Thank you for your inquiry. We can provide..."
  }'

# Get message stats (admin only)
curl -X GET http://localhost:5000/api/messages/stats/overview \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Health Check

```bash
# Server health
curl http://localhost:5000/api/health
```

---

## Environment Setup

### Copy Template
```bash
cd server
cp .env.example .env
```

### Edit .env (Minimum for Local Development)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rohanrice
JWT_SECRET=development-secret-key-here
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh-secret-key-here
REFRESH_TOKEN_EXPIRE=30d
```

### Edit .env (Full Setup for Production)
```
NODE_ENV=production
PORT=5000
API_URL=https://api.rohanrice.com
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rohanrice
JWT_SECRET=$(openssl rand -base64 32)
ALGOLIA_APP_ID=...
ALGOLIA_API_KEY=...
ALGOLIA_SEARCH_API_KEY=...
ALGOLIA_INDEX_NAME=rohanrice_products
SMTP_HOST=smtp.gmail.com
SMTP_USER=rohanrice.notifications@gmail.com
SMTP_PASS=your-app-password
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

---

## PM2 Process Management (Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd server
pm2 start server.js --name "rohanrice-api"

# Start frontend with PM2
cd ..
pm2 start "npm run start" --name "rohanrice-web"

# View all processes
pm2 status

# Monitor processes
pm2 monit

# View logs
pm2 logs rohanrice-api
pm2 logs rohanrice-web

# Save PM2 config
pm2 save

# Setup auto-restart on server reboot
pm2 startup

# Reload all processes
pm2 reload all

# Restart specific process
pm2 restart rohanrice-api

# Stop all processes
pm2 stop all

# Delete all processes
pm2 delete all
```

---

## Git Commands

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Express.js backend with 38 endpoints"

# Rename branch
git branch -M main

# Add remote
git remote add origin https://github.com/your-username/rohanrice-marketplace.git

# Push to GitHub
git push -u origin main

# View status
git status

# View logs
git log --oneline

# Make changes and push
git add .
git commit -m "Your message"
git push origin main
```

---

## Troubleshooting Commands

```bash
# Check if Node.js installed
node --version

# Check if npm installed
npm --version

# List processes on port 5000
lsof -i :5000

# Kill process on port 5000
kill -9 <PID>

# Check MongoDB connection
mongosh "$MONGODB_URI"

# Restart MongoDB
sudo systemctl restart mongodb

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check current directory
pwd

# List files
ls -la

# View file content
cat filename

# Edit file
nano filename
# (Press Ctrl+X to exit nano)
```

---

## IDE/Editor Tips

### VS Code Extensions (Recommended)
- REST Client (Send HTTP requests from editor)
- MongoDB for VS Code
- Postman (or use in browser)
- ESLint
- Prettier (formatting)

### REST Client Extension Example
Create file `requests.http`:
```
### Get products
GET http://localhost:5000/api/products

### Sign up
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

### (Right-click and "Send Request")
```

---

## Performance Monitoring

```bash
# Monitor CPU/Memory
top
# or
htop

# Check disk space
df -h

# Monitor network connections
netstat -an | grep ESTABLISHED

# View system info
uname -a

# Check running processes
ps aux | grep node
ps aux | grep npm
```

---

## Socket.io Real-time Testing (JavaScript)

```javascript
// In browser console at http://localhost:3000
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Subscribe to stock updates
socket.emit('subscribe-stock', { productId: 'prod_001' });

// Listen for updates
socket.on('stock-updated', (data) => {
  console.log('Stock updated:', data);
  // { productId: 'prod_001', stock: 250, status: 'in_stock' }
});

// Disconnect
socket.disconnect();
```

---

## API Testing Tools

### Option 1: Postman (GUI)
- Download: https://www.postman.com/downloads/
- Import: POSTMAN_COLLECTION.json
- Configure environment variables
- Test each endpoint

### Option 2: curl (Command Line)
- Pre-made commands above
- No installation needed
- Good for scripting

### Option 3: REST Client (VS Code)
- Install extension: REST Client
- Create `requests.http` file
- Click "Send Request" above each request

### Option 4: Insomnia (Alternative)
- Download: https://insomnia.rest/
- Similar to Postman
- Lightweight alternative

---

## Deployment Commands (Hostinger)

```bash
# SSH into server
ssh user@your-ip-address

# Navigate to project
cd ~/rohanrice-marketplace

# Update code from GitHub
git pull origin main

# Install dependencies
npm install

# Setup PM2
pm2 restart all
# or
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Restart Nginx
sudo systemctl restart nginx

# Check SSL certificate
sudo certbot certificates

# Renew SSL certificate
sudo certbot renew

# View system logs
tail -f /var/log/nginx/error.log
```

---

## Quick Debugging Tips

```bash
# Enable detailed logging
DEBUG=* npm run dev

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI
echo $JWT_SECRET

# Test database connection
mongosh "$MONGODB_URI"

# Check if API is running
curl http://localhost:5000/api/health

# Monitor real-time requests
npm run dev 2>&1 | grep -i "POST\|GET\|PUT\|DELETE"

# Save logs to file
npm run dev > server.log 2>&1 &
tail -f server.log
```

---

## Summary

**Local Development**:
```bash
cd server && npm install && npm run dev
```

**Seed Database**:
```bash
cd server && npm run seed
```

**Test API**:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/products
```

**Deploy**:
Follow [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)

---

**Need more help?**
- API Reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Setup Guide: [QUICK_START.md](./QUICK_START.md)
- Deployment: [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)
- Services: [SERVICES_SETUP.md](./SERVICES_SETUP.md)
