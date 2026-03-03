# 🚀 Deployment Guide - RohanRice Marketplace

## Table of Contents

1. [Vercel (Frontend)](#vercel-frontend)
2. [Supabase / PostgreSQL (Backend)](#supabase--postgresql-backend)
3. [Custom VPS Deployment](#custom-vps-deployment)
4. [Production Checklist](#production-checklist)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Vercel (Frontend)

### Prerequisites
- Vercel account (free)
- GitHub/GitLab repository
- Node.js 18+

### Steps

1. **Connect Repository**
   ```bash
   git push origin main
   # Go to vercel.com/new
   # Select your repository
   ```

2. **Configure Environment**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=generate-a-random-secret
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-secret
   ```

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

4. **Custom Domain**
   - Vercel dashboard → Settings → Domains
   - Add your domain (rohanrice.com)
   - Update DNS records

### Auto-deploy on Git Push

Vercel automatically deploys when you push to main branch.

---

## Supabase / PostgreSQL (Backend)

### Prerequisites
- Supabase account (free tier available)
- Django project
- Python 3.8+

### Steps

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project
   - Get connection string

2. **Configure Django**
   ```python
   # settings.py
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': env('DB_NAME'),
           'USER': env('DB_USER'),
           'PASSWORD': env('DB_PASSWORD'),
           'HOST': env('DB_HOST'),
           'PORT': env('DB_PORT'),
       }
   }
   ```

3. **Environment Variables (.env)**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   DJANGO_SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=api.yourdomain.com
   ```

4. **Run Migrations**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Deploy Django (Heroku/Render)**
   ```bash
   # Using Heroku
   heroku login
   heroku create rohanrice-api
   git push heroku main
   
   # Or Render
   # Connect GitHub to render.com
   # Deploy with PostgreSQL addon
   ```

---

## Custom VPS Deployment

### Server Setup (Ubuntu 20.04)

1. **Connect to VPS**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install Dependencies**
   ```bash
   apt update && apt upgrade -y
   
   # Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   
   # PostgreSQL
   apt install -y postgresql postgresql-contrib
   
   # Nginx
   apt install -y nginx
   
   # PM2
   npm install -g pm2
   
   # Certbot (SSL)
   apt install -y certbot python3-certbot-nginx
   ```

3. **Clone & Setup Frontend**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/rohanrice-marketplace.git
   cd rohanrice-marketplace
   npm install
   npm run build
   
   # Start with PM2
   pm2 start "npm start" --name "rohanrice-front"
   pm2 save
   ```

4. **Setup Backend (Django)**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/rohanrice-backend.git
   cd rohanrice-backend
   
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   python manage.py migrate
   python manage.py collectstatic --noinput
   
   gunicorn rohanrice.wsgi:application --bind 127.0.0.1:8000
   ```

5. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/rohanrice
   
   upstream frontend {
       server 127.0.0.1:3000;
   }
   
   upstream backend {
       server 127.0.0.1:8000;
   }
   
   server {
       listen 80;
       server_name rohanrice.com www.rohanrice.com;
       
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name rohanrice.com www.rohanrice.com;
       
       ssl_certificate /etc/letsencrypt/live/rohanrice.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/rohanrice.com/privkey.pem;
       
       # Frontend
       location / {
           proxy_pass http://frontend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # API
       location /api/ {
           proxy_pass http://backend;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
       
       # Security headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
   }
   ```

6. **Enable & Restart Nginx**
   ```bash
   ln -s /etc/nginx/sites-available/rohanrice /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

7. **SSL Certificate (Let's Encrypt)**
   ```bash
   certbot certonly --nginx -d rohanrice.com -d www.rohanrice.com
   ```

8. **Database Backup**
   ```bash
   # Daily backup script
   #!/bin/bash
   pg_dump -U postgres rohanrice_db | gzip > /backups/db-$(date +%Y%m%d).sql.gz
   
   # Add to crontab
   crontab -e
   # 0 2 * * * /path/to/backup.sh
   ```

---

## Production Checklist

### Security
- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database password changed
- [ ] Admin credentials secured
- [ ] Firewall configured (only 80, 443, 22)
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled
- [ ] Regular security updates scheduled

### Performance
- [ ] Database indexes created
- [ ] Caching configured (Redis)
- [ ] CDN integrated (Cloudflare)
- [ ] Gzip compression enabled
- [ ] Image optimization enabled
- [ ] Database connection pooling

### Monitoring
- [ ] Error logging (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Alerting configured
- [ ] Daily backups automated
- [ ] Logs rotation configured

### Testing
- [ ] Smoke tests passed
- [ ] Load testing completed
- [ ] Security scanning done
- [ ] All pages responsive tested
- [ ] Cross-browser testing done

### Content
- [ ] All pages published
- [ ] Images optimized
- [ ] Links verified (no 404s)
- [ ] Forms tested
- [ ] Contact info correct
- [ ] Privacy policy added
- [ ] Terms of service added

---

## Monitoring & Maintenance

### Weekly Tasks
```bash
# Check logs
pm2 logs

# Database backup verify
ls -la /backups/

# Nginx status
systemctl status nginx

# Disk space
df -h
```

### Monthly Tasks
```bash
# Security updates
apt update && apt upgrade

# Certificate renewal (auto with Let's Encrypt)
certbot renew --dry-run

# Database optimization
VACUUM ANALYZE;

# Performance analysis
curl -w "@curl-format.txt" https://rohanrice.com
```

### Quarterly Tasks
- Security audit
- Performance review
- Backup restore test
- Capacity planning

---

## Troubleshooting

### Application Down
```bash
# Check services
pm2 status
systemctl status nginx
systemctl status postgresql

# Restart
pm2 restart all
systemctl restart nginx

# Check logs
pm2 logs rohanrice-front
tail -f /var/log/nginx/error.log
```

### Database Issues
```bash
# Check connection
psql -U postgres -d rohanrice_db

# Check disk space
df -h /var/lib/postgresql

# Backup & restore
pg_dump rohanrice_db > backup.sql
psql rohanrice_db < backup.sql
```

### SSL Certificate Issues
```bash
# Renew
certbot renew --force-renewal

# Check expiration
certbot certificates
```

---

## Contact & Support

For deployment issues, email: deployment@rohanrice.com

Emergency hotline: +91-XXXX-XXXX-XXX

---

**Last Updated**: February 2026  
**Status**: Production Ready ✅
