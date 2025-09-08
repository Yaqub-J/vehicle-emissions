# Deployment Guide

## Quick Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Vehicle Emissions Testing System"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Import the project
   - Deploy with default settings

3. **Environment Variables (Optional)**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   ```

## Alternative: Manual Server Deployment

### Prerequisites
- Node.js 18+ installed
- PM2 (optional, for process management)

### Steps

1. **Clone and Setup**
   ```bash
   git clone <repo-url>
   cd vehicle-emissions
   npm install
   ```

2. **Build Production**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   # Or with PM2
   pm2 start npm --name "emissions-app" -- start
   ```

4. **Setup Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Considerations

### Production Database
- SQLite file will be created in project root
- Ensure write permissions for the application user
- Set up regular backups

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
cp emissions.db "backups/emissions_$DATE.db"
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database file permissions set correctly
- [ ] Regular security updates
- [ ] Access logs monitored

## Post-Deployment Testing

1. **Test Form Submission**
   - Submit test data
   - Verify database creation
   - Check PDF generation

2. **Test Certificate Verification**
   - Generate test certificate
   - Scan QR code
   - Verify data accuracy

3. **Test Search Functionality**
   - Search by license plate
   - Search by certificate number
   - Verify results

## Monitoring

### Health Checks
- Monitor `/` endpoint
- Check database connectivity
- Monitor PDF generation

### Metrics to Track
- Form submissions per day
- Certificate generations
- Failed validations
- Server response times

## Troubleshooting

### Common Production Issues

1. **Database Permission Errors**
   ```bash
   chmod 755 emissions.db
   chown www-data:www-data emissions.db
   ```

2. **PDF Generation Issues**
   - Verify jsPDF dependencies
   - Check server memory limits

3. **QR Code Problems**
   - Verify base URL configuration
   - Test QR code data generation