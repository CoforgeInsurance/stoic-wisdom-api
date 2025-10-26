# Render.com Deployment Guide - Stoic Wisdom Full Stack

This guide walks you through deploying both the backend API and frontend application to Render.com.

## 🎯 Deployment Overview

### What You'll Deploy

1. **Backend API** → Render.com Web Service (Docker)
2. **Frontend Web App** → Render.com Web Service (Node.js SSR)
3. **PostgreSQL Database** → Render.com PostgreSQL

### Architecture

```
┌─────────────────────────────────────────┐
│     Render.com Web Service              │
│     (Frontend - Next.js SSR)            │
│     - Server-side rendering             │
│     - Dynamic routes                    │
│     - Optimized images                  │
│     - Vintage design                    │
└─────────────────┬───────────────────────┘
                  │ HTTP API Calls
                  │ (CORS enabled)
                  ▼
┌─────────────────────────────────────────┐
│   Render.com Web Service (Docker)       │
│   (Backend - Rust API)                  │
│   - Axum web framework                  │
│   - PostgreSQL database                 │
│   - 15 RESTful endpoints                │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   Render.com PostgreSQL                 │
│   - Managed database                    │
│   - Automatic backups                   │
│   - Connection pooling                  │
└─────────────────────────────────────────┘
```

## ✅ Prerequisites

- GitHub account with repo access
- Render.com account (free tier available)
- Git installed locally

## 🚀 Automated Deployment (Blueprint)

The easiest way to deploy is using Render's Blueprint feature with the included `render.yaml` file.

### Option A: Deploy via Render Dashboard

1. **Sign in to Render.com**
   - Go to [https://render.com](https://render.com)
   - Click "Get Started" or "Sign In"
   - Authenticate with GitHub

2. **Create New Blueprint**
   - Click "New +" button
   - Select "Blueprint"
   - Connect your GitHub account if not already connected
   - Select the `CoforgeInsurance/stoic-wisdom-api` repository
   - Render will automatically detect the `render.yaml` file

3. **Review Services**
   - Render will show you 3 services to be created:
     - `stoic-wisdom-db` (PostgreSQL database)
     - `stoic-wisdom-api` (Backend web service)
     - `stoic-wisdom-frontend` (Frontend web service)
   - Click "Apply"

4. **Wait for Deployment**
   - Database creation: ~2-3 minutes
   - Backend deployment: ~5-10 minutes (Docker build)
   - Frontend deployment: ~3-5 minutes
   - Monitor progress in the Render dashboard

5. **Access Your Application**
   - Frontend URL: `https://stoic-wisdom-frontend.onrender.com`
   - Backend API URL: `https://stoic-wisdom-api.onrender.com`
   - Health check: `https://stoic-wisdom-api.onrender.com/health`

### Option B: Manual Deployment

If you prefer manual control, follow these steps:

#### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `stoic-wisdom-db`
   - **Database**: `stoic_wisdom`
   - **User**: `stoic_wisdom_user`
   - **Region**: `Oregon (US West)`
   - **Plan**: `Free`
3. Click "Create Database"
4. Wait for database to be ready (~2-3 minutes)
5. Note the **Internal Database URL** from the database page

#### Step 2: Deploy Backend API

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect repository: `CoforgeInsurance/stoic-wisdom-api`
3. Configure:
   - **Name**: `stoic-wisdom-api`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Plan**: `Free`
   - **Health Check Path**: `/health`
4. Add Environment Variables:
   - `DATABASE_URL`: [From database connection string]
   - `PORT`: `3000`
   - `RUST_LOG`: `info`
5. Click "Create Web Service"
6. Wait for deployment (~5-10 minutes for first build)

#### Step 3: Deploy Frontend Application

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect repository: `CoforgeInsurance/stoic-wisdom-api`
3. Configure:
   - **Name**: `stoic-wisdom-frontend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: `Free`
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://stoic-wisdom-api.onrender.com`
   - `PORT`: `3000`
5. Click "Create Web Service"
6. Wait for deployment (~3-5 minutes)

## 📊 Post-Deployment Verification

### Test Backend API

```bash
# Health check
curl https://stoic-wisdom-api.onrender.com/health

# Get random quote
curl https://stoic-wisdom-api.onrender.com/quotes/random

# List philosophers
curl https://stoic-wisdom-api.onrender.com/philosophers
```

### Test Frontend Application

1. Visit `https://stoic-wisdom-frontend.onrender.com`
2. Verify:
   - [ ] Landing page loads with a quote
   - [ ] "New Quote" button works
   - [ ] Navigation links are functional
   - [ ] Philosopher pages load
   - [ ] No CORS errors in browser console

## 🔧 Configuration Details

### Environment Variables

#### Backend (`stoic-wisdom-api`)

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | From Render PostgreSQL | Connection string to PostgreSQL database |
| `PORT` | `3000` | Port for the API (Render sets automatically) |
| `RUST_LOG` | `info` | Logging level |

#### Frontend (`stoic-wisdom-frontend`)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://stoic-wisdom-api.onrender.com` | Backend API URL |
| `PORT` | `3000` | Port for Next.js (Render sets automatically) |

### Database Migration

Render.com automatically runs migrations on deployment. The PostgreSQL database will be populated with:
- 3 philosopher profiles
- 75+ quotes
- 7 Stoic themes
- 24 timeline events
- 15 historical incidents

## 🔄 CI/CD and Auto-Deploy

Render.com automatically deploys when you push to the `main` branch:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Deployment**:
   - Render detects the push
   - Rebuilds and redeploys affected services
   - Usually completes in 5-10 minutes

3. **Monitor Deployment**:
   - View logs in Render dashboard
   - Check deployment status
   - Review build output

## 🐛 Troubleshooting

### Build Fails

**Symptom**: Service shows "Build failed" status

**Solutions**:
1. Check build logs in Render dashboard
2. Verify Dockerfile syntax
3. Ensure all dependencies are specified
4. Check for syntax errors in code

### Database Connection Issues

**Symptom**: API shows 500 errors or can't connect to database

**Solutions**:
1. Verify `DATABASE_URL` environment variable is set correctly
2. Check database is running and healthy
3. Ensure migrations completed successfully
4. Review API logs for connection errors

### Frontend Can't Reach API

**Symptom**: Frontend shows "Unable to load" errors

**Solutions**:
1. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Check API is running: `curl https://stoic-wisdom-api.onrender.com/health`
3. Verify CORS settings in backend allow frontend domain
4. Check browser console for specific errors

### Free Tier Limitations

**Issue**: Service spins down after inactivity

**Explanation**: Render free tier services spin down after 15 minutes of inactivity.

**Solutions**:
1. First request after spin-down will take 30-60 seconds
2. Consider upgrading to paid tier for production ($7/month per service)
3. Use a uptime monitoring service to keep services alive

## 💰 Cost Estimation

### Free Tier
- **PostgreSQL**: Free (500MB storage, 90-day expiry)
- **Web Services**: Free (750 hours/month, spins down after inactivity)
- **Bandwidth**: 100GB/month free

**Total**: $0/month (limited)

### Starter Tier (Recommended for Production)
- **PostgreSQL**: $7/month (256MB RAM, 1GB storage)
- **Backend Web Service**: $7/month (512MB RAM)
- **Frontend Web Service**: $7/month (512MB RAM)

**Total**: $21/month

## 📈 Monitoring

### View Logs

1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time logs
5. Filter by error level

### Metrics

1. Go to service page
2. Click "Metrics" tab
3. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Alerts

1. Go to service settings
2. Configure notifications
3. Set up alerts for:
   - Service down
   - High error rate
   - Memory issues

## 🔐 Security Best Practices

### Environment Variables
- Never commit secrets to Git
- Use Render's environment variable management
- Rotate database credentials periodically

### CORS Configuration
- Update backend CORS to restrict origins to your frontend domain only
- Edit `src/main.rs` CORS configuration:
  ```rust
  let cors = CorsLayer::new()
      .allow_origin("https://stoic-wisdom-frontend.onrender.com".parse::<HeaderValue>().unwrap())
      .allow_methods(Any)
      .allow_headers(Any);
  ```

### Database Access
- Use Render's internal database URL for backend
- Never expose database credentials publicly
- Enable SSL for database connections

## 🎯 Next Steps

After successful deployment:

1. **Add Custom Domain** (Optional):
   - Go to service settings
   - Click "Custom Domains"
   - Follow instructions to add your domain
   - Render provides free SSL certificates

2. **Monitor Performance**:
   - Check logs regularly
   - Monitor response times
   - Watch for errors

3. **Scale as Needed**:
   - Upgrade to paid tier for production
   - Increase resources if needed
   - Add more database storage

4. **Backup Your Data**:
   - Render automatically backs up PostgreSQL
   - Consider manual exports for important data
   - Test restore procedures

## 📚 Additional Resources

- [Render.com Documentation](https://render.com/docs)
- [Render PostgreSQL Guide](https://render.com/docs/databases)
- [Docker on Render](https://render.com/docs/docker)
- [Next.js Deployment](https://render.com/docs/deploy-nextjs)

## ✅ Deployment Checklist

- [ ] PostgreSQL database created and running
- [ ] Backend API deployed and passing health check
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured correctly
- [ ] Database migrations completed successfully
- [ ] Frontend can communicate with backend API
- [ ] No CORS errors in browser console
- [ ] All pages and features working correctly
- [ ] Logs show no critical errors
- [ ] Custom domain configured (optional)

## 🎉 Success!

You've successfully deployed a full-stack Stoic Wisdom application to Render.com with:
- High-performance Rust backend API
- Modern Next.js SSR frontend
- Managed PostgreSQL database
- Automated CI/CD pipeline
- Free tier deployment option

**Your app is live and ready to share ancient wisdom with the world!**

---

For support or questions:
- Check [Render.com Support](https://render.com/docs/support)
- Open an issue on GitHub
- Review deployment logs in Render dashboard
