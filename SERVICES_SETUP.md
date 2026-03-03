# RohanRice Marketplace - Services Configuration Guide

Complete setup for Algolia, Email (SMTP), SMS (Twilio), and MongoDB.

---

## 1. MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

**Step 1: Create Account**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with email/GitHub
3. Verify email

**Step 2: Create Project**

1. Click **Create Project**
2. Name: `RohanRice`
3. Click **Next**
4. Click **Create Project**

**Step 3: Create Cluster**

1. Click **Create Deployment**
2. Select **Free** tier (M0)
3. Cloud Provider: AWS (or preferred)
4. Region: Choose closest to your market (e.g., us-east-1 for USA)
5. Cluster Name: `rohanrice-cluster`
6. Click **Create**

Wait 2-3 minutes for cluster to initialize.

**Step 4: Get Connection String**

1. Click **Connect**
2. Select **Drivers** tab
3. Copy connection string: `mongodb+srv://user:password@cluster.mongodb.net/rohanrice`

**Step 5: Add to Environment**

```bash
# In server/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rohanrice
```

**Step 6: Test Connection**

```bash
mongosh "mongodb+srv://user:password@cluster.mongodb.net/rohanrice"

# Should connect successfully
```

### Option B: MongoDB Community (Local)

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community

# Connection string
MONGODB_URI=mongodb://localhost:27017/rohanrice
```

**Create Database & Seed**

```bash
cd server
npm run seed
```

---

## 2. Algolia Setup (AI-Powered Search)

### Step 1: Create Account

1. Go to https://www.algolia.com/
2. Click **Sign Up** → Free tier (up to 10k records)
3. Sign up with email or GitHub
4. Verify email

### Step 2: Create Application

1. In dashboard, click **Create Application**
2. Name: `RohanRice Marketplace`
3. Region: Choose closest (e.g., us-east-1)
4. Click **Create**

### Step 3: Get Credentials

1. Left sidebar → **Settings** → **API Keys**
2. Copy these values to your `.env`:

```bash
# server/.env (COPY FROM ALGOLIA DASHBOARD)

# Application ID
ALGOLIA_APP_ID=NJDXOUYYQZ  # Your app ID

# Keys
ALGOLIA_API_KEY=abc123def...  # Full API key (for indexing)
ALGOLIA_SEARCH_API_KEY=xyz789...  # Search-only key (frontend)
ALGOLIA_INDEX_NAME=rohanrice_products

# Assistant ID (optional, for AI)
ALGOLIA_ASSISTANT_ID=your-assistant-id
```

### Step 4: Create Index

1. Left sidebar → **Search**
2. Click **Create Index**
3. Name: `rohanrice_products`
4. Click **Create**

### Step 5: Configure Searchable Attributes

1. Go to **Index** → `rohanrice_products`
2. Configuration → **Searchable attributes**
3. Add these attributes (in order):
   - `name` (priority: high)
   - `variety`
   - `description`
   - `certifications`
   - `origin.country`

4. Click **Save**

### Step 6: Configure Facets

1. Configuration → **Facets**
2. Facet type: **Facet** → Add these:
   - `variety`
   - `certifications`
   - `origin.country`

3. Click **Save**

### Step 7: Configure Display Attributes

1. Configuration → **Display**
2. Add these attributes:
   - `name`
   - `variety`
   - `price`
   - `rating`
   - `images`
   - `specification`

3. Click **Save**

### Step 8: Seed Products to Algolia

```bash
cd server

# Verify ALGOLIA_* env vars are set
echo $ALGOLIA_APP_ID

# Run seed (this will index products)
npm run seed

# Result: 6 products indexed in Algolia
```

### Step 9: Test Search

```javascript
// In browser console
curl "http://localhost:5000/api/products/search/ai?q=basmati"

// Expected response (UI shows Algolia results)
{
  "results": {
    "hits": [
      {
        "id": "prod_001",
        "name": "Premium Basmati Rice",
        "variety": "Basmati",
        "price": 1.20,
        "rating": 4.9
      }
    ]
  }
}
```

### Step 10: Setup AI Assistant (Optional)

For AI-powered answers (Ask AI feature):

1. **Algolia Dashboard** → Settings → **AI**
2. Enable **Algolia AI**
3. Configure model (default: GPT-4)
4. Copy **Assistant ID** to `.env`:

```bash
ALGOLIA_ASSISTANT_ID=abc123xyz...
```

When user searches "What rice is best for biryani?", Algolia AI returns:
```
"Basmati rice is the best choice for biryani due to its long grains 
and aromatic properties. We recommend our Premium Basmati Rice."
```

**Verify in Dashboard**:
1. Dashboard → **Search** tab
2. Type search query
3. See both hits and AI answer

---

## 3. Email Setup (Nodemailer + Gmail)

### Option A: Gmail (Free, Easy)

**Step 1: Create Gmail Account**

1. Go to https://accounts.google.com/signup
2. Create new Gmail address (e.g., `rohanrice.notifications@gmail.com`)

**Step 2: Enable 2-Factor Authentication**

1. Go to https://myaccount.google.com
2. Left sidebar → **Security**
3. 2-Step Verification → Follow prompts
4. Enter phone number → Verify

**Step 3: Generate App Password**

1. Go to https://myaccount.google.com/apppasswords
2. Select: App = **Mail**, Device = **Windows/Mac/Linux**
3. Google generates 16-character password
4. Copy to `.env`:

```bash
# server/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rohanrice.notifications@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-character app password (no spaces in code)
SMTP_FROM=RohanRice <rohanrice.notifications@gmail.com>
ADMIN_EMAIL=admin@rohanrice.com
```

**Step 4: Test Email**

```javascript
// In Node.js REPL
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rohanrice.notifications@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.sendMail({
  from: 'rohanrice.notifications@gmail.com',
  to: 'your-email@gmail.com',
  subject: 'RohanRice Test Email',
  text: 'If you see this, Gmail SMTP is working!'
}, (err, info) => {
  if (err) console.error(err);
  else console.log('Email sent:', info.response);
});
```

### Option B: SendGrid (Professional)

**Step 1: Create SendGrid Account**

1. Go to https://sendgrid.com/
2. Sign up (free tier: 100 emails/day)
3. Verify email

**Step 2: Get API Key**

1. Dashboard → **Email API** → **Integration Guide**
2. Choose **Nodemailer**
3. Copy API key
4. Add to `.env`:

```bash
# server/.env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx...  # SendGrid API key
SMTP_FROM=RohanRice Notifications <noreply@rohanrice.com>
```

### Option C: Mailgun

```bash
# server/.env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@sandbox.mailgun.org
SMTP_PASS=your-mailgun-password
```

**Step 3: Test OTP Email Flow**

1. Start backend: `npm run dev`
2. Request OTP:
   ```bash
   curl -X POST http://localhost:5000/api/auth/request-otp \
     -H "Content-Type: application/json" \
     -d '{
       "email": "your-email@gmail.com",
       "otpType": "email",
       "purpose": "signup"
     }'
   ```
3. Check your email inbox
4. Should receive OTP email within 1-2 seconds

---

## 4. SMS Setup (Twilio)

### Step 1: Create Twilio Account

1. Go to https://www.twilio.com/
2. Click **Sign Up** → Free account ($15 trial credit)
3. Verify phone number (you'll get text)
4. Create password

### Step 2: Get Credentials

1. Dashboard → Copy **Account SID**
2. Click **Auth Token** to reveal
3. Copy **Auth Token**
4. Add to `.env`:

```bash
# server/.env
TWILIO_ACCOUNT_SID=AC123456789abc...
TWILIO_AUTH_TOKEN=xyz789abc...
```

### Step 3: Get Phone Number

1. Left sidebar → **Phone Numbers**
2. Click **Get a Trial Number**
3. Select country (US for trial)
4. Accept number (e.g., +1234567890)
5. Add to `.env`:

```bash
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Test SMS

```javascript
// In Node.js
const twilio = require('twilio');

const client = twilio('ACCOUNT_SID', 'AUTH_TOKEN');

client.messages.create({
  body: 'Your OTP is: 123456. Valid for 10 minutes.',
  from: '+1234567890',  // Your Twilio number
  to: '+1234567890'     // User phone
}).then(message => console.log('SMS sent:', message.sid));
```

### Step 5: Test OTP SMS Flow

```bash
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "otpType": "sms",
    "purpose": "signup"
  }'
```

Check SMS on your phone within 1-2 seconds.

---

## 5. reCAPTCHA Setup (Optional - For Security)

### Step 1: Register Site

1. Go to https://www.google.com/recaptcha/admin
2. Click **+ Create** (top left)
3. Label: `RohanRice Marketplace`
4. reCAPTCHA type: **reCAPTCHA v3**
5. Domains: `rohanrice.com`, `www.rohanrice.com`, `api.rohanrice.com`
6. Accept terms → **Create**

### Step 2: Get Keys

1. Copy **Site Key** (public key)
2. Copy **Secret Key** (private key)
3. Add to `.env`:

```bash
# server/.env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...
```

### Step 3: Add to Frontend

```javascript
// In frontend contact form
import ReCAPTCHA from "react-google-recaptcha";

<ReCAPTCHA
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
  onChange={(token) => setRecaptchaToken(token)}
/>
```

---

## 6. Stripe Setup (Optional - Payments)

### Step 1: Create Account

1. Go to https://www.stripe.com
2. Sign up (free, no fees for testing)
3. Verify email

### Step 2: Get API Keys

1. Dashboard → **Developers** → **API Keys**
2. Copy **Publishable Key**
3. Copy **Secret Key**
4. Add to `.env`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Step 3: Test Payment

Use Stripe test card: `4242 4242 4242 4242`

---

## 7. Google OAuth Setup (Optional)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project → Name: `RohanRice`
3. Wait for project to initialize

### Step 2: Create OAuth Credentials

1. Left sidebar → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Application type: **Web application**
4. Name: `RohanRice Frontend`
5. Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://rohanrice.com/api/auth/callback/google

6. Click **Create**
7. Copy **Client ID** and **Client Secret**

### Step 3: Add to Environment

```bash
# server/.env
GOOGLE_CLIENT_ID=abc123...
GOOGLE_CLIENT_SECRET=xyz789...

# frontend/.env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=abc123...
```

---

## Environment Variables Checklist

```bash
# Copy this to server/.env

# === SERVER ===
NODE_ENV=development
PORT=5000

# === DATABASE ===
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rohanrice
# OR local:
# MONGODB_URI=mongodb://localhost:27017/rohanrice

# === JWT ===
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_EXPIRE=30d

# === ALGOLIA ===
ALGOLIA_APP_ID=NJDXOUYYQZ
ALGOLIA_API_KEY=your-full-api-key
ALGOLIA_SEARCH_API_KEY=your-search-key
ALGOLIA_INDEX_NAME=rohanrice_products
ALGOLIA_ASSISTANT_ID=your-assistant-id  # optional

# === EMAIL (SMTP) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rohanrice.notifications@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=RohanRice <rohanrice.notifications@gmail.com>
ADMIN_EMAIL=admin@rohanrice.com

# === SMS (TWILIO) ===
TWILIO_ACCOUNT_SID=AC123456789abc...
TWILIO_AUTH_TOKEN=xyz789abc...
TWILIO_PHONE_NUMBER=+1234567890

# === SECURITY ===
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...

# === PAYMENT (STRIPE) ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# === OAUTH (GOOGLE) ===
GOOGLE_CLIENT_ID=abc123...
GOOGLE_CLIENT_SECRET=xyz789...

# === FRONTEND ===
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

---

## Service Status Check

```bash
# After setting all variables, run:
cd server
npm run dev

# Should see:
# ✓ Server running on http://localhost:5000
# ✓ Database connected
# ✓ Algolia initialized
# ✓ Email service ready
# ✓ SMS service ready
```

---

## Troubleshooting

### MongoDB Connection Fails
```bash
# Test connection
mongosh "$MONGODB_URI"

# If Atlas: Check IP whitelist
# Go to Network Access → Allow current IP
```

### Email Not Sending
```bash
# Check Gmail settings
# 1. Enable 2FA: https://myaccount.google.com/security
# 2. Generate app password: https://myaccount.google.com/apppasswords
# 3. Use 16-character password (no spaces)

# Test manually
npm run test:email
```

### Twilio SMS Fails
```bash
# Check phone number format
# Must be: +1234567890 (with + and country code)

# Verify trial accounts can SMS
# Twilio trials can only send to verified numbers
# Add your number: https://console.twilio.com/phone-numbers/verified
```

### Algolia Index Empty
```bash
# Re-seed products
cd server
npm run seed

# Check in Algolia dashboard
# Dashboard → Search → rohanrice_products
# Should show 6 records
```

---

## Cost Estimates (Monthly)

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| MongoDB Atlas | $0 (shared) | $57+ | Free tier: 1GB storage |
| Algolia | $0 (10k records) | $99+ | Free: sufficient for 6 products |
| Gmail SMTP | $0 | $0 | Free forever if under 100 emails/day |
| Twilio SMS | $0 (trial) | $0.0075/SMS | Trial: $15 credit lasts ~2000 SMS |
| Google Cloud | $0 (free tier) | Variable | OAuth: free, free tier covers quota |
| Stripe | $0 (testing) | 2.9% + $0.30/transaction | Fee only on successful charges |

**Total for startup**: ~$0-20/month before significant traffic

---

**Next Steps:**
1. [x] Setup all services above
2. [ ] Test each service with provided curl commands
3. [ ] Run `npm run seed` to populate data
4. [ ] Review logs: `npm run dev`
5. [ ] Deploy to Hostinger → [See HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)

