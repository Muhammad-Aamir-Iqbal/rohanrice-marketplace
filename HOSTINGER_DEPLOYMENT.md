# RohanRice Marketplace - Full Stack Deployment Guide

## Complete Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HOSTINGER ACCOUNT                         │
├──────────────────┬──────────────────┬───────────────────────┤
│  Frontend        │  Backend         │  Database             │
│  (Next.js)       │  (Node.js/       │  (MongoDB or          │
│  ✓ SSR           │  Express)        │  PostgreSQL)          │
│  ✓ SEO Ready     │  ✓ Stock Mgmt    │  ✓ Auto-scaling       │
│  ✓ Real-time     │  ✓ Auth/JWT      │  ✓ Backups            │
│  ✓ AI Search     │  ✓ Orders        │                       │
│  Runs on: Nginx  │  Runs on: PM2    │  Runs on: Managed DB  │
└──────────────────┴──────────────────┴───────────────────────┘
```

## Step 1: Hostinger Setup

### 1.1 Create Hostinger Account
- Go to https://www.hostinger.com/
- Plans: "Managed Node.js" (recommended for this project)
- Domain: rohanrice.com (or your domain)

### 1.2 Access hPanel

```
1. Log in to Hostinger hPanel
2. Go to Hosting → Manage
3. Terminal / SSH available in your control panel
```

### 1.3 Environment Variables in hPanel

Add all these in `Hosting → Environment Variables`:

```
# Backend Server
NODE_ENV=production
PORT=5000
API_URL=https://api.rohanrice.com

# Frontend
NEXT_PUBLIC_API_BASE_URL=https://api.rohanrice.com
NEXT_PUBLIC_SOCKET_URL=https://rohanrice.com

# JWT
JWT_SECRET=(generate: openssl rand -base64 32)
REFRESH_TOKEN_SECRET=(generate another random 32-byte string)

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rohanrice
# OR for PostgreSQL (Supabase): DATABASE_URL=postgres://...

# Algolia
ALGOLIA_APP_ID=NJDXOUYYQZ
ALGOLIA_API_KEY=your-write-key
ALGOLIA_SEARCH_API_KEY=your-search-key
ALGOLIA_INDEX_NAME=rohanrice_products
ALGOLIA_ASSISTANT_ID=your-assistant-id

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@rohanrice.com
ADMIN_EMAIL=admin@rohanrice.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# reCAPTCHA (Optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# Frontend
NEXTAUTH_URL=https://rohanrice.com
NEXTAUTH_SECRET=(generate another random string)
```

## Step 2: Database Setup

### 2.1 MongoDB Atlas (Recommended for simplicity)

```bash
# 1. Create account: https://www.mongodb.com/cloud/atlas
# 2. Create cluster (free tier available)
# 3. Get connection string: mongodb+srv://user:password@cluster.mongodb.net/rohanrice
# 4. Add this as MONGODB_URI in environment variables
# 5. Test connection
```

### 2.2 Alternative: PostgreSQL (Supabase)

```bash
# 1. Create account: https://supabase.com
# 2. Create new project
# 3. Copy connection string
# 4. Add as DATABASE_URL
```

## Step 3: Repository Setup

### 3.1 Push to GitHub

```bash
# In your project root
git init
git add .
git commit -m "Initial commit: RohanRice frontend + backend"
git branch -M main
git remote add origin https://github.com/your-username/rohanrice-marketplace.git
git push -u origin main
```

### 3.2 Connect to Hostinger

```
In hPanel:
1. Go to Hosting → Git Integration
2. Connect GitHub account
3. Select repository: rohanrice-marketplace
4. Branch: main
5. Deploy directory: / (root)
6. Enable auto-deploy: Yes
```

## Step 4: Runtime & Process Management

### 4.1 Install Node.js (if not installed)

```bash
# SSH into your Hostinger account
ssh user@your-hosting-ip

# Check Node.js version
node --version  # Should be 18+
npm --version   # Should be 9+

# If not installed, install via Hostinger control panel
# Or use:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4.2 Install PM2 (Process Manager)

```bash
npm install -g pm2

# Start backend server
cd /home/your-user/rohanrice-marketplace/server
npm install
pm2 start server.js --name "rohanrice-api"

# Save PM2 config
pm2 save
pm2 startup

# View logs
pm2 logs rohanrice-api
```

### 4.3 Install Nginx (Reverse Proxy)

```bash
sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 5: Nginx Configuration

### 5.1 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/rohanrice.conf
```

### 5.2 Add This Configuration

```nginx
upstream rohanrice_api {
    server 127.0.0.1:5000;
}

upstream rohanrice_frontend {
    server 127.0.0.1:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name rohanrice.com www.rohanrice.com api.rohanrice.com;

    return 301 https://$server_name$request_uri;
}

# HTTPS Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rohanrice.com www.rohanrice.com;

    # SSL Certificates (Let's Encrypt via Certbot)
    ssl_certificate /etc/letsencrypt/live/rohanrice.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rohanrice.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    gzip_vary on;
    gzip_min_length 1000;

    # Frontend proxy
    location / {
        proxy_pass http://rohanrice_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://rohanrice_api;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}

# HTTPS API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.rohanrice.com;

    ssl_certificate /etc/letsencrypt/live/rohanrice.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rohanrice.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://rohanrice_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for API
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 5.3 Enable Configuration

```bash
sudo ln -s /etc/nginx/sites-available/rohanrice.conf /etc/nginx/sites-enabled/
sudo nginx -t  # Test syntax
sudo systemctl restart nginx
```

## Step 6: SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d rohanrice.com -d www.rohanrice.com -d api.rohanrice.com
sudo certbot renew --dry-run  # Test auto-renewal
```

## Step 7: Frontend Deployment

### 7.1 Build Frontend

```bash
cd /home/your-user/rohanrice-marketplace
npm install
npm run build
npm run start  # Starts on port 3000
```

### 7.2 Use PM2 for Frontend

```bash
pm2 start "npm run start" --name "rohanrice-web" --cwd /home/your-user/rohanrice-marketplace
pm2 save
```

## Step 8: Backend Deployment

### 8.1 Install Dependencies

```bash
cd /home/your-user/rohanrice-marketplace/server
npm install
npm run seed  # Seed initial products
```

### 8.2 Start Backend

```bash
pm2 start server.js --name "rohanrice-api" --cwd /home/your-user/rohanrice-marketplace/server
pm2 save
```

## Step 9: Create Systemd Services (For Auto-start)

### 9.1 PM2 Systemd Integration

```bash
sudo pm2 startup
sudo pm2 save

# On reboot, PM2 will auto-start services
```

## Step 10: Monitoring & Logs

```bash
# Check PM2 status
pm2 status
pm2 monit

# View logs
pm2 logs rohanrice-api
pm2 logs rohanrice-web

# Save logs to file
pm2 logs > /var/log/rohanrice.log
```

## Step 11: Backups & Maintenance

### 11.1 Daily Database Backup

```bash
# Create backup script: /home/user/backup-db.sh
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/user/backups"
mkdir -p $BACKUP_DIR

mongodump --uri "$MONGODB_URI" --out $BACKUP_DIR/backup_$TIMESTAMP

# Keep only last 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;
```

### 11.2 Add to Crontab

```bash
crontab -e

# Add this line:
0 2 * * * /home/user/backup-db.sh
```

## Step 12: Performance Optimization

### 12.1 Enable Compression

Already added in Nginx config (gzip)

### 12.2 Browser Caching

```nginx
# In /etc/nginx/sites-available/rohanrice.conf, add:
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 12.3  Monitor Performance

```bash
# CPU & Memory
top
# or
htop

# Disk space
df -h

# Network
netstat -an | grep ESTABLISHED | wc -l
```

## Step 13: Security Hardening

### 13.1 Firewall Setup

```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
```

### 13.2 Fail2Ban (Brute-force Protection)

```bash
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 13.3 Regular Updates

```bash
sudo apt-get update
sudo apt-get upgrade -y
# Set up unattended-upgrades
sudo apt-get install -y unattended-upgrades
```

## Step 14: DNS Configuration

In your domain registrar (if not using Hostinger's DNS):

```
A Record:  rohanrice.com        → Your Hostinger IP
A Record:  www.rohanrice.com    → Your Hostinger IP
A Record:  api.rohanrice.com    → Your Hostinger IP
CNAME:     www                  → rohanrice.com (optional)
```

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs rohanrice-api
pm2 logs rohanrice-web

# Restart
pm2 restart all
```

### Nginx not working

```bash
# Test config
sudo nginx -t

# Check status
sudo systemctl status nginx

# View error log
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues

```bash
# Test MongoDB connection
npm install -g mongosh
mongosh "$MONGODB_URI"

# Or PostgreSQL
psql $DATABASE_URL
```

### SSL Certificate issues

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Check expiry
echo | openssl s_client -servername rohanrice.com -connect rohanrice.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Final Verification Checklist

- [ ] Frontend loads at https://rohanrice.com
- [ ] API responds at https://api.rohanrice.com/api/health
- [ ] Products display with SSR meta tags
- [ ] Authentication (email/OTP) works
- [ ] Admin dashboard loads products/orders
- [ ] Socket.io real-time stock updates work
- [ ] Algolia search returns results
- [ ] Contact form sends emails
- [ ] SSL certificate valid
- [ ] Database backups running
- [ ] Logs accessible via PM2
- [ ] SEO meta tags present in page source

---

**Estimated Deployment Time**: 2-3 hours
**Monthly Cost** (Hostinger): ~$20-50 depending on plan
**Support**: Check Hostinger documentation or their 24/7 support

